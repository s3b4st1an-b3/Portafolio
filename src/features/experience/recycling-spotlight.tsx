"use client";

import type { ReactNode } from "react";

export function RecyclingSpotlight({ children }: { children: ReactNode }) {
  return (
    <div
      className="fusion-recycling-cue"
      data-film-cue
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const capture = event.currentTarget.firstElementChild;
        if (!(capture instanceof HTMLElement)) return;
        const rect = capture.getBoundingClientRect();
        capture.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
        capture.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
      }}
    >
      {children}
    </div>
  );
}
