import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import {
  Color,
  MathUtils,
  Vector3,
  type DirectionalLight,
  type HemisphereLight,
  type PointLight,
} from "three";
import type { StudioMotion } from "@/features/experience/studio-motion";

const moods = [
  {
    time: 1.68,
    position: new Vector3(-2.9, 4.9, 1.6),
    color: new Color("#ffdfc7"),
    power: 16,
  },
  {
    time: 2.02,
    position: new Vector3(10.85, 3.85, 0.45),
    color: new Color("#b9deeb"),
    power: 27,
  },
  {
    time: 3.15,
    position: new Vector3(21.5, 4.25, -4.7),
    color: new Color("#b8d5e5"),
    power: 35,
  },
  {
    time: 4.09,
    position: new Vector3(11.6, 4.1, -15.63),
    color: new Color("#e4f6db"),
    power: 47,
  },
  {
    time: 5.35,
    position: new Vector3(-2.9, 4.9, 1.6),
    color: new Color("#ffdebd"),
    power: 16,
  },
];

const cursorCyan = new Color("#68cbf3");
const cursorViolet = new Color("#ac92f4");

export function StudioLighting({ motion }: { motion: StudioMotion }) {
  const key = useRef<DirectionalLight>(null);
  const ambient = useRef<HemisphereLight>(null);
  const local = useRef<PointLight>(null);
  const cursorPosition = useRef(new Vector3());
  const cursorColor = useRef(new Color());
  useFrame(() => {
    const p = motion.playhead.read();
    const index = Math.max(
      0,
      moods.findLastIndex((mood) => mood.time <= p),
    );
    const mood = moods[index];
    const next = moods[index + 1] ?? mood;
    const mix =
      mood === next
        ? 0
        : MathUtils.smootherstep(
            p,
            Math.max(mood.time, next.time - 0.34),
            next.time,
          );
    if (local.current) {
      local.current.position.lerpVectors(mood.position, next.position, mix);
      local.current.color.lerpColors(mood.color, next.color, mix);
      local.current.intensity = MathUtils.lerp(mood.power, next.power, mix);
      if (p >= 5.35) {
        const focus = motion.presence.current;
        const { x, y } = motion.aim;
        cursorPosition.current.set(x * 4.8, 2.45 + y * 1.65, -0.45);
        cursorColor.current.lerpColors(
          cursorCyan,
          cursorViolet,
          MathUtils.smoothstep(x, -0.36, 0.36),
        );
        local.current.position.lerp(cursorPosition.current, focus);
        local.current.color.lerp(cursorColor.current, focus * 0.62);
        local.current.intensity += 10 * focus;
      }
    }
    if (key.current)
      key.current.intensity =
        1.8 + Math.sin(Math.PI * MathUtils.smoothstep(p, 0.7, 4.4)) * 0.47;
    if (ambient.current)
      ambient.current.intensity =
        1.48 + MathUtils.smoothstep(p, 3.1, 5.8) * 0.19;
  }, -1);
  return (
    <>
      <fog attach="fog" args={["#141e22", 14, 41]} />
      <hemisphereLight
        ref={ambient}
        color="#d8e8e5"
        groundColor="#322924"
        intensity={1.48}
      />
      <directionalLight
        ref={key}
        position={[7, 12, 8]}
        color="#eaf2fb"
        intensity={1.8}
      />
      <directionalLight
        position={[-5, 3, -7]}
        color="#9ab6bb"
        intensity={1.18}
      />
      <pointLight
        ref={local}
        position={moods[0].position}
        color={moods[0].color}
        intensity={16}
        distance={11}
        decay={2}
      />
    </>
  );
}
