"use client";

import { CSSProperties, useEffect, useState } from "react";
import "./StrokeText.css";

type StrokeTextProps = {
  text: string;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  drawDuration?: number;
  fillDelay?: number;
  stagger?: number;
  ease?: "power2.out" | string;
  trigger?: "mount";
  fillMode?: "wipe";
  fontSize?: string | number;
  fontWeight?: number;
  letterSpacing?: number;
  className?: string;
};

const cssEase = (ease: string) => (ease === "power2.out" ? "cubic-bezier(.22, 1, .36, 1)" : ease);

/** Stroke-first display text with a left-to-right fill wipe. */
export default function StrokeText({
  text,
  strokeColor = "#A78BFA",
  fillColor = "#F8FAFC",
  strokeWidth = 1.4,
  drawDuration = 1.6,
  fillDelay = 0.2,
  stagger = 0.05,
  ease = "power2.out",
  trigger = "mount",
  fillMode = "wipe",
  fontSize = 128,
  fontWeight = 800,
  letterSpacing = -4,
  className = "",
}: StrokeTextProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (trigger !== "mount") return undefined;
    const frame = window.requestAnimationFrame(() => setActive(true));
    return () => window.cancelAnimationFrame(frame);
  }, [trigger]);

  const style = {
    "--stroke-color": strokeColor,
    "--fill-color": fillColor,
    "--stroke-width": `${strokeWidth}px`,
    "--draw-duration": `${drawDuration}s`,
    "--fill-delay": `${fillDelay}s`,
    "--stagger": `${stagger}s`,
    "--text-ease": cssEase(ease),
    "--font-size": typeof fontSize === "number" ? `${fontSize}px` : fontSize,
    "--font-weight": fontWeight,
    "--letter-spacing": `${letterSpacing}px`,
  } as CSSProperties;
  let characterIndex = 0;

  return (
    <h1 className={`stroke-text ${active ? "is-active" : ""} ${className}`.trim()} style={style} aria-label={text.replace(/\n/g, " ")}>
      {text.split("\n").map((line, lineIndex) => (
        <span className="stroke-text__line" key={`${line}-${lineIndex}`} aria-hidden="true">
          {[...line].map((character) => {
            const index = characterIndex++;
            return (
              <span className="stroke-text__char" style={{ "--char-index": index } as CSSProperties} key={`${character}-${index}`}>
                <span className="stroke-text__outline">{character === " " ? " " : character}</span>
                <span className={`stroke-text__fill stroke-text__fill--${fillMode}`}>{character === " " ? " " : character}</span>
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
