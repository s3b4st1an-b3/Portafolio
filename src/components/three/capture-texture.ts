import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useCallback } from "react";
import { SRGBColorSpace, type Texture } from "three";

export function useCaptureTexture(file: string) {
  const anisotropy = useThree(({ gl }) =>
    Math.min(8, gl.capabilities.getMaxAnisotropy()),
  );

  const configure = useCallback(
    (texture: Texture) => {
      if (
        texture.colorSpace === SRGBColorSpace &&
        texture.anisotropy === anisotropy
      )
        return;
      texture.colorSpace = SRGBColorSpace;
      texture.anisotropy = anisotropy;
      texture.needsUpdate = true;
    },
    [anisotropy],
  );

  return useTexture(file, configure);
}
