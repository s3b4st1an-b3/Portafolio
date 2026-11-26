"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Menu, MoveUpRight, X } from "lucide-react";
import type { ProjectSlug } from "@/types/portfolio";
import { scenes } from "./scenes";
import { useStory } from "./scroll-story";

export function StoryNav({ github }: { github: string }) {
  const [open, setOpen] = useState(false);
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    if (!hero || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) =>
        setFloating(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { rootMargin: "-74px 0px 0px" },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <header className="story-header" data-floating={floating}>
      <div className="story-nav-inner">
        <a
          href="#inicio"
          className="story-brand"
          aria-label="Sebastian Bedoya Valencia · Inicio"
        >
          <span className="story-brand-mark" aria-hidden="true">
            <span>SB</span>
            <i />
          </span>
        </a>
        <nav
          className="story-nav"
          aria-label="Secciones"
          data-open={open}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false);
              event.currentTarget.querySelector("button")?.focus();
            }
          }}
        >
          <button
            className="story-menu"
            aria-controls="story-navigation"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <X size={17} aria-hidden="true" />
            ) : (
              <Menu size={17} aria-hidden="true" />
            )}{" "}
            Menú
          </button>
          <ul id="story-navigation">
            {scenes.map(({ id, label }, index) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  data-chapter-link
                  aria-current={index === 0 ? "location" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
            <li className="story-mobile-repo">
              <a href={github}>GitHub</a>
            </li>
          </ul>
        </nav>
        <div className="story-nav-actions">
          <a className="story-header-github" href={github}>
            GitHub
          </a>
        </div>
        <div className="story-reading-progress" aria-hidden="true" />
      </div>
    </header>
  );
}

export function ProjectPreview({
  slug,
  label = "Ver captura",
}: {
  slug: ProjectSlug;
  label?: string;
}) {
  const { activateDesk } = useStory();
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      className="story-secondary"
      onClick={(event) => activateDesk(slug, event.currentTarget)}
    >
      <ImageIcon size={15} aria-hidden="true" />
      {label}
    </button>
  );
}

const monitorLinks = [
  { slug: "seym-soft", title: "SeymSoft" },
  { slug: "reciclaje", title: "Clasificador de Reciclaje" },
] as const;

export function GalleryMonitorLinks() {
  const { activateDesk } = useStory();
  return (
    <ul
      className="fusion-exhibit-links"
      aria-label="Casos de estudio en los monitores"
    >
      {monitorLinks.map(({ slug, title }) => (
        <li key={slug}>
          <button
            type="button"
            data-monitor={slug}
            aria-haspopup="dialog"
            onClick={(event) => activateDesk(slug, event.currentTarget)}
          >
            <span>
              <strong>{title}</strong>
              <span>Abrir caso</span>
            </span>
            <MoveUpRight size={16} aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}
