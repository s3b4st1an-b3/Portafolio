import { Line, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MathUtils, type Group } from "three";
import type { Playhead } from "@/features/experience/playhead";
import type { Point } from "@/features/experience/camera-shots";
import { ProjectScreen } from "./project-screen";
import { Block, Deck, RepeatBlocks, cyan, violet } from "./studio-kit";

const serverLights: Point[] = Array.from({ length: 6 }, (_, i) => [
  0.43,
  1.53 + 0.19 * i,
  0.45,
]);
const archiveRows: Point[] = [0.59, 0.98, 1.37].map((y) => [0, y, 0.55]);
const driveHandles: Point[] = archiveRows.map(([, y, z]) => [
  -0.13,
  y,
  z + 0.095,
]);
const driveLights: Point[] = archiveRows.map(([, y, z]) => [
  0.44,
  y,
  z + 0.095,
]);

function DataArchive() {
  return (
    <group position={[2.31, 0, 0.3]}>
      <RoundedBox
        args={[1.58, 1.64, 1.13]}
        radius={0.066}
        smoothness={3}
        position={[0, 0.98, 0]}
      >
        <meshStandardMaterial
          color="#3e524f"
          metalness={0.49}
          roughness={0.45}
        />
      </RoundedBox>
      <Block
        position={[0, 0.98, 0.571]}
        size={[1.37, 1.4, 0.07]}
        color="#1b2a2c"
      />
      <RepeatBlocks
        positions={archiveRows}
        size={[1.24, 0.287, 0.135]}
        color="#657a74"
      />
      <RepeatBlocks
        positions={driveHandles}
        size={[0.63, 0.071, 0.038]}
        color="#28383b"
      />
      <RepeatBlocks
        positions={driveLights}
        size={[0.068, 0.038, 0.026]}
        color="#b9e3c0"
        glow
      />
      <Block
        position={[0, 0.184, 0]}
        size={[1.67, 0.16, 1.17]}
        color="#384743"
      />
    </group>
  );
}
export function BusinessZone({
  playhead,
  onCaptureReady,
}: {
  playhead: Playhead;
  onCaptureReady: () => void;
}) {
  const system = useRef<Group>(null);
  useFrame(() => {
    const p = MathUtils.smoothstep(playhead.read(), 3.13, 3.73);
    if (system.current) system.current.position.x = (1 - p) * 0.58;
  });
  return (
    <group position={[22, 0, -7.85]}>
      <Deck size={[9.25, 0.36, 6]} />
      <Block
        position={[-2.34, 0.64, 0.64]}
        size={[3, 0.12, 1.3]}
        color="#314965"
      />
      <Block
        position={[-2.34, 0.32, 0.51]}
        size={[1.9, 0.56, 0.96]}
        color="#263754"
      />
      <ProjectScreen
        slug="seym-soft"
        width={2.95}
        position={[-2.34, 2.12, 0.68]}
        playhead={playhead}
        range={[2.72, 4.14]}
        supportHeight={1.42}
        accent={cyan}
        rotation={[0, 0.12, 0]}
        onCaptureReady={onCaptureReady}
      />
      <group ref={system}>
        <Block
          position={[0.18, 1.48, -0.38]}
          size={[1.35, 2.89, 1.43]}
          color="#293b5a"
        />
        <Block
          position={[0.18, 1.7, 0.39]}
          size={[1.1, 2.03, 0.08]}
          color="#1c2940"
        />
        <RepeatBlocks
          positions={serverLights}
          size={[0.08, 0.038, 0.045]}
          color={cyan}
          glow
        />
        {Array.from({ length: 5 }, (_, i) => (
          <Block
            key={i}
            position={[0.02, 0.88 + i * 0.285, 0.454]}
            size={[0.66, 0.081, 0.024]}
            color="#516d8e"
          />
        ))}
      </group>
      <DataArchive />
      <group position={[3.19, 1.43, -0.57]} rotation={[0.1, -0.29, 0.03]}>
        <Block position={[0, 0, 0]} size={[0.73, 1.46, 0.15]} color="#60748e" />
        <Block
          position={[0, 0.035, 0.087]}
          size={[0.61, 1.23, 0.019]}
          color="#172d49"
          glow
        />
        <Block
          position={[0, 0.33, 0.103]}
          size={[0.46, 0.077, 0.02]}
          color={violet}
          glow
        />
        <Block
          position={[0, 0.025, 0.103]}
          size={[0.42, 0.25, 0.019]}
          color="#305370"
          glow
        />
        <Block
          position={[0, -0.24, 0.103]}
          size={[0.42, 0.15, 0.019]}
          color="#466684"
          glow
        />
      </group>
      <Line
        points={[
          [-2.38, 0.11, 0.71],
          [-2.38, 0.11, 1.92],
          [0.18, 0.11, 1.92],
          [0.18, 0.11, -0.36],
          [2.31, 0.11, -0.36],
          [2.31, 0.11, 0.3],
        ]}
        color={cyan}
        lineWidth={2}
      />
      <Line
        points={[
          [0.18, 0.1, 1.59],
          [3.2, 0.1, 1.59],
          [3.2, 0.1, -0.58],
          [3.2, 0.76, -0.58],
        ]}
        color={violet}
        lineWidth={1.65}
      />
    </group>
  );
}
