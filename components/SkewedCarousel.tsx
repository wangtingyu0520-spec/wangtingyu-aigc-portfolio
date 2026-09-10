"use client";
/* The viewport is intentionally a focusable drag surface, not a semantic button. */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */

import { type PointerEvent, type ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

type SkewedCarouselProps = {
  children: ReactNode;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  ariaLabel: string;
  contentKey: string;
};

/** Dependency-free skewed card carousel that preserves caller-provided card ratios. */
export default function SkewedCarousel({ children, activeIndex, onActiveIndexChange, ariaLabel, contentKey }: SkewedCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ x: number; scrollLeft: number } | null>(null);
  const programmaticIndex = useRef<number | null>(null);
  const positionedContentRef = useRef<string | null>(null);
  const [interactionVersion, setInteractionVersion] = useState(0);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const childCount = Array.isArray(children) ? children.length : 0;

  const resetAutoplay = useCallback(() => setInteractionVersion((version) => version + 1), []);

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const viewport = viewportRef.current;
    const slide = viewport?.querySelectorAll<HTMLElement>(".skewed-carousel__slide")[index];
    if (!viewport || !slide) return;
    const left = slide.offsetLeft - (viewport.clientWidth - slide.clientWidth) / 2;
    if (behavior === "auto") {
      const previousScrollBehavior = viewport.style.scrollBehavior;
      const previousSnapType = viewport.style.scrollSnapType;
      viewport.style.scrollBehavior = "auto";
      viewport.style.scrollSnapType = "none";
      viewport.scrollLeft = left;
      window.setTimeout(() => {
        viewport.style.scrollBehavior = previousScrollBehavior;
        viewport.style.scrollSnapType = previousSnapType;
      }, 700);
      return;
    }
    viewport.scrollTo({ left, behavior });
  }, []);

  const updateEdgeSpacing = useCallback(() => {
    const viewport = viewportRef.current;
    const slides = viewport?.querySelectorAll<HTMLElement>(".skewed-carousel__slide");
    if (!viewport || !slides?.length) return;
    const first = slides[0];
    const last = slides[slides.length - 1];
    viewport.style.paddingLeft = `${Math.max(40, viewport.clientWidth / 2 - first.clientWidth / 2)}px`;
    viewport.style.paddingRight = `${Math.max(40, viewport.clientWidth / 2 - last.clientWidth / 2)}px`;
  }, []);

  useLayoutEffect(() => {
    updateEdgeSpacing();
    window.addEventListener("resize", updateEdgeSpacing);
    return () => window.removeEventListener("resize", updateEdgeSpacing);
  }, [childCount, updateEdgeSpacing]);

  useEffect(() => {
    const contentSignature = `${contentKey}:${childCount}`;
    if (positionedContentRef.current === contentSignature) return;
    positionedContentRef.current = contentSignature;
    scrollToIndex(activeIndex, "auto");
  }, [activeIndex, childCount, contentKey, scrollToIndex]);

  const updateActiveSlide = useCallback(() => {
    if (programmaticIndex.current !== null) return;
    const viewport = viewportRef.current;
    if (!viewport) return;
    const center = viewport.scrollLeft + viewport.clientWidth / 2;
    const closest = [...viewport.querySelectorAll<HTMLElement>(".skewed-carousel__slide")].reduce(
      (best, slide, index) => {
        const distance = Math.abs(slide.offsetLeft + slide.clientWidth / 2 - center);
        return distance < best.distance ? { index, distance } : best;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    ).index;
    if (closest !== activeIndex) onActiveIndexChange(closest);
  }, [activeIndex, onActiveIndexChange]);

  const move = useCallback((direction: -1 | 1) => {
    if (childCount < 2) return;
    const next = (activeIndex + direction + childCount) % childCount;
    const wrapsAround = (direction === 1 && activeIndex === childCount - 1) || (direction === -1 && activeIndex === 0);
    programmaticIndex.current = next;
    resetAutoplay();
    onActiveIndexChange(next);
    scrollToIndex(next, wrapsAround ? "auto" : "smooth");
    window.setTimeout(() => {
      if (programmaticIndex.current === next) {
        programmaticIndex.current = null;
      }
    }, 760);
  }, [activeIndex, childCount, onActiveIndexChange, resetAutoplay, scrollToIndex]);

  useEffect(() => {
    if (childCount < 2 || isCardHovered) return;
    const timer = window.setTimeout(() => move(1), 2000);
    return () => window.clearTimeout(timer);
  }, [activeIndex, childCount, interactionVersion, isCardHovered, move]);

  function handleSlidePointerEnter(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") setIsCardHovered(true);
  }

  function handleSlidePointerLeave(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    setIsCardHovered(false);
    resetAutoplay();
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    const viewport = viewportRef.current;
    if (!viewport) return;
    if (event.target instanceof Element && event.target.closest(".work-card")) return;
    programmaticIndex.current = null;
    resetAutoplay();
    dragStart.current = { x: event.clientX, scrollLeft: viewport.scrollLeft };
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add("is-dragging");
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const viewport = viewportRef.current;
    const start = dragStart.current;
    if (!viewport || !start) return;
    viewport.scrollLeft = start.scrollLeft - (event.clientX - start.x);
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    const viewport = viewportRef.current;
    if (!viewport) return;
    dragStart.current = null;
    viewport.classList.remove("is-dragging");
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    updateActiveSlide();
  }

  return (
    <div className="skewed-carousel">
      <div
        ref={viewportRef}
        className="skewed-carousel__viewport"
        role="application"
        aria-label={ariaLabel}
        tabIndex={0}
        onScroll={updateActiveSlide}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onWheel={resetAutoplay}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
          if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
        }}
      >
        <div className="skewed-carousel__track">
          {Array.isArray(children) && children.map((child, index) => (
            <div
              className={`skewed-carousel__slide ${index === activeIndex ? "is-active" : ""}`}
              style={{
                "--carousel-lift": `${Math.abs(index - activeIndex) * 8}px`,
                "--carousel-scale": 1 - Math.min(Math.abs(index - activeIndex) * 0.045, 0.15),
                "--carousel-rotate-y": `${(index - activeIndex) * -5}deg`,
                "--carousel-rotate-z": `${(index - activeIndex) * -1.1}deg`,
                "--carousel-saturation": 1 - Math.min(Math.abs(index - activeIndex) * 0.12, 0.32),
              } as React.CSSProperties}
              key={index}
              onPointerEnter={handleSlidePointerEnter}
              onPointerLeave={handleSlidePointerLeave}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
      <div className="skewed-carousel__controls" aria-label="作品轮播控制">
        <button type="button" onClick={() => move(-1)} aria-label="查看上一件作品">←</button>
        <span>{String(activeIndex + 1).padStart(2, "0")} / {String(childCount).padStart(2, "0")}</span>
        <button type="button" onClick={() => move(1)} aria-label="查看下一件作品">→</button>
      </div>
    </div>
  );
}
