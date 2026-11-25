#!/usr/bin/env python3
"""Build exam MP3s from scripts/tts/audio-scripts.json.

Uses edge-tts per line, then ffmpeg to join turns. Nothing here runs on the website.
"""

from __future__ import annotations

import asyncio
import hashlib
import json
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
JSON_PATH = Path(__file__).resolve().parent / "audio-scripts.json"
CACHE = Path(__file__).resolve().parent / "cache"
WORK = Path(__file__).resolve().parent / "work"
PUBLIC = ROOT / "public"
OUT_CLIPS = PUBLIC / "audio" / "goethe-b1"
OUT_CUES = PUBLIC / "audio" / "cues"
MANIFEST = ROOT / "src" / "content" / "exams" / "audio-manifest.json"


def fail(message: str) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(1)


def check_voices(lines: list[dict], label: str) -> None:
    owner: dict[str, str] = {}
    for line in lines:
        voice = line["voice"]
        speaker = line["speaker"]
        previous = owner.get(voice)
        if previous and previous != speaker:
            fail(f"{label}: {previous} und {speaker} nutzen dieselbe Stimme {voice}")
        owner[voice] = speaker


def check_teil(teil: dict) -> None:
    owner: dict[str, str] = {}
    for speaker in teil["voices"]:
        previous = owner.get(speaker["voice"])
        if previous and previous != speaker["id"]:
            fail(f"Teil {teil['id']}: {previous} und {speaker['id']} nutzen {speaker['voice']}")
        owner[speaker["voice"]] = speaker["id"]


def sha(voice: str, rate: str, pitch: str, text: str) -> str:
    raw = f"{voice}|{rate}|{pitch}|{text}".encode()
    return hashlib.sha1(raw).hexdigest()


async def synthesize(text: str, voice: str, rate: str, pitch: str, dest: Path) -> None:
    import edge_tts

    last = "edge-tts"
    for attempt in range(4):
        try:
            communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
            await communicate.save(str(dest))
            if dest.stat().st_size < 200:
                raise RuntimeError("Datei zu klein")
            return
        except Exception as error:  # network or voice endpoint
            last = str(error)
            await asyncio.sleep(1.5 * (attempt + 1))
    fail(f"Stimme {voice} für „{text[:40]}“: {last}")


async def line_file(line: dict, sem: asyncio.Semaphore) -> Path:
    key = sha(line["voice"], line["rate"], line["pitch"], line["text"])
    dest = CACHE / f"{key}.mp3"
    if dest.exists() and dest.stat().st_size > 200:
        return dest
    async with sem:
        if dest.exists() and dest.stat().st_size > 200:
            return dest
        tmp = dest.with_suffix(".part.mp3")
        await synthesize(line["text"], line["voice"], line["rate"], line["pitch"], tmp)
        tmp.replace(dest)
        return dest


def run(cmd: list[str]) -> None:
    subprocess.check_call(cmd, stdout=subprocess.DEVNULL)


def silence(ms: int) -> Path:
    path = CACHE / f"pause-{ms}.mp3"
    if path.exists():
        return path
    run(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-f",
            "lavfi",
            "-i",
            "anullsrc=r=24000:cl=mono",
            "-t",
            f"{ms / 1000:.3f}",
            "-c:a",
            "libmp3lame",
            "-b:a",
            "64k",
            str(path),
        ]
    )
    return path


def concat_raw(parts: list[Path], dest: Path) -> None:
    list_path = WORK / f"{dest.stem}.txt"
    lines = [f"file '{part.as_posix()}'" for part in parts]
    list_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    run(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(list_path),
            "-ac",
            "1",
            "-ar",
            "24000",
            "-c:a",
            "libmp3lame",
            "-b:a",
            "64k",
            str(dest),
        ]
    )


LOUDNORM = "loudnorm=I=-19:TP=-1.5:LRA=7"

# Seconds of scene bed before the first word. Reading pauses stay digital silence in the player.
PREROLL = {"phone": 4.0, "station": 2.8, "shop": 1.6}
BED_DELAY = {"station": 1.0, "shop": 0.6}


def finish_mix(speech: Path, dest: Path, scene: str) -> None:
    """Mix a quiet generated bed under the speech and set one loudness.

    Beds are ffmpeg noise, not recordings. Station and radio clips have no opening chime.
    Phone clips start with a few seconds of line hiss. The exam cue is not passed through here.
    """
    length = max(duration(speech), 0.4)
    bed = WORK / f"{dest.stem}-bed.mp3"
    filtered = WORK / f"{dest.stem}-speech.mp3"
    scene = scene if scene in {"station", "shop", "phone", "radio", "cafe", "street", "lecture"} else "quiet"
    speech_filters = {
        "station": "highpass=f=120,aecho=0.8:0.85:70|140|260:0.28|0.14|0.07,volume=1.15",
        "shop": "highpass=f=120,aecho=0.85:0.88:50|110:0.16|0.08,volume=1.1",
        "phone": "highpass=f=250,lowpass=f=2300,volume=1.2",
        "radio": "acompressor=threshold=-20dB:ratio=2.5:attack=5:release=80,volume=1.15",
        "cafe": "aecho=0.9:0.95:15:0.04,volume=1.05",
        "street": "highpass=f=80,volume=1.05",
        "lecture": "aecho=0.85:0.9:40:0.08,volume=1.05",
        "quiet": "volume=1.05",
    }[scene]
    run(
        [
            "ffmpeg", "-y", "-loglevel", "error", "-i", str(speech),
            "-af", speech_filters, "-ac", "1", "-ar", "24000",
            "-c:a", "libmp3lame", "-b:a", "64k", str(filtered),
        ]
    )
    preroll = PREROLL.get(scene, 0.0)
    bed_delay = BED_DELAY.get(scene, 0.0)
    if scene == "quiet":
        run(
            [
                "ffmpeg", "-y", "-loglevel", "error", "-i", str(filtered),
                "-af", LOUDNORM, "-ac", "1", "-ar", "24000",
                "-c:a", "libmp3lame", "-b:a", "64k", str(dest),
            ]
        )
        return
    bed_len = length + preroll + 0.4
    noise = {
        "station": f"anoisesrc=color=brown:sample_rate=24000:duration={bed_len:.2f},lowpass=f=180,volume=0.025",
        "shop": f"anoisesrc=color=brown:sample_rate=24000:duration={bed_len:.2f},lowpass=f=220,volume=0.02",
        "phone": f"anoisesrc=color=white:sample_rate=24000:duration={bed_len:.2f},highpass=f=250,lowpass=f=2300,volume=0.01",
        "radio": f"anoisesrc=color=brown:sample_rate=24000:duration={bed_len:.2f},lowpass=f=140,volume=0.04",
        "cafe": f"anoisesrc=color=pink:sample_rate=24000:duration={bed_len:.2f},bandpass=f=400:width_type=h:w=500,volume=0.018",
        "street": f"anoisesrc=color=brown:sample_rate=24000:duration={bed_len:.2f},lowpass=f=200,volume=0.02",
        "lecture": f"anoisesrc=color=pink:sample_rate=24000:duration={bed_len:.2f},lowpass=f=250,volume=0.012",
    }[scene]
    run(
        [
            "ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", noise,
            "-ac", "1", "-ar", "24000", "-c:a", "libmp3lame", "-b:a", "64k", str(bed),
        ]
    )
    speech_ms = int(preroll * 1000)
    bed_ms = int(bed_delay * 1000)
    mix = (
        f"[0:a]adelay={speech_ms}:all=1[sp];"
        f"[1:a]adelay={bed_ms}:all=1[bd];"
        f"[sp][bd]amix=inputs=2:duration=longest:dropout_transition=0:normalize=0,{LOUDNORM}[a]"
    )
    run(
        [
            "ffmpeg", "-y", "-loglevel", "error", "-i", str(filtered), "-i", str(bed),
            "-filter_complex", mix, "-map", "[a]",
            "-ac", "1", "-ar", "24000", "-c:a", "libmp3lame", "-b:a", "64k", str(dest),
        ]
    )


def duration(path: Path) -> float:
    raw = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        text=True,
    )
    return round(float(raw.strip()), 2)


MIX_VERSION = "exam-cue-3"
STAMPS = CACHE / "built-stamps.json"


def clip_stamp(clip: dict) -> str:
    payload = json.dumps(
        {"v": MIX_VERSION, "scene": clip.get("scene", "quiet"), "lines": clip["lines"]},
        sort_keys=True,
        ensure_ascii=False,
    )
    return hashlib.sha1(payload.encode()).hexdigest()


def load_stamps() -> dict:
    if STAMPS.exists():
        return json.loads(STAMPS.read_text(encoding="utf-8"))
    return {}


def save_stamps(stamps: dict) -> None:
    STAMPS.write_text(json.dumps(stamps), encoding="utf-8")


def write_gong(dest: Path) -> None:
    """Exam cue: 547.2 Hz, 1.62 s, sustain about -27 dBFS. Not loudness-normalised."""
    run(
        [
            "ffmpeg", "-y", "-loglevel", "error",
            "-f", "lavfi", "-i", "sine=frequency=547.2:sample_rate=24000:duration=1.62",
            "-f", "lavfi", "-i", "sine=frequency=1520.8:sample_rate=24000:duration=1.62",
            "-filter_complex",
            "[0:a]volume=0.507[f];[1:a]volume=0.076[h];"
            "[f][h]amix=inputs=2:duration=first:normalize=0,"
            "afade=t=in:st=0:d=0.02,afade=t=out:st=0.92:d=0.70[a]",
            "-map", "[a]", "-ac", "1", "-ar", "24000",
            "-c:a", "libmp3lame", "-b:a", "64k", str(dest),
        ]
    )


def clip_groups(data: dict) -> list[dict]:
    if "groups" in data:
        return data["groups"]
    return [{"folder": "goethe-b1", "clips": data["clips"], "teile": data.get("teile", [])}]


async def main() -> None:
    if not JSON_PATH.exists():
        fail("audio-scripts.json fehlt. Zuerst export-audio ausführen.")
    data = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    groups = clip_groups(data)
    for group in groups:
        for teil in group.get("teile", []):
            check_teil(teil)
        for clip in group["clips"]:
            check_voices(clip["lines"], clip["id"])

    CACHE.mkdir(parents=True, exist_ok=True)
    WORK.mkdir(parents=True, exist_ok=True)
    OUT_CLIPS.mkdir(parents=True, exist_ok=True)
    OUT_CUES.mkdir(parents=True, exist_ok=True)

    narrator = data["narrator"]
    cue_lines = [
        {
            "id": "repeat",
            "lines": [
                {
                    "speaker": narrator["id"],
                    "voice": narrator["voice"],
                    "rate": narrator.get("rate", "-5%"),
                    "pitch": narrator.get("pitch", "+0Hz"),
                    "text": data["repeat"],
                    "pauseAfterMs": 0,
                }
            ],
        },
        {
            "id": "headphone",
            "lines": [
                {
                    "speaker": narrator["id"],
                    "voice": narrator["voice"],
                    "rate": narrator.get("rate", "-5%"),
                    "pitch": narrator.get("pitch", "+0Hz"),
                    "text": data["headphone"],
                    "pauseAfterMs": 0,
                }
            ],
        },
    ]
    for cue in cue_lines:
        check_voices(cue["lines"], cue["id"])

    sem = asyncio.Semaphore(4)
    stamps = load_stamps()
    jobs = []

    skip = os.environ.get("AUDIO_SKIP", "")

    def needs_build(clip: dict, dest: Path) -> bool:
        if skip and re.search(skip, clip["id"]):
            return False
        key = str(dest)
        return not (dest.exists() and dest.stat().st_size > 400 and stamps.get(key) == clip_stamp(clip))

    planned: list[tuple[dict, Path]] = []
    for group in groups:
        for clip in group["clips"]:
            dest = PUBLIC / "audio" / group["folder"] / f"{clip['id']}.mp3"
            planned.append((clip, dest))
    for clip in cue_lines:
        clip.setdefault("scene", "quiet")
        planned.append((clip, OUT_CUES / f"{clip['id']}.mp3"))
    for clip, dest in planned:
        if not needs_build(clip, dest):
            continue
        for line in clip["lines"]:
            jobs.append(line_file(line, sem))
    if jobs:
        await asyncio.gather(*jobs)

    manifest = {"cues": {}, "clips": {}}
    gong = OUT_CUES / "gong.mp3"
    write_gong(gong)
    manifest["cues"]["gong"] = {"src": "/audio/cues/gong.mp3", "durationSec": duration(gong)}

    def line_parts(lines: list[dict]) -> list[Path]:
        parts: list[Path] = []
        for index, line in enumerate(lines):
            parts.append(CACHE / f"{sha(line['voice'], line['rate'], line['pitch'], line['text'])}.mp3")
            pause_ms = int(line.get("pauseAfterMs") or 0)
            if pause_ms > 0 and index < len(lines) - 1:
                parts.append(silence(pause_ms))
        return parts

    def render(clip: dict, folder: Path, web_dir: str, bucket: str) -> None:
        folder.mkdir(parents=True, exist_ok=True)
        dest = folder / f"{clip['id']}.mp3"
        if needs_build(clip, dest):
            lines = clip["lines"]
            signal_at = next((index for index, line in enumerate(lines) if "dieses Signal" in line["text"]), None)
            scene = clip.get("scene", "quiet")
            if signal_at is None:
                dry = WORK / f"{dest.stem}-dry.mp3"
                concat_raw(line_parts(lines), dry)
                finish_mix(dry, dest, scene)
            else:
                head = WORK / f"{dest.stem}-head.mp3"
                concat_raw(line_parts(lines[: signal_at + 1]), WORK / f"{dest.stem}-head-dry.mp3")
                finish_mix(WORK / f"{dest.stem}-head-dry.mp3", head, "quiet")
                pieces = [head, gong, silence(400)]
                if signal_at + 1 < len(lines):
                    tail = WORK / f"{dest.stem}-tail.mp3"
                    concat_raw(line_parts(lines[signal_at + 1 :]), WORK / f"{dest.stem}-tail-dry.mp3")
                    finish_mix(WORK / f"{dest.stem}-tail-dry.mp3", tail, "quiet")
                    pieces.append(tail)
                concat_raw(pieces, dest)
            stamps[str(dest)] = clip_stamp(clip)
            print("built", clip["id"], scene)
        else:
            print("keep", clip["id"])
        manifest[bucket][clip["id"]] = {"src": f"{web_dir}/{clip['id']}.mp3", "durationSec": duration(dest)}

    for group in groups:
        for clip in group["clips"]:
            render(clip, PUBLIC / "audio" / group["folder"], f"/audio/{group['folder']}", "clips")
    for clip in cue_lines:
        render(clip, OUT_CUES, "/audio/cues", "cues")

    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    save_stamps(stamps)
    print(f"manifest {MANIFEST}")


if __name__ == "__main__":
    asyncio.run(main())
