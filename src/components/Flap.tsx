"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-/";

/** Mayúsculas, sin tildes, solo caracteres que el tablero sabe dibujar. */
export const normalizar = (t: string) =>
  t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .split("")
    .map((c) => (CHARS.includes(c) ? c : " "))
    .join("");

type Tone = "go" | "busy" | "held" | undefined;

/**
 * Una celda de tablero: al cambiar de carácter recorre algunos caracteres intermedios
 * girando en X, como un split-flap real. `delay` escalona las celdas de una fila.
 */
function Cell({ char, delay, tone, large }: { char: string; delay: number; tone: Tone; large: boolean }) {
  const [shown, setShown] = useState(" ");
  const [flip, setFlip] = useState(false);
  const shownRef = useRef(" ");

  useEffect(() => {
    if (char === shownRef.current) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const set = (c: string) => {
      shownRef.current = c;
      setShown(c);
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      timers.push(setTimeout(() => set(char), 0));
    } else {
      const from = CHARS.indexOf(shownRef.current);
      const to = CHARS.indexOf(char);
      const total = (to - from + CHARS.length) % CHARS.length;
      const steps = Math.min(total, 6);
      const seq: string[] = [];
      for (let i = 1; i < steps; i++) seq.push(CHARS[(from + Math.floor((total * i) / steps)) % CHARS.length]);
      seq.push(char);
      seq.forEach((c, i) => {
        timers.push(
          setTimeout(() => {
            setFlip(true);
            timers.push(
              setTimeout(() => {
                set(c);
                setFlip(false);
              }, 90),
            );
          }, delay + i * 150),
        );
      });
    }
    return () => timers.forEach(clearTimeout);
  }, [char, delay]);

  return (
    <span className={`flap${large ? " flap-lg" : ""}`} data-flip={flip ? "1" : "0"} data-tone={tone} aria-hidden>
      <span>{shown === " " ? " " : shown}</span>
    </span>
  );
}

/** Fila de celdas de ancho fijo: rellena o recorta `text` a `width` caracteres. */
export default function Flap({
  text,
  width,
  tone,
  large = false,
  align = "left",
  startDelay = 0,
}: {
  text: string;
  width: number;
  tone?: Tone;
  large?: boolean;
  align?: "left" | "right";
  startDelay?: number;
}) {
  const clean = normalizar(text).slice(0, width);
  const padded = align === "right" ? clean.padStart(width, " ") : clean.padEnd(width, " ");
  return (
    <span className="flap-row" role="text" aria-label={text}>
      {padded.split("").map((c, i) => (
        <Cell key={i} char={c} delay={startDelay + i * 60} tone={tone} large={large} />
      ))}
    </span>
  );
}
