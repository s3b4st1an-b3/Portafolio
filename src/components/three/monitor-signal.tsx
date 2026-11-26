import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, Vector2, type Mesh, type ShaderMaterial } from "three";
import type { StudioMotion } from "@/features/experience/studio-motion";

const vertexShader = `
  varying vec2 monitorUv;
  void main() {
    monitorUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 monitorUv;
  uniform vec3 accent;
  uniform vec2 pointer;
  uniform float interaction;
  uniform float phase;

  void main() {
    vec2 uv = monitorUv;
    vec2 grid = abs(fract(uv * vec2(19., 12.) - .5) - .5);
    float gridLine = 1. - smoothstep(.015, .045, min(grid.x, grid.y));
    float x = uv.x;
    float p = x - (.49 + pointer.x * .28);
    float pulse = exp(-p * p * 58.) * interaction;
    float wave = .49 + .075 * sin(x * 22. + phase) +
      .042 * sin(x * 41. - phase) + pulse * (.09 + pointer.y * .13);
    float lineWidth = max(fwidth(uv.y), .001);
    float trace = 1. - smoothstep(lineWidth, lineWidth * 3.3, abs(uv.y - wave));
    float frame = smoothstep(.075,.092,x) * (1.-smoothstep(.905,.925,x));
    float header = (1.-smoothstep(.003,.011,abs(uv.y-.83))) * frame;
    float footer = (1.-smoothstep(.004,.012,abs(uv.y-.20))) *
      step(.092,x) * (1.-step(.46,x)) * step(.3,fract(x*31.));
    float bloom = exp(-abs(uv.y - wave) * 24.);
    vec2 spot = uv - vec2(.5 + pointer.x * .32, .59 + pointer.y * .16);
    float soft = exp(-dot(spot,spot) * 10.) * interaction;
    vec3 pixel = vec3(.010,.020,.026)
      + accent * ((.035 + .035 * soft) * gridLine + .13 * header + .18 * footer)
      + accent * frame * (trace * (.56 + .30 * pulse) + bloom * (.055 + .18 * pulse))
      + accent * soft * .032;
    gl_FragColor = vec4(pixel,1.);
    #include <colorspace_fragment>
  }
`;

export function MonitorSignal({
  motion,
  trim,
  width,
  height,
  phase,
}: {
  motion: StudioMotion;
  trim: string;
  width: number;
  height: number;
  phase: number;
}) {
  const mesh = useRef<Mesh>(null);
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      accent: { value: new Color(trim) },
      pointer: { value: new Vector2() },
      interaction: { value: 0 },
      phase: { value: phase },
    }),
    [trim, phase],
  );
  useFrame(() => {
    if (!mesh.current || !material.current) return;
    const time = motion.playhead.read();
    mesh.current.visible = time < 5.28;
    if (!mesh.current.visible) return;
    const current = material.current.uniforms;
    current.pointer.value.copy(motion.aim);
    current.interaction.value = motion.presence.current;
    current.phase.value = phase + time * 2.8 + motion.aim.x * 1.9;
  });
  return (
    <mesh ref={mesh} position={[0, 0, 0.095]}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        toneMapped={false}
      />
    </mesh>
  );
}
