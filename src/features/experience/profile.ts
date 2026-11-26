import { useSyncExternalStore } from "react";

export const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const compactQuery = "(max-width: 760px), (pointer: coarse)";
const serverSnapshot = "0/0";

export function supportsWebGL() {
  try {
    const context = document
      .createElement("canvas")
      .getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(context);
  } catch {
    return false;
  }
}

export function canStartStudioAutomatically() {
  const device = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  return (
    !device.connection?.saveData &&
    !["slow-2g", "2g"].includes(device.connection?.effectiveType ?? "") &&
    (device.deviceMemory ?? 4) > 2 &&
    (device.hardwareConcurrency || 4) > 2
  );
}

function snapshot() {
  const reduced = matchMedia(reducedMotionQuery).matches;
  const compact = matchMedia(compactQuery).matches;
  return [Number(reduced), Number(compact)].join("/");
}

function subscribe(callback: () => void) {
  const queries = [matchMedia(reducedMotionQuery), matchMedia(compactQuery)];
  queries.forEach((query) => query.addEventListener("change", callback));
  return () =>
    queries.forEach((query) => query.removeEventListener("change", callback));
}

export function useProfile() {
  const value = useSyncExternalStore(subscribe, snapshot, () => serverSnapshot);
  const [reduced, compact] = value.split("/");
  return { reduced: reduced === "1", compact: compact === "1" };
}
