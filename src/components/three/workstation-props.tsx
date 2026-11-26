import { RoundedBox } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import {
  MathUtils,
  DoubleSide,
  Quaternion,
  Vector3,
  type MeshBasicMaterial,
  type Group,
  type PointLight,
} from "three";
import type { Point } from "@/features/experience/camera-shots";
import type { DeskTarget } from "@/features/experience/studio-desk";
import { Block, RepeatBlocks } from "./studio-kit";

function LampArm({ start, end }: { start: Point; end: Point }) {
  const segment = useMemo(() => {
    const from = new Vector3(...start);
    const to = new Vector3(...end);
    const axis = to.clone().sub(from);
    return {
      length: axis.length(),
      center: from.lerp(to, 0.5),
      rotation: new Quaternion().setFromUnitVectors(
        new Vector3(0, 1, 0),
        axis.normalize(),
      ),
    };
  }, [start, end]);
  return (
    <mesh position={segment.center} quaternion={segment.rotation} castShadow>
      <cylinderGeometry args={[0.023, 0.026, segment.length, 12]} />
      <meshStandardMaterial color="#31363c" metalness={0.65} roughness={0.35} />
    </mesh>
  );
}

const hinge: Point = [-0.11, 0.58, -0.2];
const armStart: Point = [0, 0.08, 0];
const head: Point = [0.09, 0.98, 0.02];

export function DeskLamp({
  enabled,
  hovered,
}: {
  enabled: boolean;
  hovered: RefObject<DeskTarget | null>;
}) {
  const bulb = useRef<MeshBasicMaterial>(null);
  const switchLight = useRef<MeshBasicMaterial>(null);
  const light = useRef<PointLight>(null);
  const level = useRef(enabled ? 1 : 0);
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => invalidate(), [enabled, invalidate]);
  useFrame((_, delta) => {
    const target = Number(enabled);
    const next = MathUtils.damp(
      level.current,
      target,
      12,
      Math.min(delta, 0.05),
    );
    level.current = Math.abs(next - target) < 0.007 ? target : next;
    light.current!.intensity = level.current * 9;
    bulb.current!.color.setRGB(
      0.08 + level.current * 0.92,
      0.067 + level.current * 0.65,
      0.058 + level.current * 0.37,
    );
    switchLight.current!.color.set(
      hovered.current === "lamp" ? "#ffffff" : enabled ? "#ffcf9d" : "#64717e",
    );
    if (level.current !== target) invalidate();
  });
  return (
    <group position={[-2.33, 1.574, -1.13]} rotation={[0, -0.48, 0]}>
      <mesh name="lamp" position={[0.03, 0.49, 0.02]} visible={false}>
        <boxGeometry args={[0.59, 1.05, 0.66]} />
      </mesh>
      <mesh position={[0, 0.042, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.235, 0.245, 0.075, 32]} />
        <meshStandardMaterial
          color="#383939"
          roughness={0.47}
          metalness={0.42}
        />
      </mesh>
      <mesh position={[0, 0.081, 0.15]}>
        <cylinderGeometry args={[0.023, 0.024, 0.01, 16]} />
        <meshBasicMaterial ref={switchLight} toneMapped={false} />
      </mesh>
      <LampArm start={armStart} end={hinge} />
      <LampArm start={hinge} end={head} />
      {[hinge, head].map((position) => (
        <mesh
          key={position[1]}
          position={position}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.048, 0.048, 0.084, 18]} />
          <meshStandardMaterial
            color="#c29467"
            roughness={0.33}
            metalness={0.65}
          />
        </mesh>
      ))}
      <group position={head} rotation={[0.34, 0, -0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.088, 0.213, 0.162, 36, 1, true]} />
          <meshStandardMaterial
            color="#47403d"
            metalness={0.54}
            roughness={0.37}
          />
        </mesh>
        <mesh position={[0, 0.086, 0]}>
          <cylinderGeometry args={[0.086, 0.09, 0.023, 24]} />
          <meshStandardMaterial
            color="#756351"
            roughness={0.45}
            metalness={0.54}
          />
        </mesh>
        <mesh position={[0, -0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.196, 36]} />
          <meshBasicMaterial ref={bulb} toneMapped={false} />
        </mesh>
        <pointLight
          ref={light}
          position={[0, -0.17, 0]}
          color="#ffbd81"
          intensity={9}
          distance={3.8}
        />
      </group>
    </group>
  );
}

const creamKeys: Point[] = [];
const charcoalKeys: Point[] = [];
const legends: Point[] = [];
for (let row = 0; row < 5; row++) {
  for (let column = 0; column < 15; column++) {
    if (row === 4 && column >= 4 && column <= 9) continue;
    const x = (column - 7) * 0.077;
    const z = (row - 2) * 0.078;
    const bank =
      row === 0 || column < 2 || column === 14 ? charcoalKeys : creamKeys;
    bank.push([x, 0.043, z]);
    if (bank === creamKeys) legends.push([x - 0.012, 0.062, z - 0.012]);
  }
}

function DeskKeyboard() {
  return (
    <group position={[-0.16, 1.619, 0.22]} rotation={[0, -0.055, 0]}>
      <RoundedBox
        args={[1.23, 0.055, 0.42]}
        radius={0.017}
        smoothness={2}
        castShadow
      >
        <meshStandardMaterial
          color="#323943"
          metalness={0.5}
          roughness={0.44}
        />
      </RoundedBox>
      <RepeatBlocks
        positions={creamKeys}
        size={[0.062, 0.035, 0.064]}
        color="#b5b6b0"
      />
      <RepeatBlocks
        positions={charcoalKeys}
        size={[0.062, 0.035, 0.064]}
        color="#454953"
      />
      <RepeatBlocks
        positions={legends}
        size={[0.013, 0.002, 0.008]}
        color="#575556"
      />
      <Block
        position={[-0.038, 0.043, 0.156]}
        size={[0.451, 0.035, 0.064]}
        color="#a3a9ac"
      />
      <Block
        position={[0.54, 0.064, 0.074]}
        size={[0.053, 0.01, 0.054]}
        color="#8fc5bc"
      />
    </group>
  );
}

export function DeskAccessories({
  hovered,
}: {
  hovered: RefObject<DeskTarget | null>;
}) {
  const phoneSignal = useRef<Group>(null);
  useFrame(() => {
    if (phoneSignal.current)
      phoneSignal.current.visible = hovered.current === "phone";
  });
  return (
    <>
      <DeskKeyboard />
      <group position={[0.94, 1.622, 0.11]} rotation={[0, -0.22, 0]}>
        <RoundedBox
          args={[0.219, 0.11, 0.34]}
          radius={0.048}
          smoothness={4}
          castShadow
        >
          <meshStandardMaterial color="#373b45" roughness={0.56} />
        </RoundedBox>
        <Block
          position={[0, 0.054, -0.061]}
          size={[0.009, 0.008, 0.163]}
          color="#12151a"
        />
        <mesh position={[0, 0.061, -0.059]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.023, 0.023, 0.048, 14]} />
          <meshStandardMaterial color="#5b666a" roughness={0.73} />
        </mesh>
      </group>
      <group position={[-1.65, 1.61, 0.11]} rotation={[0, -0.34, 0]}>
        <mesh name="phone" visible={false} position={[0, 0.045, 0]}>
          <boxGeometry args={[0.38, 0.065, 0.62]} />
        </mesh>
        <RoundedBox
          args={[0.33, 0.056, 0.57]}
          radius={0.025}
          smoothness={3}
          castShadow
        >
          <meshStandardMaterial
            color="#717e88"
            roughness={0.27}
            metalness={0.8}
          />
        </RoundedBox>
        <RoundedBox
          args={[0.306, 0.013, 0.54]}
          radius={0.006}
          smoothness={3}
          position={[0, 0.032, 0]}
        >
          <meshPhysicalMaterial color="#171e27" roughness={0.2} clearcoat={1} />
        </RoundedBox>
        <Block
          position={[0, 0.039, -0.239]}
          size={[0.068, 0.005, 0.012]}
          color="#0c1018"
        />
        <group ref={phoneSignal} visible={false}>
          <Block
            position={[0, 0.04, 0]}
            size={[0.274, 0.005, 0.48]}
            color="#233a4c"
            glow
          />
          <Block
            position={[-0.044, 0.045, -0.115]}
            size={[0.133, 0.004, 0.018]}
            color="#a2dbe8"
            glow
          />
          <Block
            position={[0, 0.045, 0.144]}
            size={[0.095, 0.004, 0.008]}
            color="#a2dbe8"
            glow
          />
        </group>
      </group>
      <group position={[2.17, 1.575, -0.36]} rotation={[0, 0.19, 0]}>
        <mesh position={[0, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.145, 0.126, 0.353, 28, 1, true]} />
          <meshStandardMaterial
            color="#9c7562"
            roughness={0.4}
            side={DoubleSide}
          />
        </mesh>
        <mesh position={[0, 0.31, 0]}>
          <cylinderGeometry args={[0.138, 0.134, 0.014, 28]} />
          <meshStandardMaterial color="#282021" roughness={0.32} />
        </mesh>
        <mesh position={[0.16, 0.192, 0]} rotation={[0.12, Math.PI / 2, 0]}>
          <torusGeometry args={[0.09, 0.017, 10, 24]} />
          <meshStandardMaterial color="#926c58" roughness={0.44} />
        </mesh>
      </group>
    </>
  );
}
