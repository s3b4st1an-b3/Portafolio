import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState, type RefObject } from "react";
import { MathUtils, Vector2 } from "three";
import { createPlayhead, type Playhead } from "./playhead";

export function useStudioMotion(
  scroll: Playhead,
  compact: boolean,
  viewport: RefObject<HTMLDivElement | null>,
  selectionDuration = 0,
) {
  const presenceRef = useRef(0);
  const selection = useRef({
    from: scroll.read(),
    to: scroll.read(),
    start: 0,
  });
  const [motion] = useState(() => ({
    playhead: createPlayhead(scroll.read()),
    aim: new Vector2(),
    destination: new Vector2(),
    active: false,
    presence: presenceRef,
  }));
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => scroll.subscribe(() => invalidate()), [scroll, invalidate]);

  useEffect(() => {
    const element = viewport.current;
    if (!element || compact) return;

    function release() {
      motion.active = false;
      motion.destination.set(0, 0);
      invalidate();
    }

    function move(event: PointerEvent) {
      const bounds = element?.getBoundingClientRect();
      const control = (event.target as Element | null)?.closest?.(
        "a, button, dialog, header, footer",
      );
      if (
        event.pointerType !== "mouse" ||
        control ||
        !bounds?.width ||
        !bounds.height ||
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      ) {
        if (motion.active) release();
        return;
      }
      motion.active = true;
      motion.destination.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        1 - ((event.clientY - bounds.top) / bounds.height) * 2,
      );
      invalidate();
    }

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", release);
    window.addEventListener("blur", release);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", release);
      window.removeEventListener("blur", release);
      release();
    };
  }, [compact, invalidate, motion, viewport]);

  useFrame((_, elapsed) => {
    const dt = MathUtils.clamp(elapsed, 1 / 120, 1 / 20);
    const current = motion.playhead.read();
    const target = scroll.read();
    const gap = Math.abs(current - target);
    let next: number;
    if (selectionDuration) {
      const now = performance.now();
      if (selection.current.to !== target) {
        selection.current = { from: current, to: target, start: now };
      }
      const { from, start } = selection.current;
      next = MathUtils.lerp(
        from,
        target,
        MathUtils.smootherstep(now - start, 0, selectionDuration),
      );
    } else {
      next =
        gap > 0.34 || gap < 0.00018
          ? target
          : MathUtils.damp(current, target, 29 + Math.min(gap * 52, 12), dt);
    }
    motion.playhead.write(next);
    motion.aim.lerp(motion.destination, 1 - Math.exp(-10 * dt));
    const goal = Number(motion.active);
    const presence = MathUtils.damp(presenceRef.current, goal, 12, dt);
    presenceRef.current = Math.abs(presence - goal) < 0.007 ? goal : presence;
    const movingPointer =
      motion.aim.distanceToSquared(motion.destination) > 0.000015;
    if (!movingPointer) motion.aim.copy(motion.destination);
    if (next !== target || movingPointer || presenceRef.current !== goal)
      invalidate();
  }, -3);

  return motion;
}

export type StudioMotion = ReturnType<typeof useStudioMotion>;
