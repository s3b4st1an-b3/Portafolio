import { RoundedBox } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Suspense,
  useMemo,
  useRef,
  useSyncExternalStore,
  type RefObject,
} from "react";
import {
  Color,
  MathUtils,
  Vector2,
  type Mesh,
  type ShaderMaterial,
} from "three";
import { captures } from "@/data/project-images";
import type { Point } from "@/features/experience/camera-shots";
import type { Playhead } from "@/features/experience/playhead";
import type { DeskTarget } from "@/features/experience/studio-desk";
import type { StudioMotion } from "@/features/experience/studio-motion";
import type { ProjectSlug } from "@/types/portfolio";
import { useCaptureTexture } from "./capture-texture";
import { MonitorSignal } from "./monitor-signal";
import { Block, RepeatBlocks } from "./studio-kit";

const screenWidth = 2.04;
const screenHeight = (screenWidth * 900) / 1440;

const rearVents: Point[] = Array.from({ length: 14 }, (_, i) => [
  (i - 6.5) * 0.061,
  -0.24,
  -0.197,
]);

const vertexShader = `
  varying vec2 screenUv;
  varying vec4 clipPosition;
  varying float viewingAngle;
  void main() {
    screenUv = uv;
    vec4 cameraSpace = modelViewMatrix * vec4(position, 1.0);
    viewingAngle = clamp(dot(normalize(normalMatrix * normal), normalize(-cameraSpace.xyz)), 0.0, 1.0);
    gl_Position = projectionMatrix * cameraSpace;
    clipPosition = gl_Position;
  }
`;

const fragmentShader = `
  uniform sampler2D capture;
  uniform float reveal;
  uniform float detail;
  uniform vec2 aim;
  uniform float hovered;
  uniform float cursorLight;
  uniform vec3 cursorTint;
  varying vec2 screenUv;
  varying vec4 clipPosition;
  varying float viewingAngle;

  void main() {
    vec2 uv = 0.5 + (screenUv - 0.5) * (1.0 - detail * 0.085);
    vec3 pixels = texture2D(capture, uv).rgb;
    float scan = (1.0 - screenUv.y) - mix(-0.1, 1.1, reveal);
    float band = exp(-abs(scan) * 62.0) * sin(reveal * 3.14159265);
    float mask = 1.0 - smoothstep(-0.034, 0.034, scan);
    float distanceToSoftbox = 6.0 * (screenUv.y + 0.34 * screenUv.x - 1.04 - 0.075 * aim.y);
    float softbox = exp(-distanceToSoftbox * distanceToSoftbox);
    float oblique = pow(1.0 - viewingAngle, 3.0);
    float rim = smoothstep(0.455, 0.50, max(abs(screenUv.x - 0.5), abs(screenUv.y - 0.5)));
    vec3 reflection = vec3(0.045, 0.068, 0.095) * softbox * (0.13 + oblique + hovered * 0.16);
    vec2 fromCursor = (clipPosition.xy / clipPosition.w - aim) * vec2(1.65, 1.0);
    float cursorGlow = 1.0 - smoothstep(0.015, 0.29, length(fromCursor));
    reflection += cursorTint * (0.12 * cursorGlow * cursorLight);
    gl_FragColor = vec4(pixels + reflection + vec3(0.08, 0.17, 0.22) * band + hovered * rim * vec3(0.015, 0.038, 0.05), mask);
    #include <colorspace_fragment>
  }
`;

function MonitorCapture({
  slug,
  trim,
  playhead,
  cue,
  motion,
  hovered,
}: {
  slug: ProjectSlug;
  trim: string;
  playhead: Playhead;
  cue: number;
  motion: StudioMotion;
  hovered: RefObject<DeskTarget | null>;
}) {
  const texture = useCaptureTexture(captures[slug].file);
  const material = useRef<ShaderMaterial>(null);
  const invalidate = useThree((state) => state.invalidate);
  const uniforms = useMemo(
    () => ({
      capture: { value: texture },
      reveal: { value: 0 },
      detail: { value: 0 },
      aim: { value: new Vector2() },
      hovered: { value: 0 },
      cursorLight: { value: 0 },
      cursorTint: { value: new Color(trim) },
    }),
    [texture, trim],
  );

  useFrame((_, delta) => {
    if (!material.current) return;
    const current = material.current.uniforms;
    const progress = playhead.read();
    const focusIn = MathUtils.smootherstep(progress, cue + 0.018, cue + 0.115);
    const focusOut = 1 - MathUtils.smootherstep(progress, 5.82, 5.99);
    current.reveal.value = MathUtils.smootherstep(progress, cue, cue + 0.095);
    current.detail.value = focusIn * focusOut;
    current.aim.value.copy(motion.aim);
    current.cursorLight.value = motion.presence.current;
    const target = Number(hovered.current === slug);
    const next = MathUtils.damp(
      current.hovered.value,
      target,
      15,
      Math.min(delta, 0.05),
    );
    current.hovered.value = Math.abs(next - target) < 0.008 ? target : next;
    if (current.hovered.value !== target) invalidate();
  });

  return (
    <mesh position={[0, 0, 0.096]}>
      <planeGeometry args={[screenWidth, screenHeight]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

export function WorkstationMonitor({
  position,
  trim,
  rotate,
  playhead,
  slug,
  cue,
  motion,
  hovered,
}: {
  position: Point;
  trim: string;
  rotate: number;
  playhead: Playhead;
  slug: ProjectSlug;
  cue: number;
  motion: StudioMotion;
  hovered: RefObject<DeskTarget | null>;
}) {
  const indicator = useRef<Mesh>(null);
  const showCapture = useSyncExternalStore(
    playhead.subscribe,
    () => playhead.read() >= 5.13,
    () => false,
  );

  useFrame(() => {
    const progress = playhead.read();
    const power = MathUtils.smootherstep(progress, cue - 0.02, cue + 0.025);
    if (indicator.current)
      indicator.current.scale.setScalar(
        0.72 + power * 0.26 + Number(hovered.current === slug) * 0.42,
      );
  });

  return (
    <group position={position} rotation={[0, rotate, 0]}>
      <RoundedBox
        args={[2.136, 1.376, 0.166]}
        radius={0.032}
        smoothness={4}
        castShadow
      >
        <meshStandardMaterial
          color="#555963"
          metalness={0.54}
          roughness={0.3}
        />
      </RoundedBox>
      <RoundedBox
        args={[2.093, 1.326, 0.014]}
        radius={0.024}
        smoothness={3}
        position={[0, 0, 0.082]}
      >
        <meshStandardMaterial
          color="#0a101a"
          metalness={0.32}
          roughness={0.22}
        />
      </RoundedBox>
      <RoundedBox
        args={[1.13, 0.68, 0.14]}
        radius={0.042}
        smoothness={2}
        position={[0, -0.082, -0.125]}
      >
        <meshStandardMaterial
          color="#32353c"
          metalness={0.4}
          roughness={0.48}
        />
      </RoundedBox>
      <RepeatBlocks
        positions={rearVents}
        size={[0.047, 0.017, 0.009]}
        color="#151820"
      />
      <Block
        position={[0, -0.548, -0.085]}
        size={[0.42, 0.09, 0.027]}
        color="#15191f"
      />
      <mesh name={slug} position={[0, 0, 0.09]}>
        <planeGeometry args={[screenWidth, screenHeight]} />
        <meshBasicMaterial color="#101b30" toneMapped={false} />
      </mesh>
      <MonitorSignal
        motion={motion}
        trim={trim}
        width={screenWidth}
        height={screenHeight}
        phase={rotate * 9}
      />
      {showCapture && (
        <Suspense fallback={null}>
          <MonitorCapture
            slug={slug}
            trim={trim}
            cue={cue}
            playhead={playhead}
            motion={motion}
            hovered={hovered}
          />
        </Suspense>
      )}
      <mesh ref={indicator} position={[0.89, -0.658, 0.094]}>
        <sphereGeometry args={[0.011, 8, 6]} />
        <meshBasicMaterial color={trim} toneMapped={false} />
      </mesh>
      <RoundedBox
        position={[0, -0.778, -0.145]}
        args={[0.114, 0.61, 0.169]}
        radius={0.022}
        smoothness={3}
        rotation={[-0.137, 0, 0]}
        castShadow
      >
        <meshStandardMaterial
          color="#6a707a"
          metalness={0.64}
          roughness={0.37}
        />
      </RoundedBox>
      <RoundedBox
        args={[0.74, 0.05, 0.48]}
        radius={0.019}
        smoothness={2}
        position={[0, -1.035, -0.09]}
        castShadow
      >
        <meshStandardMaterial
          color="#293850"
          metalness={0.56}
          roughness={0.4}
        />
      </RoundedBox>
    </group>
  );
}
