#!/usr/bin/env python3
"""Build exam MP3s from scripts/tts/audio-scripts.json.

Uses edge-tts per line, then ffmpeg to join turns. Nothing here runs on the website.
"""

from __future__ import annotations

import asyncio
import hashlib
import json
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


def concat(parts: list[Path], dest: Path) -> None:
    list_path = WORK / f"{dest.stem}.txt"
    lines = []
    for part in parts:
        lines.append(f"file '{part.as_posix()}'")
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
            "-af",
            "loudnorm=I=-16:TP=-1.5:LRA=11",
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


def write_gong(dest: Path) -> None:
    run(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-f",
            "lavfi",
            "-i",
            "sine=frequency=880:sample_rate=24000:duration=0.5",
            "-af",
            "afade=t=in:st=0:d=0.02,afade=t=out:st=0.28:d=0.22,volume=0.55",
            "-ac",
            "1",
            "-c:a",
            "libmp3lame",
            "-b:a",
            "64k",
            str(dest),
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
    pending = []
    for group in groups:
        for clip in group["clips"]:
            folder = PUBLIC / "audio" / group["folder"]
            dest = folder / f"{clip['id']}.mp3"
            if dest.exists() and dest.stat().st_size > 400:
                continue
            for line in clip["lines"]:
                pending.append(line_file(line, sem))
    for clip in cue_lines:
        dest = OUT_CUES / f"{clip['id']}.mp3"
        if dest.exists() and dest.stat().st_size > 400:
            continue
        for line in clip["lines"]:
            pending.append(line_file(line, sem))
    if pending:
        await asyncio.gather(*pending)

    manifest = {"cues": {}, "clips": {}}
    gong = OUT_CUES / "gong.mp3"
    if not gong.exists():
        write_gong(gong)
    manifest["cues"]["gong"] = {"src": "/audio/cues/gong.mp3", "durationSec": duration(gong)}

    def render(clip: dict, folder: Path, web_dir: str, bucket: str) -> None:
        folder.mkdir(parents=True, exist_ok=True)
        dest = folder / f"{clip['id']}.mp3"
        if not (dest.exists() and dest.stat().st_size > 400):
            parts: list[Path] = []
            for index, line in enumerate(clip["lines"]):
                parts.append(CACHE / f"{sha(line['voice'], line['rate'], line['pitch'], line['text'])}.mp3")
                pause_ms = int(line.get("pauseAfterMs") or 0)
                if pause_ms > 0 and index < len(clip["lines"]) - 1:
                    parts.append(silence(pause_ms))
            concat(parts, dest)
            print("built", clip["id"])
        else:
            print("keep", clip["id"])
        manifest[bucket][clip["id"]] = {"src": f"{web_dir}/{clip['id']}.mp3", "durationSec": duration(dest)}

    for group in groups:
        for clip in group["clips"]:
            render(clip, PUBLIC / "audio" / group["folder"], f"/audio/{group['folder']}", "clips")
    for clip in cue_lines:
        render(clip, OUT_CUES, "/audio/cues", "cues")

    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"manifest {MANIFEST}")


if __name__ == "__main__":
    asyncio.run(main())
