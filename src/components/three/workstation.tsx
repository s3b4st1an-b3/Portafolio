import { Line, RoundedBox } from "@react-three/drei";
import type { RefObject } from "react";
import { WorkstationMonitor } from "./workstation-monitor";
import { Block, Deck, RepeatBlocks, cyan, dark, violet } from "./studio-kit";
import { DeskAccessories, DeskLamp } from "./workstation-props";
import { WorkstationSurfaces } from "./workstation-surfaces";
import type { Point } from "@/features/experience/camera-shots";
import type { Playhead } from "@/features/experience/playhead";
import {
  monitorCues,
  type DeskTarget,
} from "@/features/experience/studio-desk";
import type { StudioMotion } from "@/features/experience/studio-motion";

const vents: Point[] = Array.from({ length: 16 }, (_, i) => [
  2.18,
  0.35 + i * 0.057,
  -0.56,
]);
export function Workstation({
  playhead,
  compact,
  lamp,
  motion,
  hovered,
}: {
  playhead: Playhead;
  compact: boolean;
  lamp: boolean;
  motion: StudioMotion;
  hovered: RefObject<DeskTarget | null>;
}) {
  return (
    <>
      <Deck size={[8.4, 0.36, 6.8]} />
      <WorkstationSurfaces />
      <Block
        position={[0, 1.387, 0.552]}
        size={[5.42, 0.012, 0.027]}
        color="#697783"
      />
      {[-2.46, 2.46].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <Block
            position={[0, 0.71, 0.33]}
            size={[0.12, 1.42, 0.16]}
            color="#343941"
          />
          <Block
            position={[0, 0.71, -1.72]}
            size={[0.12, 1.42, 0.16]}
            color="#343941"
          />
          <Block
            position={[0, 0.077, -0.69]}
            size={[0.12, 0.11, 2.17]}
            color="#30353a"
          />
        </group>
      ))}
      <Block
        position={[0, 1.3, -1.56]}
        size={[4.89, 0.12, 0.14]}
        color="#3b3d44"
      />
      <WorkstationMonitor
        position={[-1.11, 2.62, -1.78]}
        trim={cyan}
        rotate={0.13}
        slug="seym-soft"
        cue={monitorCues["seym-soft"]}
        playhead={playhead}
        motion={motion}
        hovered={hovered}
      />
      <WorkstationMonitor
        position={[1.11, 2.62, -1.8]}
        trim={violet}
        rotate={-0.155}
        slug="reciclaje"
        cue={monitorCues.reciclaje}
        playhead={playhead}
        motion={motion}
        hovered={hovered}
      />
      <DeskLamp enabled={lamp} hovered={hovered} />
      <DeskAccessories hovered={hovered} />
      <RoundedBox
        position={[2.18, 0.74, -0.96]}
        args={[0.56, 1.37, 0.76]}
        radius={0.035}
        smoothness={3}
        castShadow
      >
        <meshStandardMaterial
          color="#30363d"
          metalness={0.49}
          roughness={0.46}
        />
      </RoundedBox>
      <RepeatBlocks
        positions={vents}
        size={[0.4, 0.015, 0.045]}
        color="#10151d"
      />
      <Block
        position={[2.3, 1.33, -0.569]}
        size={[0.075, 0.033, 0.035]}
        color={cyan}
        glow
      />
      <Line
        points={[
          [1.98, 1.51, -1.57],
          [2.22, 1.47, -1.88],
          [2.22, 0.48, -2.15],
          [2.92, 0.12, -2.25],
          [3.45, 0.04, -1.42],
        ]}
        color="#373e4a"
        transparent
        opacity={0.64}
      />
      <Line
        points={[
          [-0.65, 1.49, -2.06],
          [-0.65, 0.89, -2.2],
          [-0.4, 0.45, -2.45],
          [-1.5, 0.07, -2.55],
        ]}
        color="#4a535e"
        transparent
        opacity={0.55}
      />
      <RoundedBox
        args={[1, 0.18, 0.85]}
        radius={0.076}
        smoothness={3}
        position={[0.05, 0.76, 1.61]}
        castShadow
      >
        <meshStandardMaterial color="#303441" roughness={0.89} />
      </RoundedBox>
      <RoundedBox
        args={[0.93, 0.73, 0.16]}
        radius={0.075}
        smoothness={3}
        position={[0.05, 1.15, 1.99]}
        castShadow
      >
        <meshStandardMaterial color="#343945" roughness={0.88} />
      </RoundedBox>
      <Block position={[0.05, 0.32, 1.62]} size={[0.13, 0.62, 0.13]} />
      <Block
        position={[0.05, 0.052, 1.62]}
        size={[1.02, 0.07, 0.16]}
        color={dark}
      />
      <Block
        position={[0.05, 0.052, 1.62]}
        size={[0.16, 0.07, 0.91]}
        color={dark}
      />
      <pointLight
        position={[2.8, 2.95, -2.9]}
        color="#829dd7"
        intensity={12}
        distance={8}
      />
      <directionalLight
        position={[-4.4, 7.5, 2.9]}
        intensity={1.8}
        color="#ffe5cb"
        castShadow={!compact}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-5.7}
        shadow-camera-right={5.7}
        shadow-camera-top={5}
        shadow-camera-bottom={-4}
        shadow-camera-far={15}
        shadow-normalBias={0.025}
        shadow-intensity={0.63}
      />
    </>
  );
}
