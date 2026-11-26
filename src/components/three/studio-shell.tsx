import { Line } from "@react-three/drei";
import { Block, RepeatBlocks, cyan, violet } from "./studio-kit";
import { StudioFloor } from "./studio-floor";
import type { Point } from "@/features/experience/camera-shots";

const rails: Point[][] = [
  [
    [-3, 0.02, 2.85],
    [3.5, 0.02, 2.85],
    [5.15, 0.02, 1.2],
    [16.1, 0.02, 1.2],
    [20.1, 0.02, -2.8],
    [20.1, 0.02, -5],
  ],
  [
    [-3, 0.02, 3.16],
    [3.68, 0.02, 3.16],
    [5.31, 0.02, 1.51],
    [16.22, 0.02, 1.51],
    [20.42, 0.02, -2.7],
    [20.42, 0.02, -5],
  ],
  [
    [23.2, 0.04, -10],
    [23.2, 0.04, -12.5],
    [19.2, 0.04, -16.5],
    [16.7, 0.04, -16.5],
  ],
  [
    [11.5, 0.035, -17.5],
    [7.6, 0.035, -17.5],
    [5.1, 0.035, -15],
    [5.1, 0.035, -8],
    [1.1, 0.035, -4],
  ],
];
const guideLights: Point[] = Array.from({ length: 14 }, (_, i) => [
  i * 1.25 - 2.7,
  0.028,
  3.5,
]);
const supportPositions: Point[] = [
  [-4.65, 2.7, -4.5],
  [4.15, 2.7, -4.5],
  [11, 2.7, -4.5],
  [17.4, 2.7, -4.5],
  [25.8, 2.7, -11.6],
  [17.8, 2.7, -19.7],
  [7.3, 2.7, -19.7],
];
const lightPositions: Point[] = supportPositions.map(([x, y, z]) => [
  x,
  y + 0.2,
  z + 0.14,
]);
const ceilingPositions: Point[] = [
  [-0.25, 5.4, -4.5],
  [7.5, 5.4, -4.5],
  [14, 5.4, -4.5],
  [12.5, 5.4, -19.7],
];
const acousticSlats: Point[] = Array.from({ length: 23 }, (_, index) => [
  index * 0.2 - 5.7,
  3.4,
  -11.86,
]);
const rearColumns: Point[] = Array.from({ length: 8 }, (_, index) => [
  index * 4.7 - 4.0,
  4.2,
  -24.8,
]);

export function StudioShell() {
  return (
    <>
      <StudioFloor />
      <Block
        position={[12, 4.15, -25.13]}
        size={[41, 9.1, 0.32]}
        color="#2f363e"
      />
      <RepeatBlocks
        positions={rearColumns}
        size={[0.15, 8.57, 0.14]}
        color="#4b545c"
      />
      <Block
        position={[12, 5.65, -24.92]}
        size={[40.3, 0.037, 0.03]}
        color="#667e86"
        glow
      />
      <Block
        position={[31.4, 4.15, -12.8]}
        size={[0.21, 9.05, 24.6]}
        color="#242e37"
      />
      <Block
        position={[-3.5, 3.4, -11.97]}
        size={[4.7, 6.8, 0.22]}
        color="#242631"
      />
      <RepeatBlocks
        positions={acousticSlats}
        size={[0.075, 6.8, 0.05]}
        color="#343637"
      />
      <Block
        position={[1.35, 3.4, -12]}
        size={[5.05, 6.8, 0.2]}
        color="#29303b"
      />
      <Block
        position={[-1.11, 3.45, -11.87]}
        size={[0.033, 4.65, 0.035]}
        color="#a4866b"
        glow
      />
      <pointLight
        position={[-1.23, 3.5, -11.1]}
        color="#f3cba2"
        intensity={15}
        distance={6}
      />
      <RepeatBlocks
        positions={supportPositions}
        size={[0.25, 5.4, 0.25]}
        color="#243249"
      />
      <RepeatBlocks
        positions={lightPositions}
        size={[0.028, 3.7, 0.025]}
        color="#507697"
        glow
      />
      <RepeatBlocks
        positions={ceilingPositions}
        size={[8, 0.16, 0.28]}
        color="#273148"
      />
      <RepeatBlocks
        positions={guideLights}
        size={[0.46, 0.028, 0.052]}
        color="#57718e"
        glow
      />
      {rails.map((points, i) => (
        <Line
          key={i}
          points={points}
          color={i > 1 ? violet : cyan}
          lineWidth={i === 0 ? 1.6 : 1}
          transparent
          opacity={i % 2 === 0 ? 0.55 : 0.27}
        />
      ))}
      <Block
        position={[10.3, 3.65, -4.55]}
        size={[13.6, 0.05, 0.1]}
        color="#445270"
      />
    </>
  );
}
