"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState, type RefObject } from "react";
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  MathUtils,
  PerspectiveCamera,
  Vector2,
  Vector3,
  type Group,
  type PointLight,
  type Sprite,
  type SpriteMaterial,
} from "three";
import { RobotAssembly } from "./robot-assembly";

const entranceSeconds = 2.45;
const trailCount = 22;
const colors = [
  "#37e1fa",
  "#67fc79",
  "#ffda43",
  "#ff785a",
  "#f04bcc",
  "#9b79ff",
].map((color) => new Color(color));

function glowTexture() {
  const image = document.createElement("canvas");
  image.width = image.height = 64;
  const ctx = image.getContext("2d");
  if (ctx) {
    const glow = ctx.createRadialGradient(32, 32, 1, 32, 32, 32);
    glow.addColorStop(0, "rgba(255,255,255,0.88)");
    glow.addColorStop(0.3, "rgba(255,255,255,0.53)");
    glow.addColorStop(0.65, "rgba(255,255,255,0.14)");
    glow.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 64, 64);
  }
  return new CanvasTexture(image);
}

function RobotScene({
  viewport,
  onLost,
}: {
  viewport: RefObject<HTMLDivElement | null>;
  onLost: () => void;
}) {
  const head = useRef<Group>(null);
  const left = useRef<Group>(null);
  const right = useRef<Group>(null);
  const accentLight = useRef<PointLight>(null);
  const entranceStarted = useRef<number | null>(null);
  const strength = useRef(0);
  const pointer = useRef({ point: new Vector2(), active: false });
  const aim = useRef(new Vector2());
  const cameraTarget = useRef(new Vector3());
  const projected = useRef(new Vector3());
  const lastTrailPoint = useRef(new Vector2(Infinity, Infinity));
  const trailIndex = useRef(0);
  const palette = useRef({ position: new Vector2(), phase: 0 });
  const trail = useRef<(Sprite | null)[]>([]);
  const life = useRef(new Float32Array(trailCount));
  const tint = useRef(new Color());
  const [texture] = useState(glowTexture);
  const { invalidate, gl } = useThree();

  useEffect(() => () => texture.dispose(), [texture]);

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const canvas = gl.domElement;

    const move = (event: PointerEvent) => {
      if (
        event.pointerType === "touch" &&
        event.type === "pointermove" &&
        !pointer.current.active
      )
        return;
      const bounds = element.getBoundingClientRect();
      pointer.current.point.set(
        MathUtils.clamp(
          ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
          -1,
          1,
        ),
        MathUtils.clamp(
          1 - ((event.clientY - bounds.top) / bounds.height) * 2,
          -1,
          1,
        ),
      );
      pointer.current.active = true;
      invalidate();
    };
    const release = () => {
      pointer.current.active = false;
      pointer.current.point.set(0, 0);
      invalidate();
    };
    const endTouch = (event: PointerEvent) => {
      if (event.pointerType === "touch") release();
    };

    element.addEventListener("pointermove", move, { passive: true });
    element.addEventListener("pointerdown", move, { passive: true });
    element.addEventListener("pointerleave", release);
    window.addEventListener("pointerup", endTouch, { passive: true });
    window.addEventListener("pointercancel", release);
    window.addEventListener("blur", release);
    canvas.addEventListener("webglcontextlost", onLost);
    return () => {
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerdown", move);
      element.removeEventListener("pointerleave", release);
      window.removeEventListener("pointerup", endTouch);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("blur", release);
      canvas.removeEventListener("webglcontextlost", onLost);
    };
  }, [gl, invalidate, onLost, viewport]);

  useFrame(({ camera, size }, delta) => {
    if (!(camera instanceof PerspectiveCamera) || !size.width || !size.height)
      return;
    const step = Math.min(delta, 0.05);
    const now = performance.now();
    entranceStarted.current ??= now;
    const time = Math.min(
      entranceSeconds,
      (now - entranceStarted.current) / 1000,
    );
    const pullback = MathUtils.smootherstep(time, 0.24, 2.27);
    const gesture =
      MathUtils.smoothstep(time, 0.5, 1.48) *
      (1 - 0.73 * MathUtils.smoothstep(time, 1.76, entranceSeconds));
    const { active, point } = pointer.current;
    const targetStrength = Number(active);
    strength.current = MathUtils.damp(
      strength.current,
      targetStrength,
      7,
      step,
    );
    aim.current.lerp(point, 1 - Math.exp(-9 * step));
    const { x, y } = aim.current;
    const narrow = size.width <= 760;
    const lateral = narrow ? 0 : 0.45 * pullback;

    camera.position.set(
      MathUtils.lerp(0.04, 0.72, pullback),
      MathUtils.lerp(3.22, 2.56, pullback),
      MathUtils.lerp(narrow ? 2.75 : 2.35, narrow ? 6.1 : 5.65, pullback),
    );
    cameraTarget.current.set(0, MathUtils.lerp(3.19, 1.99, pullback), 0);
    const offsetX = -size.width * lateral * 0.5;
    const offsetY = narrow
      ? size.height * 0.235
      : -size.height * 0.07 * pullback;
    if (
      camera.view?.width !== size.width ||
      camera.view.height !== size.height ||
      camera.view.offsetX !== offsetX ||
      camera.view.offsetY !== offsetY
    ) {
      camera.setViewOffset(
        size.width,
        size.height,
        offsetX,
        offsetY,
        size.width,
        size.height,
      );
    }
    camera.lookAt(cameraTarget.current);
    camera.updateMatrixWorld();

    if (head.current) {
      const lookX = MathUtils.clamp(x - lateral * strength.current, -1, 1);
      head.current.rotation.y = -0.12 * pullback + lookX * 0.45;
      head.current.rotation.x = -y * 0.24;
      head.current.rotation.z = -x * 0.055;
    }
    if (left.current)
      left.current.rotation.set(-gesture * 0.58, -0.1, -0.12 - gesture * 0.66);
    if (right.current)
      right.current.rotation.set(-gesture * 0.63, 0.1, 0.12 + gesture * 0.71);

    const sweep = palette.current;
    if (active) {
      sweep.phase =
        (sweep.phase + sweep.position.distanceTo(aim.current) * 2.1) %
        colors.length;
    }
    sweep.position.copy(aim.current);
    const colorIndex = Math.floor(sweep.phase);
    tint.current.lerpColors(
      colors[colorIndex],
      colors[(colorIndex + 1) % colors.length],
      sweep.phase - colorIndex,
    );
    if (accentLight.current) {
      accentLight.current.position.set(
        (x - lateral) * 3.5,
        2.35 + y * 1.85,
        1.5,
      );
      accentLight.current.color.copy(tint.current);
      accentLight.current.intensity = strength.current * 22;
    }

    if (!active) lastTrailPoint.current.set(Infinity, Infinity);
    if (
      active &&
      lastTrailPoint.current.distanceToSquared(aim.current) > 0.005
    ) {
      const index = trailIndex.current;
      const sprite = trail.current[index];
      if (sprite) {
        projected.current.set(x, y, 0.4).unproject(camera).sub(camera.position);
        const factor = (-1.1 - camera.position.z) / projected.current.z;
        sprite.position
          .copy(camera.position)
          .addScaledVector(projected.current, factor);
        (sprite.material as SpriteMaterial).color.copy(tint.current);
        life.current[index] = 1;
      }
      trailIndex.current = (index + 1) % trailCount;
      lastTrailPoint.current.copy(aim.current);
    }

    let glowing = false;
    trail.current.forEach((sprite, index) => {
      if (!sprite) return;
      life.current[index] = Math.max(0, life.current[index] - step * 0.9);
      const level = life.current[index];
      sprite.visible = level > 0;
      if (level === 0) return;
      glowing = true;
      sprite.scale.set(1.6 + (1 - level) * 1.5, 1.25 + (1 - level) * 0.95, 1);
      (sprite.material as SpriteMaterial).opacity = level * level * 0.73;
    });

    if (
      time < entranceSeconds ||
      aim.current.distanceToSquared(point) > 0.00008 ||
      Math.abs(targetStrength - strength.current) > 0.008 ||
      glowing
    )
      invalidate();
  });

  return (
    <>
      <Environment frames={1} resolution={64}>
        <Lightformer
          form="rect"
          position={[-3, 4, 4]}
          scale={[3, 5, 1]}
          intensity={4.1}
          color="#92d9f6"
        />
        <Lightformer
          form="rect"
          position={[3, 3.1, 2]}
          rotation={[0, -0.6, 0]}
          scale={[2, 6, 1]}
          intensity={3.6}
          color="#a68ce9"
        />
        <Lightformer
          form="rect"
          position={[0, 5, -2]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[5, 2, 1]}
          intensity={2.1}
          color="#e3a378"
        />
      </Environment>
      <hemisphereLight args={["#c6dce9", "#1c2940", 1.05]} />
      <directionalLight
        position={[-2, 4, 3.6]}
        color="#a4dcff"
        intensity={2.1}
      />
      <directionalLight
        position={[2, 3, -2.8]}
        color="#aa85f4"
        intensity={2.7}
      />
      <pointLight ref={accentLight} intensity={0} distance={4.7} decay={2} />
      <RobotAssembly head={head} left={left} right={right} />
      {Array.from({ length: trailCount }, (_, index) => (
        <sprite
          key={index}
          ref={(sprite) => {
            trail.current[index] = sprite;
          }}
          visible={false}
        >
          <spriteMaterial
            map={texture}
            transparent
            opacity={0}
            depthWrite={false}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </sprite>
      ))}
    </>
  );
}

export default function RobotOpening({
  viewport,
  compact,
  onReady,
  onLost,
}: {
  viewport: RefObject<HTMLDivElement | null>;
  compact: boolean;
  onReady: () => void;
  onLost: () => void;
}) {
  return (
    <Canvas
      dpr={compact ? [1, 1.15] : [1, 1.4]}
      camera={{
        position: [0.04, 3.22, 2.45],
        fov: compact ? 40 : 37,
        near: 0.1,
        far: 24,
      }}
      frameloop="demand"
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      onCreated={onReady}
      fallback={null}
    >
      <RobotScene viewport={viewport} onLost={onLost} />
    </Canvas>
  );
}
