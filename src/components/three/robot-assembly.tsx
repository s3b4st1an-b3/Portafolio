import { RoundedBox } from "@react-three/drei";
import type { RefObject } from "react";
import { Shape, Vector2, type Group } from "three";

const helmetProfile = [
  [0, -0.46],
  [0.19, -0.44],
  [0.32, -0.37],
  [0.42, -0.23],
  [0.48, 0.03],
  [0.46, 0.25],
  [0.36, 0.42],
  [0.2, 0.51],
  [0, 0.54],
].map(([radius, height]) => new Vector2(radius, height));

const visor = new Shape();
visor.moveTo(-0.41, 0.21);
visor.bezierCurveTo(-0.23, 0.34, 0.23, 0.34, 0.41, 0.21);
visor.bezierCurveTo(0.49, 0.06, 0.34, -0.28, 0.23, -0.35);
visor.quadraticCurveTo(0, -0.44, -0.23, -0.35);
visor.bezierCurveTo(-0.34, -0.28, -0.49, 0.06, -0.41, 0.21);

const chest = new Shape();
chest.moveTo(-0.62, 0.42);
chest.quadraticCurveTo(-0.7, 0.39, -0.63, 0.14);
chest.lineTo(-0.38, -0.45);
chest.quadraticCurveTo(0, -0.56, 0.38, -0.45);
chest.lineTo(0.63, 0.14);
chest.quadraticCurveTo(0.7, 0.39, 0.62, 0.42);
chest.quadraticCurveTo(0, 0.62, -0.62, 0.42);

const visorBevel = {
  depth: 0.07,
  bevelThickness: 0.08,
  bevelSize: 0.035,
  bevelSegments: 4,
  curveSegments: 16,
};
const chestBevel = {
  depth: 0.15,
  bevelThickness: 0.14,
  bevelSize: 0.09,
  bevelSegments: 5,
  curveSegments: 16,
};
const armor = "#82909e";
const steel = "#3b4a58";
const graphite = "#172330";
const status = "#8de9f0";

function Collar() {
  return (
    <>
      {[0, 0.07, 0.14].map((offset) => (
        <mesh key={offset} position={[0, 2.62 + offset, 0]}>
          <cylinderGeometry args={[0.195, 0.195, 0.04, 28]} />
          <meshStandardMaterial
            color={steel}
            roughness={0.38}
            metalness={0.82}
          />
        </mesh>
      ))}
    </>
  );
}

function Head({ pivot }: { pivot: RefObject<Group | null> }) {
  return (
    <group ref={pivot} position={[0, 2.91, 0]}>
      <group position={[0, 0.22, 0]}>
        <mesh scale={[1.02, 1, 0.93]}>
          <latheGeometry args={[helmetProfile, 52]} />
          <meshStandardMaterial
            color={armor}
            metalness={0.72}
            roughness={0.31}
          />
        </mesh>
        <mesh
          position={[0, 0, 0.284]}
          rotation={[-0.12, 0, 0]}
          scale={[0.98, 0.99, 1]}
        >
          <extrudeGeometry args={[visor, visorBevel]} />
          <meshPhysicalMaterial
            color="#080e18"
            roughness={0.19}
            metalness={0.56}
            clearcoat={0.74}
          />
        </mesh>
        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh
              position={[side * 0.452, -0.03, -0.05]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.176, 0.176, 0.102, 32]} />
              <meshStandardMaterial
                color={graphite}
                metalness={0.74}
                roughness={0.29}
              />
            </mesh>
            <mesh
              position={[side * 0.512, -0.03, -0.05]}
              rotation={[0, Math.PI / 2, 0]}
            >
              <torusGeometry args={[0.098, 0.009, 8, 30]} />
              <meshBasicMaterial color="#70bfd2" />
            </mesh>
            <RoundedBox
              args={[0.137, 0.027, 0.014]}
              radius={0.007}
              smoothness={2}
              position={[side * 0.157, 0.041, 0.463]}
              rotation={[0, side * 0.14, side * -0.08]}
            >
              <meshBasicMaterial color={status} />
            </RoundedBox>
          </group>
        ))}
        <mesh position={[0, -0.205, 0.424]}>
          <boxGeometry args={[0.11, 0.012, 0.018]} />
          <meshBasicMaterial color="#6eabb6" />
        </mesh>
      </group>
    </group>
  );
}

function Arm({
  side,
  pivot,
}: {
  side: number;
  pivot: RefObject<Group | null>;
}) {
  return (
    <group position={[side * 0.74, 2.35, 0]} ref={pivot}>
      <mesh>
        <sphereGeometry args={[0.233, 28, 16]} />
        <meshStandardMaterial color={steel} metalness={0.73} roughness={0.32} />
      </mesh>
      <RoundedBox
        args={[0.39, 0.58, 0.46]}
        radius={0.13}
        smoothness={4}
        position={[side * 0.07, -0.33, 0]}
      >
        <meshStandardMaterial color={armor} metalness={0.78} roughness={0.34} />
      </RoundedBox>
      <group
        position={[side * 0.08, -0.65, 0]}
        rotation={[-0.25, 0, side * -0.15]}
      >
        <mesh>
          <sphereGeometry args={[0.169, 24, 16]} />
          <meshStandardMaterial
            color={graphite}
            metalness={0.63}
            roughness={0.3}
          />
        </mesh>
        <RoundedBox
          args={[0.29, 0.54, 0.36]}
          radius={0.095}
          smoothness={4}
          position={[0, -0.32, 0]}
        >
          <meshStandardMaterial
            color={steel}
            metalness={0.72}
            roughness={0.32}
          />
        </RoundedBox>
        <RoundedBox
          args={[0.083, 0.225, 0.014]}
          radius={0.009}
          smoothness={2}
          position={[0, -0.32, 0.178]}
        >
          <meshStandardMaterial
            color={status}
            emissive="#49b1c4"
            emissiveIntensity={0.5}
            roughness={0.5}
            metalness={0.35}
          />
        </RoundedBox>
        <RoundedBox
          args={[0.235, 0.24, 0.195]}
          radius={0.055}
          smoothness={3}
          position={[0, -0.69, 0.012]}
        >
          <meshStandardMaterial
            color={graphite}
            roughness={0.43}
            metalness={0.62}
          />
        </RoundedBox>
        {[-0.069, 0, 0.069].map((x) => (
          <RoundedBox
            key={x}
            args={[0.057, 0.133, 0.092]}
            radius={0.019}
            smoothness={2}
            position={[x, -0.805, 0.019]}
          >
            <meshStandardMaterial
              color={steel}
              roughness={0.45}
              metalness={0.65}
            />
          </RoundedBox>
        ))}
      </group>
    </group>
  );
}

export function RobotAssembly({
  head,
  left,
  right,
}: {
  head: RefObject<Group | null>;
  left: RefObject<Group | null>;
  right: RefObject<Group | null>;
}) {
  return (
    <>
      <RoundedBox
        args={[0.54, 1.03, 0.5]}
        radius={0.12}
        smoothness={3}
        position={[0, 1.09, -0.02]}
      >
        <meshStandardMaterial
          color={graphite}
          metalness={0.54}
          roughness={0.36}
        />
      </RoundedBox>
      {[1, 1.14, 1.28, 1.42].map((height) => (
        <RoundedBox
          key={height}
          args={[0.59, 0.071, 0.53]}
          radius={0.023}
          smoothness={3}
          position={[0, height, -0.02]}
        >
          <meshStandardMaterial
            color={steel}
            metalness={0.75}
            roughness={0.35}
          />
        </RoundedBox>
      ))}
      <RoundedBox
        args={[0.88, 0.36, 0.62]}
        radius={0.13}
        smoothness={4}
        position={[0, 0.75, -0.03]}
      >
        <meshStandardMaterial
          color={graphite}
          metalness={0.8}
          roughness={0.31}
        />
      </RoundedBox>
      {[-1, 1].map((side) => (
        <group
          key={side}
          position={[side * 0.25, 0, -0.035]}
          rotation={[0, 0, side * -0.08]}
        >
          <RoundedBox
            args={[0.34, 0.62, 0.38]}
            radius={0.105}
            smoothness={3}
            position={[0, 0.33, 0]}
          >
            <meshStandardMaterial
              color={steel}
              metalness={0.65}
              roughness={0.39}
            />
          </RoundedBox>
          <mesh>
            <sphereGeometry args={[0.135, 24, 16]} />
            <meshStandardMaterial
              color={graphite}
              metalness={0.66}
              roughness={0.32}
            />
          </mesh>
          <RoundedBox
            args={[0.28, 0.55, 0.31]}
            radius={0.07}
            smoothness={3}
            position={[0, -0.32, 0]}
          >
            <meshStandardMaterial
              color={steel}
              metalness={0.67}
              roughness={0.37}
            />
          </RoundedBox>
        </group>
      ))}
      <mesh position={[0, 2.02, -0.15]}>
        <extrudeGeometry args={[chest, chestBevel]} />
        <meshStandardMaterial color={armor} metalness={0.69} roughness={0.34} />
      </mesh>
      <mesh position={[0, 2.02, 0.09]} scale={[0.83, 0.87, 0.65]}>
        <extrudeGeometry args={[chest, chestBevel]} />
        <meshPhysicalMaterial
          color={graphite}
          metalness={0.64}
          roughness={0.29}
          clearcoat={0.42}
        />
      </mesh>
      <RoundedBox
        args={[0.33, 0.019, 0.02]}
        radius={0.008}
        smoothness={2}
        position={[0, 2.22, 0.291]}
      >
        <meshBasicMaterial color={status} />
      </RoundedBox>
      <Collar />
      <Head pivot={head} />
      <Arm side={-1} pivot={left} />
      <Arm side={1} pivot={right} />
    </>
  );
}
