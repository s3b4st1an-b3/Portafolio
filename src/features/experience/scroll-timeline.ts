"use client";

import { useEffect, useLayoutEffect, type RefObject } from "react";
import { scrollProgress, sectionAt } from "./scroll-math";
import type { Playhead } from "./playhead";

export function chapterScrollStart(chapter: HTMLElement) {
  const padding =
    Number.parseFloat(
      getComputedStyle(document.documentElement).scrollPaddingTop,
    ) || 0;
  const margin =
    Number.parseFloat(getComputedStyle(chapter).scrollMarginTop) || 0;
  return (
    chapter.getBoundingClientRect().top + window.scrollY - padding - margin
  );
}

export function useScrollTimeline(
  root: RefObject<HTMLDivElement | null>,
  playhead: Playhead,
) {
  useLayoutEffect(() => {
    const restoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    const [navigation] = performance.getEntriesByType("navigation");
    const reload =
      navigation instanceof PerformanceNavigationTiming &&
      navigation.type === "reload";
    if (reload && location.hash) {
      history.replaceState(
        history.state,
        "",
        location.pathname + location.search,
      );
    }
    if (!location.hash) window.scrollTo({ top: 0, behavior: "instant" });
    return () => {
      history.scrollRestoration = restoration;
    };
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const chapters = Array.from(
      element.querySelectorAll<HTMLElement>("[data-story-chapter]"),
    );
    const links = Array.from(
      element.querySelectorAll<HTMLAnchorElement>("[data-chapter-link]"),
    );
    let starts: number[] = [];
    let end = 1;
    let lastChapter = -1;
    let frame = 0;
    const fragment = window.location.hash;
    const initialTarget = document.getElementById(fragment.slice(1));
    const initialChapter = initialTarget?.closest("[data-story-chapter]");

    const measure = () => {
      starts = chapters.map(chapterScrollStart);
      starts[0] = 0;
      end = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
    };

    const apply = () => {
      if (!starts.length) return;
      const y = window.scrollY;
      const index =
        end > 2 && y >= end - 1
          ? chapters.length - 1
          : sectionAt(starts, y + 2);
      const beat = scrollProgress(starts[index], starts[index + 1] ?? end, y);
      if (index !== lastChapter) {
        links.forEach((link, i) => {
          if (i === index) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
        if (lastChapter >= 0) {
          chapters[lastChapter].removeAttribute("data-current");
          chapters[lastChapter].style.setProperty(
            "--beat",
            index > lastChapter ? "1" : "0",
          );
        }
        chapters[index].setAttribute("data-current", "");
        element.setAttribute("data-chapter", chapters[index].id);
        lastChapter = index;
      }
      chapters[index].style.setProperty("--beat", String(beat));
      element.style.setProperty(
        "--reading-progress",
        String(scrollProgress(0, end, y)),
      );
      playhead.write(index + beat);
    };

    function schedule() {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        apply();
      });
    }
    function refresh() {
      measure();
      schedule();
    }
    function alignFragment() {
      if (!initialTarget || window.location.hash !== fragment) return;
      window.scrollTo({
        top:
          initialTarget.id === "inicio" ? 0 : chapterScrollStart(initialTarget),
        behavior: "instant",
      });
      refresh();
    }

    measure();
    apply();
    if (initialChapter) {
      if (document.readyState === "complete") alignFragment();
      else window.addEventListener("load", alignFragment, { once: true });
    }
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(refresh);
    observer?.observe(element);
    chapters.forEach((chapter) => observer?.observe(chapter));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", refresh);
    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("load", alignFragment);
      window.cancelAnimationFrame(frame);
    };
  }, [root, playhead]);
}
