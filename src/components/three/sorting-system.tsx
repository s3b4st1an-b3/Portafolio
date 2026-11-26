import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MathUtils, type Group } from "three";
import { Block } from "./studio-kit";

const bins = ["#b4a6d5", "#dcac68", "#8ec9a3", "#8cbdcb"];
const binX = (index: number) => (index - 1.5) * 1.12;
const restingHeights = [0.112, 0.087, 0.111, 0.17];
const finishZ = (row: number) => 0.49 + row * 0.34;

export function SortingSystem({ progress }: { progress: () => number }) {
  const pieces = useRef<Group>(null);
  const lastTime = useRef(-1);
  useFrame(() => {
    if (!pieces.current) return;
    const time = progress() * 4;
    if (lastTime.current === time) return;
    lastTime.current = time;
    pieces.current.children.forEach((piece, index) => {
      const bin = index % bins.length;
      const row = Math.floor(index / bins.length);
      const gather = MathUtils.smootherstep(time - index * 0.062, 0, 1.15);
      const sort = MathUtils.smootherstep(time - index * 0.09, 1.21, 2.83);
      piece.position.set(
        MathUtils.lerp(-2.11 + bin * 0.53 + 1.32 * gather, binX(bin), sort),
        restingHeights[bin] + Math.sin(sort * Math.PI) * 0.61,
        MathUtils.lerp(-1.23 + row * 0.33, finishZ(row), sort),
      );
      piece.rotation.y = index * 0.5 + sort;
    });
  });
  return (
    <group position={[0, -0.45, 0]}>
      <Block
        position={[0, -0.225, 0]}
        size={[5.25, 0.2, 3.15]}
        color="#394443"
      />
      <Block
        position={[0, -0.071, -0.68]}
        size={[5.04, 0.141, 1.45]}
        color="#252e2e"
      />
      <mesh position={[0, 0.011, -0.58]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.79, 0.83, 36]} />
        <meshBasicMaterial color="#8eb7a9" />
      </mesh>
      {bins.map((color, index) => (
        <group key={color} position={[binX(index), -0.06, 0.84]}>
          <Block
            position={[0, 0, 0]}
            size={[0.95, 0.11, 1.21]}
            color="#252e31"
          />
          <Block
            position={[-0.44, 0.086, 0]}
            size={[0.07, 0.12, 1.21]}
            color="#4c5957"
          />
          <Block
            position={[0.44, 0.086, 0]}
            size={[0.07, 0.12, 1.21]}
            color="#4c5957"
          />
          <Block
            position={[0, 0.089, 0.571]}
            size={[0.92, 0.138, 0.068]}
            color="#59635d"
          />
          <Block
            position={[0, 0.061, 0.611]}
            size={[0.48, 0.038, 0.012]}
            color={color}
            glow
          />
        </group>
      ))}
      <group ref={pieces}>
        {Array.from({ length: 12 }, (_, index) => (
          <mesh
            key={index}
            scale={0.7}
            position={[
              binX(index % bins.length),
              restingHeights[index % bins.length],
              finishZ(Math.floor(index / bins.length)),
            ]}
          >
            {index % bins.length === 0 ? (
              <tetrahedronGeometry args={[0.27]} />
            ) : index % bins.length === 1 ? (
              <boxGeometry args={[0.38, 0.24, 0.34]} />
            ) : index % bins.length === 2 ? (
              <cylinderGeometry args={[0.2, 0.2, 0.31, 10]} />
            ) : (
              <octahedronGeometry args={[0.24]} />
            )}
            <meshStandardMaterial
              color={bins[index % bins.length]}
              roughness={0.44}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
