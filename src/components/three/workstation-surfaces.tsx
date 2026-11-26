import { RoundedBox } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";

function walnutTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const pixels = context.createImageData(canvas.width, canvas.height);
  let seed = 47623;
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const u = x / canvas.width;
      const v = y / canvas.height;
      const grain =
        v + 0.025 * Math.sin(9 * u + 5 * v) + 0.015 * Math.sin(16 * u - 11 * v);
      const fine = Math.sin(945 * grain) * 1.7 + Math.sin(581 * grain) * 2.1;
      const dark = 6 * Math.pow(0.5 + Math.sin(185 * grain) * 0.5, 7);
      const shade =
        Math.sin(grain * 133) * 3.6 + fine - dark + (seed >>> 29) - 3.5;
      const i = (y * canvas.width + x) * 4;
      pixels.data[i] = 81 + shade * 1.55;
      pixels.data[i + 1] = 63 + shade * 1.24;
      pixels.data[i + 2] = 54 + shade;
      pixels.data[i + 3] = 255;
    }
  }
  context.putImageData(pixels, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

const shadowShader = `
  varying vec2 coords;
  uniform float density;

  void main() {
    vec2 distanceToCenter = (coords - 0.5) * 2.0;
    float radius = dot(distanceToCenter, distanceToCenter);
    float alpha = exp(-3.8 * radius) * (1.0 - smoothstep(0.58, 1.0, radius));
    gl_FragColor = vec4(0.016, 0.014, 0.019, alpha * density);
    #include <colorspace_fragment>
  }
`;

const shadowVertex = `
  varying vec2 coords;
  void main() {
    coords = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function ContactShade({
  position,
  size,
  density,
}: {
  position: [number, number, number];
  size: [number, number];
  density: number;
}) {
  const uniforms = useMemo(() => ({ density: { value: density } }), [density]);
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={size} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={shadowVertex}
        fragmentShader={shadowShader}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

export function WorkstationSurfaces() {
  const grain = useMemo(() => walnutTexture(), []);
  useEffect(() => () => grain?.dispose(), [grain]);

  return (
    <>
      <RoundedBox
        args={[5.77, 0.183, 2.74]}
        radius={0.058}
        smoothness={3}
        position={[0, 1.48, -0.72]}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial
          color={grain ? "#ffffff" : "#56413a"}
          map={grain}
          roughness={0.51}
          metalness={0.04}
        />
      </RoundedBox>
      <RoundedBox
        args={[2.46, 0.025, 0.87]}
        radius={0.011}
        smoothness={2}
        position={[0.25, 1.579, 0.13]}
        receiveShadow
      >
        <meshStandardMaterial color="#22252a" roughness={0.92} />
      </RoundedBox>
      <ContactShade
        position={[0.14, 0.006, -0.49]}
        size={[8.1, 5.7]}
        density={0.7}
      />
      <ContactShade
        position={[-1.11, 1.573, -1.73]}
        size={[1.55, 1.12]}
        density={0.75}
      />
      <ContactShade
        position={[1.11, 1.574, -1.75]}
        size={[1.55, 1.12]}
        density={0.75}
      />
    </>
  );
}
