"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { chapterScrollStart } from "./scroll-timeline";
import { readingStops, scenes } from "./scenes";

const scrollKeys = new Set([
  "ArrowDown",
  "ArrowUp",
  "PageDown",
  "PageUp",
  "Home",
  "End",
  " ",
]);

function scrollPosition(chapter: HTMLElement, beat: number, end: number) {
  const start = chapter.id === "inicio" ? 0 : chapterScrollStart(chapter);
  const next = chapter.nextElementSibling;
  const boundary = next instanceof HTMLElement ? chapterScrollStart(next) : end;
  return Math.min(end, Math.round(start + beat * (boundary - start)));
}

export function useChapterTravel(cinematic: boolean) {
  const route = useRef<{ frame: number; timer: number } | null>(null);
  const [travelling, setTravelling] = useState(false);

  const stop = useCallback(() => {
    if (!route.current) return;
    window.cancelAnimationFrame(route.current.frame);
    window.clearTimeout(route.current.timer);
    route.current = null;
    setTravelling(false);
  }, []);

  useEffect(() => {
    if (!cinematic) return;
    function onKey(event: KeyboardEvent) {
      const control = (event.target as Element | null)?.closest?.(
        ".story-travel",
      );
      if (
        event.key === "Escape" ||
        (scrollKeys.has(event.key) && !(control && event.key === " "))
      )
        stop();
    }
    function onClick(event: MouseEvent) {
      const target = (event.target as Element | null)?.closest?.("a, button");
      if (target && !target.closest(".story-travel")) stop();
    }
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchmove", stop, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    window.addEventListener("resize", stop);
    document.addEventListener("visibilitychange", stop);
    return () => {
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", stop);
      document.removeEventListener("visibilitychange", stop);
      stop();
    };
  }, [cinematic, stop]);

  function go(id: string, beat: number) {
    stop();
    const destination = document.getElementById(id);
    if (!destination) return;
    const current = window.scrollY;
    const end = document.documentElement.scrollHeight - window.innerHeight;
    const top = scrollPosition(destination, beat, end);
    if (!cinematic || top <= current + 2) {
      window.scrollTo({ top, behavior: "instant" });
      destination.focus({ preventScroll: true });
      return;
    }

    const chapter = document.querySelector<HTMLElement>(
      "[data-story-chapter][data-current]",
    );
    const scene = scenes.find(({ id }) => id === chapter?.id);
    const pauses =
      chapter && scene
        ? (readingStops[scene.id] ?? [])
            .map(({ beat, seconds }) => ({
              top: scrollPosition(chapter, beat, end),
              seconds,
            }))
            .filter((stop) => stop.top > current + 20 && stop.top < top - 20)
        : [];
    let from = current;
    let starts = performance.now();
    const segments = [...pauses, { top, seconds: 0 }].map((point) => {
      const duration =
        Math.max(
          0.6,
          Math.min(
            4.4,
            0.34 + ((point.top - from) / window.innerHeight) * 1.45,
          ),
        ) * 1000;
      const segment = { from, to: point.top, starts, duration };
      from = point.top;
      starts += duration + point.seconds * 1000;
      return segment;
    });
    let lastScroll = current;
    let index = 0;
    const active = { frame: 0, timer: 0 };
    route.current = active;
    setTravelling(true);

    function advance(now: number) {
      if (route.current !== active) return;
      if (Math.abs(window.scrollY - lastScroll) > 3) {
        stop();
        return;
      }
      const segment = segments[index];
      const progress = Math.max(
        0,
        Math.min(1, (now - segment.starts) / segment.duration),
      );
      const eased = (1 - Math.cos(Math.PI * progress)) / 2;
      const y = Math.round(segment.from + (segment.to - segment.from) * eased);
      if (y !== lastScroll) {
        window.scrollTo({ top: y, behavior: "instant" });
        lastScroll = window.scrollY;
      }
      if (progress < 1) {
        active.frame = window.requestAnimationFrame(advance);
        return;
      }
      index++;
      const next = segments[index];
      if (next) {
        active.timer = window.setTimeout(
          () => {
            active.frame = window.requestAnimationFrame(advance);
          },
          Math.max(0, next.starts - now),
        );
      } else {
        stop();
      }
    }
    active.frame = window.requestAnimationFrame(advance);
  }

  return { go, stop, travelling };
}
