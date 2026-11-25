"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { answerMatches, itemOptions, type Item, type Teil } from "@/lib/exam-model";
import { cn } from "@/lib/cn";

export function Stimuli({ teil }: { teil: Teil }) {
  const pictures = teil.stimuli.filter((stimulus) => stimulus.kind === "image");
  const texts = teil.stimuli.filter((stimulus) => stimulus.kind === "text");
  const ads = texts.filter((stimulus) => stimulus.kind === "text" && stimulus.genre === "ad");
  const rest = texts.filter((stimulus) => stimulus.kind === "text" && stimulus.genre !== "ad");
  return (
    <div className="space-y-3">
      {pictures.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {pictures.map((stimulus) =>
            stimulus.kind === "image" ? (
              <Card key={stimulus.id} className="p-3">
                <Image src={stimulus.src} alt={stimulus.alt} width={320} height={112} className="h-28 w-full rounded-md object-contain" />
                <p className="mt-2 text-micro text-muted">{stimulus.alt}</p>
              </Card>
            ) : null,
          )}
        </div>
      ) : null}
      {ads.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {ads.map((stimulus) =>
            stimulus.kind === "text" ? (
              <Card key={stimulus.id} className="p-3">
                <h3 className="text-small font-semibold">{stimulus.title}</h3>
                <p className="mt-1 text-small text-muted">{stimulus.body}</p>
              </Card>
            ) : null,
          )}
        </div>
      ) : null}
      {rest.map((stimulus) =>
        stimulus.kind === "text" ? (
          <Card key={stimulus.id} className="p-4">
            {stimulus.title ? <h3 className="text-h3 font-semibold">{stimulus.title}</h3> : null}
            <p className={cn("whitespace-pre-wrap text-small", stimulus.title ? "mt-2" : "", stimulus.genre === "comment" ? "text-foreground" : "")}>
              {stimulus.body}
            </p>
          </Card>
        ) : null,
      )}
    </div>
  );
}

export function SolvedExample({ teil }: { teil: Teil }) {
  const example = teil.example;
  if (!example) return null;
  const label = itemOptions(example, teil).find((option) => option.id === String(example.correct))?.label ?? String(example.correct);
  return (
    <Card className="border-brand bg-brand-softer p-4">
      <p className="text-micro font-semibold text-brand-text">Beispiel · schon gelöst</p>
      <p className="mt-1 font-medium">
        {example.number > 0 ? `${example.number}. ` : ""}
        {example.prompt}
      </p>
      <p className="mt-2 text-small">Lösung: {label}</p>
    </Card>
  );
}

function OptionButton({
  selected,
  correct,
  wrong,
  disabled,
  children,
  onClick,
}: {
  selected: boolean;
  correct?: boolean;
  wrong?: boolean;
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-lg border px-3 py-2 text-left text-small transition",
        selected && !correct && !wrong && "border-brand bg-brand-soft font-semibold text-brand-text",
        correct && "border-brand bg-success-soft font-semibold",
        wrong && "border-danger bg-danger-soft",
        !selected && !correct && !wrong && "border-border bg-raised hover:bg-sunken",
        disabled && "cursor-default",
      )}
    >
      {children}
    </button>
  );
}

export function ItemCard({
  item,
  teil,
  value,
  onChange,
  locked,
  reveal,
  highlight,
  taken,
}: {
  item: Item;
  teil: Teil;
  value?: string;
  onChange?: (optionId: string) => void;
  locked?: boolean;
  reveal?: boolean;
  highlight?: boolean;
  taken?: Set<string>;
}) {
  const options = itemOptions(item, teil);
  const correctId = Array.isArray(item.correct) ? item.correct[0] : item.correct;
  const right = reveal ? answerMatches(item.correct, value) : false;
  if (item.type === "fill") {
    return (
      <Card className={cn("p-4", reveal && (right ? "bg-success-soft" : "bg-danger-soft"))} id={`item-${item.id}`}>
        <h3 className="font-semibold">
          {item.number}. {item.prompt}
        </h3>
        <input
          className="mt-3 h-11 w-full rounded-lg border border-border bg-raised px-3"
          value={value ?? ""}
          disabled={locked || reveal}
          aria-label={item.prompt}
          onChange={(event) => onChange?.(event.target.value)}
        />
        {reveal ? <p className="mt-2 text-small">Lösung: {Array.isArray(item.correct) ? item.correct[0] : item.correct}</p> : null}
        {reveal ? <p className="mt-1 text-small text-muted">{item.explanation}</p> : null}
      </Card>
    );
  }
  return (
    <Card className={cn("p-4", highlight && "ring-2 ring-brand", reveal && (right ? "bg-success-soft" : "bg-danger-soft"))} id={`item-${item.id}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-semibold">
          {item.number}. {item.prompt}
        </h3>
        {reveal ? <Badge tone={right ? "success" : "danger"}>{right ? "Richtig" : "Falsch"}</Badge> : null}
      </div>
      <div className={cn("mt-3 grid gap-2", options.length > 4 ? "grid-cols-2 sm:grid-cols-5" : "sm:grid-cols-2")}>
        {options.map((option) => {
          const selected = value === option.id;
          const showCorrect = reveal && option.id === correctId;
          const showWrong = reveal && selected && option.id !== correctId;
          return (
            <OptionButton
              key={option.id}
              selected={selected}
              correct={showCorrect}
              wrong={showWrong}
              disabled={locked || reveal || (item.type === "gapBank" && !teil.allowReuse && taken?.has(option.id) && value !== option.id)}
              onClick={() => onChange?.(option.id)}
            >
              {option.image ? <Image src={option.image} alt="" width={160} height={48} className="mb-1 h-12 w-full object-contain" /> : null}
              {option.label}
            </OptionButton>
          );
        })}
      </div>
      {reveal ? <p className="mt-3 text-small text-muted">{item.explanation}</p> : null}
    </Card>
  );
}

export function TeilQuestions({
  teil,
  answers,
  onAnswer,
  locked,
  reveal,
  highlightIds,
}: {
  teil: Teil;
  answers: Record<string, string>;
  onAnswer?: (itemId: string, optionId: string) => void;
  locked?: boolean;
  reveal?: boolean;
  highlightIds?: string[];
}) {
  return (
    <div className="space-y-3">
      {teil.items.map((item) => {
        const taken = new Set(
          teil.items.filter((other) => other.id !== item.id && other.type === "gapBank").map((other) => answers[other.id]).filter(Boolean),
        );
        return (
          <ItemCard
            key={item.id}
            item={item}
            teil={teil}
            value={answers[item.id]}
            onChange={onAnswer ? (optionId) => onAnswer(item.id, optionId) : undefined}
            locked={locked}
            reveal={reveal}
            highlight={highlightIds?.includes(item.id)}
            taken={taken}
          />
        );
      })}
    </div>
  );
}
