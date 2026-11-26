"use client";

import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { architectureStages, seymsoftData } from "@/data/project-architecture";
import { captures } from "@/data/project-images";
import { getProject } from "@/data/projects";
import type { DeskExhibit } from "./studio-desk";

export function DeskGallery({
  exhibit,
  onClose,
}: {
  exhibit: DeskExhibit;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const { slug } = exhibit;
  const project = getProject(slug);
  const capture = captures[slug];
  const stages = architectureStages[slug];
  const [view, setView] = useState(
    exhibit.mobileModule ? "architecture" : "capture",
  );
  const [activeStage, setActiveStage] = useState(
    exhibit.mobileModule ? "mobile" : stages[0].id,
  );
  const stage = stages.find(({ id }) => id === activeStage) ?? stages[0];
  const repository =
    stage.repository === undefined
      ? undefined
      : project?.repositories[stage.repository];

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  if (!project) return null;

  return (
    <dialog
      ref={ref}
      className="desk-gallery"
      aria-labelledby="desk-gallery-title"
      onClose={(event) => {
        if (!event.currentTarget.open) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      <article>
        <header className="desk-gallery-header">
          <div>
            <p className="story-kicker">Proyecto</p>
            <h3 id="desk-gallery-title">{project.name}</h3>
          </div>
          <button
            type="button"
            autoFocus
            aria-label="Cerrar ficha del proyecto"
            onClick={() => ref.current?.close()}
          >
            <X size={22} aria-hidden="true" />
          </button>
        </header>
        <div
          className="desk-gallery-views"
          role="group"
          aria-label="Contenido del proyecto"
        >
          <button
            type="button"
            aria-pressed={view === "capture"}
            onClick={() => setView("capture")}
          >
            Captura
          </button>
          <button
            type="button"
            aria-pressed={view === "architecture"}
            onClick={() => setView("architecture")}
          >
            Arquitectura
          </button>
        </div>
        {view === "capture" ? (
          <figure>
            <Image
              src={capture.file}
              alt={capture.alt}
              width={1440}
              height={900}
              sizes="(max-width: 760px) 90vw, 960px"
              loading="eager"
            />
            <figcaption>{capture.caption}</figcaption>
          </figure>
        ) : (
          <div className="desk-architecture" data-project={slug}>
            <ul aria-label="Componentes de la arquitectura">
              {stages.map(({ id, name }) => (
                <li key={id}>
                  <button
                    type="button"
                    aria-pressed={stage.id === id}
                    onClick={() => setActiveStage(id)}
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
            <div className="desk-architecture-detail">
              <div aria-live="polite">
                <h4>{stage.name}</h4>
                <p>{stage.description}</p>
                {slug === "seym-soft" && stage.id === "data" && (
                  <dl>
                    {seymsoftData.map(({ name, detail }) => (
                      <div key={name}>
                        <dt>{name}</dt>
                        <dd>{detail}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
              {repository && <a href={repository.url}>Ver código en GitHub</a>}
            </div>
          </div>
        )}
        <div className="fusion-project-facts">
          <section>
            <h4>Contexto y aporte</h4>
            <p>{project.context}</p>
            <p>{project.role}</p>
          </section>
          <section>
            <h4>Problema y solución</h4>
            <p>{project.problem}</p>
            <p>{project.solution}</p>
          </section>
          <section>
            <h4>Tecnologías</h4>
            <p>{project.technologies.join(" · ")}</p>
            <h4>Funcionalidades</h4>
            <ul>
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>
          <section>
            <h4>Reto técnico y aprendizaje</h4>
            <p>{project.challenge}</p>
            <p>{project.takeaway}</p>
            <h4>Repositorios</h4>
            <ul>
              {project.repositories.map((repo) => (
                <li key={repo.url}>
                  <a href={repo.url}>{repo.label}</a>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div className="desk-gallery-footer">
          <p>{project.summary}</p>
          <Link className="story-primary" href={`/projects/${slug}`}>
            Ver caso de estudio
          </Link>
        </div>
      </article>
    </dialog>
  );
}
