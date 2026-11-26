import { useEffect, useMemo } from "react";
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

function floorTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const image = context.createImageData(128, 128);
  let seed = 1699;
  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 128; x++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const edge = Math.min(x, y, 127 - x, 127 - y);
      const shade =
        (seed >>> 30) +
        Math.sin(x * 0.11 + y * 0.016) * 1.7 -
        (edge < 1 ? 10 : 0);
      const index = (y * 128 + x) * 4;
      image.data[index] = 46 + shade;
      image.data[index + 1] = 51 + shade;
      image.data[index + 2] = 56 + shade;
      image.data[index + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(38, 36);
  return texture;
}

export function StudioFloor() {
  const texture = useMemo(() => floorTexture(), []);
  useEffect(() => () => texture?.dispose(), [texture]);
  return (
    <mesh position={[11, -0.32, -8]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[105, 100]} />
      <meshStandardMaterial
        color={texture ? "#ffffff" : "#30353b"}
        map={texture}
        roughness={0.77}
        metalness={0.14}
      />
    </mesh>
  );
}
