"use client";
import dynamic from "next/dynamic";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { supportsWebGL, useProfile } from "./profile";

import { createPlayhead } from "./playhead";
import { useStory } from "./scroll-story";
import type { DeskTarget } from "./studio-desk";
const Scene = dynamic(() => import("./world"), {
  ssr: false,
});
const RobotOpening = dynamic(() => import("@/components/three/robot-opening"), {
  ssr: false,
});
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function Bookend({
  kind,
  children,
  overlay,
}: {
  kind: "intro" | "gallery" | "business";
  children: ReactNode;
  overlay?: ReactNode;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const { reduced, compact } = useProfile();
  const { activateDesk, businessShot, playhead: chapterProgress } = useStory();
  const chapter = useSyncExternalStore(
    chapterProgress.subscribe,
    () => Math.min(5, Math.floor(chapterProgress.read())),
    () => 0,
  );
  const sceneChapter = kind === "intro" ? 0 : kind === "business" ? 3 : 5;
  const time = kind === "business" ? businessShot : 6;
  const [playhead] = useState(() => createPlayhead(time));
  const [lamp, setLamp] = useState(true);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const onActivateDesk = useCallback(
    (target: DeskTarget) => {
      if (target === "lamp") setLamp((value) => !value);
      else activateDesk(target === "phone" ? "seym-soft" : target);
    },
    [activateDesk],
  );
  const onReady = useCallback(() => setReady(true), []);
  const onLost = useCallback(() => setFailed(true), []);
  useEffect(() => {
    playhead.write(time);
  }, [playhead, time]);

  useEffect(() => {
    const element = frame.current;
    if (!element || reduced || !("IntersectionObserver" in window)) return;
    let available: boolean | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) available ??= supportsWebGL();
        const inView =
          kind === "business"
            ? entry.intersectionRatio >= 0.12
            : entry.isIntersecting;
        setVisible(inView && available === true);
        if (!inView) setReady(false);
      },
      { threshold: kind === "business" ? 0.12 : 0.05 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [kind, reduced]);
  const atScene =
    chapter === sceneChapter ||
    (kind === "business" && chapter === sceneChapter - 1);
  const active = !reduced && visible && atScene && !failed;
  return (
    <div
      ref={frame}
      className={`fusion-bookend fusion-bookend-${kind}`}
      data-live={Boolean(active && ready)}
    >
      <div className="fusion-poster">{children}</div>
      {active && (
        <div className="fusion-render" aria-hidden="true">
          <SceneBoundary>
            {kind === "intro" ? (
              <RobotOpening
                viewport={frame}
                compact={compact}
                onReady={onReady}
                onLost={onLost}
              />
            ) : (
              <Scene
                playhead={playhead}
                business={kind === "business"}
                viewport={frame}
                lamp={lamp}
                onActivateDesk={onActivateDesk}
                compact={compact}
                onReady={onReady}
                onLost={onLost}
              />
            )}
          </SceneBoundary>
        </div>
      )}
      {overlay}
    </div>
  );
}
