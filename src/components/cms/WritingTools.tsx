"use client";
import { useFormFields } from "@payloadcms/ui";
import { useEffect, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
function textOf(value: unknown): string {
  if (!value || typeof value !== "object") return "";
  if (Array.isArray(value)) return value.map(textOf).join(" ");
  return Object.entries(value)
    .map(([key, item]) =>
      ["text", "body", "answer", "question", "code"].includes(key) &&
      typeof item === "string"
        ? item
        : typeof item === "object"
          ? textOf(item)
          : "",
    )
    .join(" ");
}
export function WritingTools() {
  const content = useFormFields(([fields]) => fields.content?.value);
  const [focus, setFocus] = useState(false);
  const words = textOf(content).trim().split(/\s+/).filter(Boolean).length;
  useEffect(() => {
    document.body.classList.toggle("cms-writing-focus", focus);
    return () => document.body.classList.remove("cms-writing-focus");
  }, [focus]);
  return (
    <div className="cms-writing-tools">
      <span>
        {words} mots · {Math.max(1, Math.ceil(words / 220))} min de lecture
      </span>
      <button
        type="button"
        aria-pressed={focus}
        onClick={() => setFocus(!focus)}
      >
        {focus ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        {focus ? "Afficher les réglages" : "Mode rédaction"}
      </button>
    </div>
  );
}
