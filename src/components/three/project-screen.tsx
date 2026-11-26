import { RoundedBox } from "@react-three/drei";
import { Suspense, useEffect, useSyncExternalStore } from "react";
import type { Point } from "@/features/experience/camera-shots";
import type { Playhead } from "@/features/experience/playhead";
import type { ProjectSlug } from "@/types/portfolio";
import { captures } from "@/data/project-images";
import { useCaptureTexture } from "./capture-texture";
import { Block, RepeatBlocks } from "./studio-kit";

const vents: Point[] = Array.from({ length: 13 }, (_, index) => [
  (index - 6) * 0.059,
  0.17,
  -0.212,
]);

function ScreenImage({
  src,
  width,
  height,
  onReady,
}: {
  src: string;
  width: number;
  height: number;
  onReady?: () => void;
}) {
  const texture = useCaptureTexture(src);
  useEffect(() => {
    onReady?.();
  }, [onReady, texture]);
  return (
    <mesh position={[0, 0.016, 0.115]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial toneMapped={false} map={texture} />
    </mesh>
  );
}

export function ProjectScreen({
  position,
  width,
  slug,
  playhead,
  range,
  rotation,
  supportHeight,
  accent = "#9bd6c1",
  onCaptureReady,
}: {
  position: Point;
  width: number;
  slug: ProjectSlug;
  playhead: Playhead;
  range: [number, number];
  rotation?: Point;
  supportHeight: number;
  accent?: string;
  onCaptureReady?: () => void;
}) {
  const visible = useSyncExternalStore(
    playhead.subscribe,
    () => playhead.read() >= range[0] && playhead.read() <= range[1],
    () => false,
  );
  const height = (width * 900) / 1440;
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox
        args={[width + 0.156, height + 0.176, 0.209]}
        radius={0.046}
        smoothness={3}
      >
        <meshStandardMaterial
          color="#637076"
          metalness={0.57}
          roughness={0.34}
        />
      </RoundedBox>
      <RoundedBox
        position={[0, 0.012, 0.105]}
        args={[width + 0.059, height + 0.071, 0.015]}
        radius={0.007}
        smoothness={2}
      >
        <meshStandardMaterial color="#111819" roughness={0.45} />
      </RoundedBox>
      <Block
        position={[0, 0.016, 0.111]}
        size={[width, height, 0.004]}
        color="#172021"
        glow
      />
      <Block
        position={[width * 0.44, -height / 2 - 0.044, 0.098]}
        size={[0.038, 0.013, 0.017]}
        color={accent}
        glow
      />
      <RoundedBox
        args={[width * 0.55, height * 0.62, 0.14]}
        radius={0.058}
        smoothness={2}
        position={[0, -0.12, -0.138]}
      >
        <meshStandardMaterial
          color="#333b41"
          roughness={0.5}
          metalness={0.45}
        />
      </RoundedBox>
      <RepeatBlocks
        positions={vents}
        size={[0.033, 0.023, 0.009]}
        color="#11171a"
      />
      <RoundedBox
        args={[0.17, supportHeight - height * 0.27, 0.18]}
        radius={0.032}
        smoothness={2}
        position={[0, -(supportHeight + height * 0.27) / 2 + 0.06, -0.191]}
      >
        <meshStandardMaterial
          color="#4d585e"
          metalness={0.55}
          roughness={0.38}
        />
      </RoundedBox>
      <RoundedBox
        args={[width * 0.35, 0.069, 0.55]}
        radius={0.027}
        smoothness={2}
        position={[0, 0.03 - supportHeight, -0.16]}
      >
        <meshStandardMaterial
          color="#363c43"
          metalness={0.42}
          roughness={0.47}
        />
      </RoundedBox>
      {visible && (
        <Suspense fallback={null}>
          <ScreenImage
            src={captures[slug].file}
            width={width}
            height={height}
            onReady={onCaptureReady}
          />
        </Suspense>
      )}
    </group>
  );
}
