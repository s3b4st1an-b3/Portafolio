import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { CatmullRomCurve3, MathUtils, PerspectiveCamera, Vector3 } from "three";
import { cameraCurveParameter, shotAt, shots } from "./camera-shots";
import type { Playhead } from "./playhead";
import type { StudioMotion } from "./studio-motion";

const positionPath = new CatmullRomCurve3(
  shots.map(({ position }) => new Vector3(...position)),
);
const targetPath = new CatmullRomCurve3(
  shots.map(({ target }) => new Vector3(...target)),
);

export function Camera({
  playhead,
  compact,
  aim,
}: {
  playhead: Playhead;
  compact: boolean;
  aim: StudioMotion["aim"];
}) {
  const target = useRef(new Vector3());
  const right = useRef(new Vector3());

  useFrame(({ camera, size }) => {
    if (!(camera instanceof PerspectiveCamera)) return;
    const progress = playhead.read();
    const index = shotAt(progress);
    const shot = shots[index];
    const next = shots[index + 1] ?? shot;
    const local =
      next === shot ? 0 : (progress - shot.at) / (next.at - shot.at);
    const t = cameraCurveParameter(index, local);
    positionPath.getPoint(t, camera.position);
    targetPath.getPoint(t, target.current);
    const aspect = size.width / Math.max(1, size.height);
    const distance =
      1 + Math.max(0, 0.95 - aspect) * 0.66 + (compact ? 0.065 : 0);
    camera.position
      .sub(target.current)
      .multiplyScalar(distance)
      .add(target.current);
    const response = progress < 1.93 || progress >= 5.43 ? 1 : 0.57;
    right.current.subVectors(camera.position, target.current);
    right.current.set(right.current.z, 0, -right.current.x).normalize();
    camera.position.addScaledVector(right.current, aim.x * 0.195 * response);
    camera.position.y += aim.y * 0.14 * response;
    target.current.addScaledVector(right.current, aim.x * 0.065 * response);
    target.current.y += aim.y * 0.045 * response;
    const lens =
      MathUtils.lerp(shot.fov, next.fov, MathUtils.smoothstep(local, 0, 1)) +
      (compact ? 4 : 0);
    if (camera.fov !== lens) {
      camera.fov = lens;
      camera.updateProjectionMatrix();
    }
    camera.lookAt(target.current);
  }, -2);
  return null;
}
