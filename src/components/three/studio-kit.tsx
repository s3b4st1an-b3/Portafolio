import { Line } from "@react-three/drei";
import { useLayoutEffect, useRef } from "react";
import { BoxGeometry, Object3D, type InstancedMesh } from "three";
import type { Point } from "@/features/experience/camera-shots";

export const cyan = "#9ddfc7";
export const violet = "#c6b8dd";
export const metal = "#29364e";
export const dark = "#111726";
const unitBox = new BoxGeometry();

export function Block({
  position,
  size,
  color = metal,
  glow = false,
  rotation,
}: {
  position: Point;
  size: Point;
  color?: string;
  glow?: boolean;
  rotation?: Point;
}) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      scale={size}
      geometry={unitBox}
    >
      {glow ? (
        <meshBasicMaterial color={color} toneMapped={false} />
      ) : (
        <meshStandardMaterial color={color} metalness={0.43} roughness={0.42} />
      )}
    </mesh>
  );
}

export function RepeatBlocks({
  positions,
  size,
  color,
  glow = false,
}: {
  positions: Point[];
  size: Point;
  color: string;
  glow?: boolean;
}) {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const transform = new Object3D();
    transform.scale.set(...size);
    positions.forEach((point, index) => {
      transform.position.set(...point);
      transform.updateMatrix();
      ref.current?.setMatrixAt(index, transform.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.computeBoundingSphere();
  }, [positions, size]);
  return (
    <instancedMesh ref={ref} args={[unitBox, undefined, positions.length]}>
      {glow ? (
        <meshBasicMaterial color={color} toneMapped={false} />
      ) : (
        <meshStandardMaterial color={color} roughness={0.54} metalness={0.28} />
      )}
    </instancedMesh>
  );
}

export function Deck({ size, color = cyan }: { size: Point; color?: string }) {
  const x = size[0] / 2;
  const z = size[2] / 2;
  return (
    <>
      <mesh
        position={[0, -0.2, 0]}
        scale={size}
        geometry={unitBox}
        receiveShadow
      >
        <meshStandardMaterial
          color="#172034"
          metalness={0.35}
          roughness={0.59}
        />
      </mesh>
      <Line
        points={[
          [-x, 0.035, -z],
          [x, 0.035, -z],
          [x, 0.035, z],
          [-x, 0.035, z],
          [-x, 0.035, -z],
        ]}
        color={color}
        transparent
        opacity={0.6}
        lineWidth={1}
      />
    </>
  );
}
