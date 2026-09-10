"use client";

import { useEffect, useRef } from "react";

type ThinkingDotsProps = {
  className?: string;
  color?: string;
  accentColor?: string;
  opacity?: number;
};

const rgb = (hex: string) => {
  const value = hex.replace("#", "");
  const normalized = value.length === 3 ? value.split("").map((part) => part + part).join("") : value;
  return [parseInt(normalized.slice(0, 2), 16), parseInt(normalized.slice(2, 4), 16), parseInt(normalized.slice(4, 6), 16)];
};

export default function ThinkingDots({ className = "", color = "#714e73", accentColor = "#19122c", opacity = 0.86 }: ThinkingDotsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext("2d");
    if (!context) return undefined;

    const base = rgb(color);
    const accent = rgb(accentColor);
    let width = 1;
    let height = 1;
    let ratio = 1;
    let animation = 0;
    const pointer = { x: 0.5, y: 0.5, active: false };
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const box = canvas.getBoundingClientRect();
      ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, box.width);
      height = Math.max(1, box.height);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const spacing = Math.max(22, Math.min(36, height * 0.058));
      const t = time * 0.00018;
      const clouds = [
        [0.5 + Math.sin(t * 1.1) * 0.13, 0.5 + Math.cos(t * 0.86) * 0.11, 0.26],
        [0.5 + Math.cos(t * 0.72 + 2.1) * 0.19, 0.48 + Math.sin(t * 0.96 + 1.4) * 0.15, 0.2],
        [0.5 + Math.sin(t * 0.64 + 4.4) * 0.17, 0.5 + Math.cos(t * 1.17 + 2.8) * 0.13, 0.18],
      ];
      if (pointer.active) clouds.push([pointer.x, pointer.y, 0.16]);

      for (let y = spacing * 0.5; y < height; y += spacing) {
        for (let x = spacing * 0.5; x < width; x += spacing) {
          const nx = x / width;
          const ny = y / height;
          let density = 0;
          for (const [cx, cy, spread] of clouds) {
            const dx = nx - cx;
            const dy = ny - cy;
            density += Math.exp(-(dx * dx + dy * dy) / (spread * spread));
          }
          density = Math.min(1, density * 0.66);
          const pulse = 0.5 + 0.5 * Math.sin(t * 9 + nx * 9 - ny * 6);
          const radius = 0.75 + density * 2.6 + pulse * density * 0.7;
          const mix = Math.max(0, Math.min(1, (density - 0.4) / 0.6));
          const r = Math.round(base[0] + (accent[0] - base[0]) * mix);
          const g = Math.round(base[1] + (accent[1] - base[1]) * mix);
          const b = Math.round(base[2] + (accent[2] - base[2]) * mix);
          const alpha = (0.08 + density * 0.68 + pulse * density * 0.14) * opacity;
          context.beginPath();
          context.fillStyle = `rgba(${r},${g},${b},${alpha})`;
          context.arc(x, y, radius, 0, Math.PI * 2);
          context.fill();
        }
      }
    };

    const move = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      pointer.active = event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
      if (pointer.active) {
        pointer.x = (event.clientX - box.left) / box.width;
        pointer.y = (event.clientY - box.top) / box.height;
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener("pointermove", move, { passive: true });
    resize();

    const loop = (time: number) => {
      draw(time);
      if (!prefersReducedMotion) animation = requestAnimationFrame(loop);
    };
    loop(performance.now());

    return () => {
      cancelAnimationFrame(animation);
      observer.disconnect();
      window.removeEventListener("pointermove", move);
    };
  }, [accentColor, color, opacity]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`thinking-dots ${className}`.trim()} />;
}
