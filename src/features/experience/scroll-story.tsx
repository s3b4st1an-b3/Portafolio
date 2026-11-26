"use client";
import dynamic from "next/dynamic";
import {
  createContext,
  useContext,
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { EditorialFilm } from "./editorial-film";
import { createPlayhead, type Playhead } from "./playhead";
import { useScrollTimeline } from "./scroll-timeline";
import type { DeskExhibit } from "./studio-desk";
import type { ProjectSlug } from "@/types/portfolio";

const DeskGallery = dynamic(() =>
  import("./desk-gallery").then((module) => module.DeskGallery),
);
const Story = createContext<{
  playhead: Playhead;
  businessShot: number;
  setBusinessShot: (shot: number) => void;
  activateDesk: (slug: ProjectSlug, trigger?: HTMLElement) => void;
} | null>(null);
export function useStory() {
  const story = useContext(Story);
  if (!story) throw new Error("Missing scroll story");
  return story;
}
export function ScrollStory({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [playhead] = useState(createPlayhead);
  const [project, setProject] = useState<DeskExhibit | null>(null);
  const deskTrigger = useRef<HTMLElement | null>(null);
  useScrollTimeline(root, playhead);
  const [businessShot, setBusinessShot] = useState(3.17);
  const activateDesk = useCallback(
    (slug: ProjectSlug, trigger?: HTMLElement) => {
      const origin = trigger ?? document.activeElement;
      deskTrigger.current = origin instanceof HTMLElement ? origin : null;
      setProject({ slug });
    },
    [],
  );
  function closeDesk() {
    setProject(null);
    deskTrigger.current?.focus({ preventScroll: true });
    deskTrigger.current = null;
  }
  return (
    <Story.Provider
      value={{ playhead, activateDesk, businessShot, setBusinessShot }}
    >
      <div
        ref={root}
        className="scroll-story fusion-editorial"
        data-cinematic="false"
        data-chapter="inicio"
      >
        {children}
        <EditorialFilm root={root} />
        {project && <DeskGallery exhibit={project} onClose={closeDesk} />}
      </div>
    </Story.Provider>
  );
}
