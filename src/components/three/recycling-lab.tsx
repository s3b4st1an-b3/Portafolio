import { Line, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useCallback, useRef } from "react";
import { MathUtils, type Group } from "three";
import type { Point } from "@/features/experience/camera-shots";
import type { Playhead } from "@/features/experience/playhead";
import { ProjectScreen } from "./project-screen";
import { SortingSystem } from "./sorting-system";
import { Block, Deck, RepeatBlocks } from "./studio-kit";

const jade = "#a4e6ca";
const keys: Point[] = Array.from({ length: 28 }, (_, i) => [
  (i % 7) * 0.104 - 0.31,
  0.067,
  Math.floor(i / 7) * 0.079 - 0.11,
]);
const vents: Point[] = Array.from({ length: 11 }, (_, i) => [
  i * 0.145 - 0.73,
  0.48,
  -0.397,
]);
const slats: Point[] = Array.from({ length: 25 }, (_, i) => [
  i * 0.22 - 3.78,
  2.5,
  -3.13,
]);

function Workbench({ playhead }: { playhead: Playhead }) {
  return (
    <group position={[-2.57, 0, -1.63]}>
      <RoundedBox
        args={[3.02, 0.137, 1.46]}
        radius={0.052}
        smoothness={3}
        position={[0, 0.885, 0]}
      >
        <meshStandardMaterial
          color="#505652"
          metalness={0.28}
          roughness={0.46}
        />
      </RoundedBox>
      <Block
        position={[0, 0.42, -0.49]}
        size={[2.79, 0.82, 0.16]}
        color="#313a3a"
      />
      <RepeatBlocks
        positions={vents}
        size={[0.089, 0.034, 0.018]}
        color="#181d21"
      />
      <Block
        position={[-1.32, 0.42, 0.2]}
        size={[0.15, 0.87, 0.97]}
        color="#303b3c"
      />
      <Block
        position={[1.32, 0.42, 0.2]}
        size={[0.15, 0.87, 0.97]}
        color="#303b3c"
      />
      <Block
        position={[0, 0.23, 0.1]}
        size={[2.62, 0.066, 0.18]}
        color="#373e3c"
      />
      <ProjectScreen
        slug="reciclaje"
        width={2.47}
        position={[0, 2.05, -0.24]}
        supportHeight={1.09}
        playhead={playhead}
        range={[3.76, 5.24]}
        rotation={[0, 0.115, 0]}
      />
      <group position={[-0.25, 0.959, 0.44]} rotation={[0, -0.085, 0]}>
        <RoundedBox args={[0.91, 0.063, 0.39]} radius={0.026} smoothness={2}>
          <meshStandardMaterial color="#252f31" roughness={0.49} />
        </RoundedBox>
        <RepeatBlocks
          positions={keys}
          size={[0.078, 0.042, 0.052]}
          color="#859291"
        />
      </group>
      <group position={[1.03, 0.96, 0.29]}>
        <Block
          position={[0, 0.04, 0]}
          size={[0.24, 0.083, 0.28]}
          color="#293634"
        />
        <mesh position={[0, 0.101, 0]}>
          <cylinderGeometry args={[0.071, 0.08, 0.053, 18]} />
          <meshStandardMaterial
            color="#b99065"
            roughness={0.38}
            metalness={0.43}
          />
        </mesh>
      </group>
      <Line
        points={[
          [0, 1.51, -0.53],
          [0.09, 1.29, -0.6],
          [0.53, 1.01, -0.65],
          [0.97, 0.98, -0.62],
          [1.37, 0.82, -0.65],
          [1.38, 0.43, -0.62],
        ]}
        color="#202822"
        lineWidth={2.1}
      />
    </group>
  );
}

export function RecyclingLab({ playhead }: { playhead: Playhead }) {
  const scanner = useRef<Group>(null);
  const sortingProgress = useCallback(
    () => MathUtils.smootherstep(playhead.read(), 4.38, 4.8),
    [playhead],
  );
  useFrame(() => {
    if (!scanner.current) return;
    const time = playhead.read();
    scanner.current.position.x =
      -0.4 + MathUtils.smootherstep(time, 4.37, 4.69) * 1.32;
  });

  return (
    <group position={[12.7, 0, -17.05]}>
      <Deck size={[9.23, 0.36, 6.4]} color="#599889" />
      <Block
        position={[0.1, 2.52, -3.24]}
        size={[9.7, 5.08, 0.19]}
        color="#252d31"
      />
      <RepeatBlocks
        positions={slats}
        size={[0.068, 4.9, 0.042]}
        color="#343e40"
      />
      <Block
        position={[3.54, 2.56, -3.13]}
        size={[0.028, 3.66, 0.023]}
        color="#a0dac5"
        glow
      />
      <Block
        position={[-0.35, 4.26, -2.22]}
        size={[6.67, 0.17, 0.47]}
        color="#48534f"
      />
      <Block
        position={[-0.35, 4.165, -2.18]}
        size={[6.27, 0.02, 0.31]}
        color="#e3f0dd"
        glow
      />
      <Workbench playhead={playhead} />

      <group position={[1.14, 0.13, 0.6]}>
        <Block
          position={[0, -0.047, -0.51]}
          size={[5.65, 0.15, 2.55]}
          color="#35413f"
        />
        <Block
          position={[-2.58, 0.7, -1.16]}
          size={[0.16, 1.38, 0.29]}
          color="#576263"
        />
        <Block
          position={[2.58, 0.7, -1.16]}
          size={[0.16, 1.38, 0.29]}
          color="#576263"
        />
        <Block
          position={[0, 1.4, -1.16]}
          size={[5.3, 0.12, 0.26]}
          color="#616c69"
        />
        <Block
          position={[0, 1.46, -1.11]}
          size={[4.98, 0.014, 0.14]}
          color="#263637"
        />
        <group ref={scanner} position={[-0.4, 0, -1.15]}>
          <RoundedBox
            args={[0.68, 0.23, 0.43]}
            radius={0.05}
            smoothness={2}
            position={[0, 1.3, 0.13]}
          >
            <meshStandardMaterial
              color="#4d605a"
              metalness={0.51}
              roughness={0.36}
            />
          </RoundedBox>
          <Block
            position={[0, 1.178, 0.16]}
            size={[0.43, 0.019, 0.16]}
            color={jade}
            glow
          />
        </group>
      </group>
      <group position={[1.17, 0.61, 0.5]}>
        <SortingSystem progress={sortingProgress} />
      </group>
      <Line
        points={[
          [-3.72, 0.025, 1.98],
          [-3.72, 0.025, 0.4],
          [-1.58, 0.025, 0.4],
          [-1.43, 0.025, 0.55],
          [-1.43, 0.025, 1.8],
          [3.87, 0.025, 1.8],
        ]}
        color="#6fbaaa"
        transparent
        opacity={0.53}
      />
    </group>
  );
}
