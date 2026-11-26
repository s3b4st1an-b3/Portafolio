import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MathUtils, type Group } from "three";
import { technologies } from "@/data/technologies";
import type { Point } from "@/features/experience/camera-shots";
import type { Playhead } from "@/features/experience/playhead";
import { Block, Deck, RepeatBlocks } from "./studio-kit";
import { ToolModel } from "./tool-models";

const accents = [
  "#a5dfed",
  "#e6bf89",
  "#a3d9b0",
  "#d5b8ab",
  "#bcdde2",
  "#d4cd98",
];
const modules: Point[] = technologies.map((_, index) => [
  index * 1.55 - 3.875,
  0.43,
  0,
]);
const rails: Point[] = modules.map(([x]) => [x, 1.52, -0.475]);
const seams: Point[] = Array.from({ length: 7 }, (_, index) => [
  index * 1.55 - 4.65,
  1.6,
  -0.654,
]);

function Module({ index, playhead }: { index: number; playhead: Playhead }) {
  const panel = useRef<Group>(null);
  const last = useRef(-1);
  const accent = accents[index];
  useFrame(() => {
    if (!panel.current) return;
    const time = playhead.read();
    const lift =
      1 -
      MathUtils.smootherstep(
        Math.abs(time - technologies[index].shot),
        0.011,
        0.108,
      );
    if (lift === last.current) return;
    last.current = lift;
    panel.current.position.z = lift * 0.39;
    panel.current.position.y = lift * 0.18;
    panel.current.rotation.x = -lift * 0.05;
  });
  return (
    <group position={[modules[index][0], 1.47, 0]}>
      <group ref={panel}>
        <RoundedBox
          position={[0, 0.06, -0.192]}
          args={[1.34, 1.29, 0.31]}
          radius={0.052}
          smoothness={3}
        >
          <meshStandardMaterial
            color="#3a474b"
            roughness={0.59}
            metalness={0.32}
          />
        </RoundedBox>
        <Block
          position={[0, 0.071, -0.026]}
          size={[1.22, 1.08, 0.035]}
          color="#222e34"
        />
        <Block
          position={[0, 0.683, -0.078]}
          size={[1.18, 0.023, 0.029]}
          color={accent}
          glow
        />
        <Block
          position={[-0.431, -0.483, -0.002]}
          size={[0.21, 0.019, 0.016]}
          color={accent}
          glow
        />
        <ToolModel index={index} accent={accent} />
      </group>
    </group>
  );
}

export function TechnologyWall({ playhead }: { playhead: Playhead }) {
  return (
    <group position={[11.425, 0, -1.65]}>
      <Deck size={[9.85, 0.36, 3.37]} color="#778e91" />
      <Block
        position={[0, 1.6, -0.75]}
        size={[10.01, 3.25, 0.17]}
        color="#283239"
      />
      <RepeatBlocks
        positions={seams}
        size={[0.032, 3.2, 0.024]}
        color="#566265"
      />
      <Block
        position={[0, 3.07, -0.39]}
        size={[9.77, 0.17, 0.78]}
        color="#465055"
      />
      <Block
        position={[0, 2.974, -0.345]}
        size={[9.52, 0.022, 0.43]}
        color="#cddbd7"
        glow
      />
      <RepeatBlocks
        positions={modules}
        size={[1.22, 0.83, 0.92]}
        color="#343e42"
      />
      <RepeatBlocks
        positions={rails}
        size={[0.145, 1.46, 0.26]}
        color="#536267"
      />
      <Block
        position={[0, 0.892, -0.028]}
        size={[9.57, 0.12, 1.19]}
        color="#55615f"
      />
      {technologies.map(({ name }, index) => (
        <Module key={name} index={index} playhead={playhead} />
      ))}
    </group>
  );
}
