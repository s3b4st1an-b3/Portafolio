import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef, type RefObject } from "react";
import { Mesh, Raycaster, Vector2, type Group } from "three";
import {
  deskTargetNames,
  deskTargetVisible,
  type DeskTarget,
} from "./studio-desk";
import type { StudioMotion } from "./studio-motion";

export function DeskPointer({
  desk,
  viewport: viewportRef,
  motion,
  hovered: hoveredRef,
  onActivate,
}: {
  desk: RefObject<Group | null>;
  viewport: RefObject<HTMLDivElement | null>;
  motion: StudioMotion;
  hovered: RefObject<DeskTarget | null>;
  onActivate: (target: DeskTarget) => void;
}) {
  const camera = useThree((state) => state.camera);
  const ray = useRef(new Raycaster());
  const point = useRef(new Vector2());
  const targets = useRef<Mesh[]>([]);
  const hits = useRef<ReturnType<Raycaster["intersectObjects"]>>([]);

  const pick = useCallback(
    (at: Vector2) => {
      const time = motion.playhead.read();
      if (time >= 1 && time < 5.32) return null;
      camera.updateMatrixWorld();
      ray.current.setFromCamera(at, camera);
      hits.current.length = 0;
      ray.current.intersectObjects(targets.current, false, hits.current);
      const hit = hits.current.find(({ object }) =>
        deskTargetVisible(object.name as DeskTarget, time),
      );
      return (hit?.object.name as DeskTarget | undefined) ?? null;
    },
    [camera, motion],
  );

  useFrame(() => {
    const target = motion.active ? pick(motion.destination) : null;
    if (hoveredRef.current === target) return;
    hoveredRef.current = target;
    const element = viewportRef.current;
    if (element) element.dataset.deskHover = target ?? "";
  }, -1);

  useEffect(() => {
    const element = viewportRef.current;
    if (!desk.current || !element) return;
    targets.current = Object.keys(deskTargetNames).flatMap((name) => {
      const object = desk.current?.getObjectByName(name);
      return object instanceof Mesh ? [object] : [];
    });
    let press: {
      target: DeskTarget;
      x: number;
      y: number;
      scroll: number;
    } | null;

    function targetAt(event: PointerEvent) {
      if (
        (event.target as Element | null)?.closest?.(
          "a, button, dialog, header, footer",
        )
      )
        return null;
      const bounds = element?.getBoundingClientRect();
      if (!bounds || bounds.width < 1 || bounds.height < 1) return null;
      point.current.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        1 - ((event.clientY - bounds.top) / bounds.height) * 2,
      );
      if (Math.abs(point.current.x) > 1 || Math.abs(point.current.y) > 1)
        return null;
      return pick(point.current);
    }

    function start(event: PointerEvent) {
      if (!event.isPrimary || event.button !== 0) return;
      const target = targetAt(event);
      press = target
        ? { target, x: event.clientX, y: event.clientY, scroll: window.scrollY }
        : null;
    }

    function cancel() {
      press = null;
    }

    function finish(event: PointerEvent) {
      if (!event.isPrimary) return;
      const start = press;
      cancel();
      if (
        !start ||
        Math.hypot(event.clientX - start.x, event.clientY - start.y) > 9 ||
        Math.abs(start.scroll - window.scrollY) > 4 ||
        targetAt(event) !== start.target
      )
        return;
      onActivate(start.target);
    }

    window.addEventListener("pointerdown", start, { passive: true });
    window.addEventListener("pointerup", finish, { passive: true });
    window.addEventListener("pointercancel", cancel);
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", cancel);
      element.dataset.deskHover = "";
    };
  }, [desk, viewportRef, pick, onActivate]);

  return null;
}
