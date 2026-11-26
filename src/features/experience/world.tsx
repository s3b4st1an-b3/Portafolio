"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useRef, type RefObject } from "react";
import { PCFShadowMap, type Group } from "three";
import { BusinessZone } from "@/components/three/project-zones";
import { StudioLighting } from "@/components/three/studio-lighting";
import { StudioShell } from "@/components/three/studio-shell";
import { Workstation } from "@/components/three/workstation";
import { Camera } from "./camera";
import { DeskPointer } from "./desk-pointer";
import type { Playhead } from "./playhead";
import type { DeskTarget } from "./studio-desk";
import { useStudioMotion } from "./studio-motion";
import { useAdaptiveResolution } from "./studio-resolution";

const bakedShadows = {
  type: PCFShadowMap,
  autoUpdate: false,
  needsUpdate: true,
};

function Studio({
  playhead,
  business,
  compact,
  viewport,
  lamp,
  onActivateDesk,
  onLost,
  onReady,
}: {
  playhead: Playhead;
  business: boolean;
  compact: boolean;
  viewport: RefObject<HTMLDivElement | null>;
  lamp: boolean;
  onActivateDesk: (target: DeskTarget) => void;
  onLost: () => void;
  onReady: () => void;
}) {
  const canvas = useThree((state) => state.gl.domElement);
  const motion = useStudioMotion(
    playhead,
    compact,
    viewport,
    business ? 1350 : 0,
  );
  useAdaptiveResolution(motion, compact);
  const desk = useRef<Group>(null);
  const hovered = useRef<DeskTarget | null>(null);

  useEffect(() => {
    canvas.addEventListener("webglcontextlost", onLost);
    return () => canvas.removeEventListener("webglcontextlost", onLost);
  }, [canvas, onLost]);

  return (
    <>
      <Camera playhead={motion.playhead} compact={compact} aim={motion.aim} />
      <StudioLighting motion={motion} />
      <StudioShell />
      {business ? (
        <BusinessZone playhead={motion.playhead} onCaptureReady={onReady} />
      ) : (
        <>
          <group ref={desk}>
            <Workstation
              playhead={motion.playhead}
              compact={compact}
              lamp={lamp}
              motion={motion}
              hovered={hovered}
            />
          </group>
          <DeskPointer
            desk={desk}
            viewport={viewport}
            motion={motion}
            hovered={hovered}
            onActivate={onActivateDesk}
          />
        </>
      )}
    </>
  );
}

export default function World({
  playhead,
  business,
  compact,
  viewport,
  lamp,
  onActivateDesk,
  onLost,
  onReady,
}: {
  playhead: Playhead;
  business: boolean;
  compact: boolean;
  viewport: RefObject<HTMLDivElement | null>;
  lamp: boolean;
  onActivateDesk: (target: DeskTarget) => void;
  onLost: () => void;
  onReady: () => void;
}) {
  return (
    <Canvas
      dpr={compact ? [1, 1.3] : [1, 1.65]}
      camera={{ near: 0.12, far: 83 }}
      frameloop="demand"
      shadows={compact ? false : bakedShadows}
      gl={{ alpha: true, antialias: true, powerPreference: "default" }}
      onCreated={business ? undefined : onReady}
      fallback={null}
    >
      <Studio
        playhead={playhead}
        business={business}
        compact={compact}
        viewport={viewport}
        lamp={lamp}
        onActivateDesk={onActivateDesk}
        onLost={onLost}
        onReady={onReady}
      />
    </Canvas>
  );
}
