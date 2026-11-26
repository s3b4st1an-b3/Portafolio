import { Line, RoundedBox } from "@react-three/drei";
import type { Point } from "@/features/experience/camera-shots";
import { Block, RepeatBlocks } from "./studio-kit";

const rackRows: Point[] = [0.36, 0.09, -0.18].map((y) => [0, y, 0.12]);
const rackLeds: Point[] = rackRows.map(([, y]) => [0.32, y, 0.191]);
const contacts: Point[] = Array.from({ length: 8 }, (_, i) => [
  (i % 4) * 0.17 - 0.255,
  i < 4 ? 0.423 : -0.223,
  0.049,
]);

export function ToolModel({
  index,
  accent,
}: {
  index: number;
  accent: string;
}) {
  switch (index) {
    case 0:
      return (
        <group position={[0, 0.12, 0.145]} rotation={[-0.08, -0.07, 0]}>
          <RoundedBox args={[1.04, 0.76, 0.08]} radius={0.029} smoothness={2}>
            <meshStandardMaterial
              color="#71818b"
              metalness={0.42}
              roughness={0.47}
            />
          </RoundedBox>
          <Block
            position={[0, 0, 0.044]}
            size={[0.952, 0.679, 0.014]}
            color="#172632"
            glow
          />
          <Block
            position={[0, 0.258, 0.057]}
            size={[0.838, 0.066, 0.015]}
            color={accent}
            glow
          />
          <Block
            position={[-0.215, -0.03, 0.057]}
            size={[0.41, 0.42, 0.017]}
            color="#4b7889"
          />
          <Block
            position={[0.218, 0.04, 0.057]}
            size={[0.32, 0.295, 0.017]}
            color="#345768"
          />
          <Block
            position={[0.217, -0.159, 0.057]}
            size={[0.32, 0.05, 0.017]}
            color={accent}
            glow
          />
        </group>
      );
    case 1:
      return (
        <>
          <RepeatBlocks
            positions={rackRows}
            size={[0.92, 0.197, 0.144]}
            color="#748087"
          />
          <RepeatBlocks
            positions={rackLeds}
            size={[0.037, 0.026, 0.012]}
            color={accent}
            glow
          />
          <RepeatBlocks
            positions={rackRows.map(([, y]) => [-0.118, y, 0.196])}
            size={[0.45, 0.058, 0.014]}
            color="#202a30"
          />
        </>
      );
    case 2:
      return (
        <group position={[0, 0.105, 0.12]}>
          {[-0.27, -0.095, 0.08, 0.255].map((y, layer) => (
            <mesh key={y} position={[0, y, 0]}>
              <cylinderGeometry args={[0.368, 0.368, 0.133, 28]} />
              <meshStandardMaterial
                color={layer % 2 ? "#879583" : "#556e65"}
                roughness={0.38}
                metalness={0.52}
              />
            </mesh>
          ))}
          <mesh position={[0, 0.325, 0]}>
            <cylinderGeometry args={[0.226, 0.226, 0.012, 24]} />
            <meshBasicMaterial color={accent} toneMapped={false} />
          </mesh>
        </group>
      );
    case 3:
      return (
        <>
          {([-0.26, 0.252] as const).map((x, slot) => (
            <group
              key={x}
              position={[x, 0.1 - slot * 0.085, 0.15 + slot * 0.063]}
              rotation={[0, -0.15 + slot * 0.37, 0]}
            >
              <RoundedBox
                args={[0.412, 0.787, 0.08]}
                radius={0.035}
                smoothness={3}
              >
                <meshStandardMaterial
                  color="#8d847e"
                  roughness={0.34}
                  metalness={0.65}
                />
              </RoundedBox>
              <Block
                position={[0, 0, 0.044]}
                size={[0.363, 0.713, 0.013]}
                color="#1b2630"
                glow
              />
              <Block
                position={[0, 0.152, 0.055]}
                size={[0.24, 0.162, 0.012]}
                color={accent}
                glow
              />
              <Block
                position={[0, -0.057, 0.055]}
                size={[0.24, 0.067, 0.012]}
                color="#526a7b"
              />
              <Block
                position={[0, -0.197, 0.055]}
                size={[0.18, 0.034, 0.012]}
                color="#526a7b"
              />
            </group>
          ))}
        </>
      );
    case 4:
      return (
        <group position={[0, 0.095, 0.1]}>
          <Block
            position={[0, 0, -0.023]}
            size={[0.96, 0.75, 0.12]}
            color="#273d44"
          />
          <Line
            points={[
              [-0.31, -0.21, 0.047],
              [-0.31, 0.23, 0.047],
              [0.31, 0.23, 0.047],
            ]}
            color={accent}
            lineWidth={2.4}
          />
          <Line
            points={[
              [-0.31, -0.08, 0.044],
              [-0.12, 0.04, 0.044],
              [0.13, 0.04, 0.044],
              [0.31, 0.23, 0.044],
            ]}
            color="#cddbd5"
            lineWidth={2.2}
          />
          <RepeatBlocks
            positions={[
              [-0.31, -0.21, 0.048],
              [-0.31, 0.23, 0.048],
              [0.13, 0.04, 0.048],
              [0.31, 0.23, 0.048],
            ]}
            size={[0.082, 0.082, 0.027]}
            color={accent}
            glow
          />
        </group>
      );
    default:
      return (
        <group position={[0, 0.02, 0.12]} rotation={[0, -0.12, 0]}>
          <Block
            position={[0, 0.1, 0]}
            size={[0.92, 0.811, 0.12]}
            color="#364e46"
          />
          <RepeatBlocks
            positions={contacts}
            size={[0.078, 0.045, 0.026]}
            color="#9c925d"
          />
          <mesh position={[0, 0.1, 0.106]} rotation={[0.19, 0.32, 0.63]}>
            <octahedronGeometry args={[0.292, 0]} />
            <meshStandardMaterial
              color="#7f987f"
              emissive="#203832"
              metalness={0.4}
              roughness={0.31}
            />
          </mesh>
          <Block
            position={[0, 0.1, 0.057]}
            size={[0.64, 0.084, 0.018]}
            color={accent}
            glow
          />
        </group>
      );
  }
}
