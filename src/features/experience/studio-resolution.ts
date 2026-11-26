import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { StudioMotion } from "./studio-motion";

export function useAdaptiveResolution(motion: StudioMotion, compact: boolean) {
  const samples = useRef({ progress: -1, slow: 0, fast: 0 });

  useFrame(({ viewport, setDpr }, delta) => {
    const sample = samples.current;
    const progress = motion.playhead.read();
    const moving =
      sample.progress !== progress ||
      motion.aim.distanceToSquared(motion.destination) > 0.000015;
    sample.progress = progress;
    if (!moving || delta > 0.12) {
      sample.fast = 0;
      sample.slow = 0;
      return;
    }

    sample.slow =
      delta >= 0.028 ? sample.slow + 1 : Math.max(0, sample.slow - 2);
    sample.fast = delta <= 0.018 ? sample.fast + 1 : 0;
    const ceiling = Math.min(window.devicePixelRatio, compact ? 1.3 : 1.65);
    if (sample.slow >= 9 && viewport.dpr > 1.01) {
      setDpr(Math.max(1, viewport.dpr * 0.82));
      sample.slow = 0;
    } else if (sample.fast >= 90 && viewport.dpr + 0.02 < ceiling) {
      setDpr(Math.min(ceiling, viewport.dpr + 0.16));
      sample.fast = 0;
    }
  });
}
