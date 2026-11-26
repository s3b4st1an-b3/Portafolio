import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GitBranch } from "lucide-react";
import { getProject, projects } from "@/data/projects";
import { ProjectCapture } from "@/features/projects/project-capture";
import { RecyclingDemo } from "@/features/projects/recycling-demo";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  return project
    ? { title: project.name, description: project.summary }
    : { title: "Proyecto no encontrado" };
}

export default async function ProjectPage(
  props: PageProps<"/projects/[slug]">,
) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main
      id="contenido-principal"
      tabIndex={-1}
      className={`case-study ${project.accent}`}
    >
      <header className="case-hero section-shell">
        <div className="case-intro">
          <Link
            className="back-link"
            href={project.slug === "seym-soft" ? "/#seymsoft" : "/#reciclaje"}
          >
            Volver a proyectos
          </Link>
          <p className="eyebrow">{project.eyebrow}</p>
          <h1>{project.name}</h1>
          <p className="case-summary">{project.summary}</p>
          <p className="case-summary">{project.role}</p>
          <a className="text-link mt-5 inline-block" href={project.demo}>
            {project.slug === "seym-soft"
              ? "Visitar el sitio de SeymSoft"
              : project.demoAvailable === false
                ? "Demo · disponibilidad por confirmar"
                : "Abrir la aplicación"}
          </a>
          {project.slug === "reciclaje" && (
            <a
              className="text-link mt-5 ml-4 inline-block"
              href="#demo-reciclaje"
            >
              Probar con una imagen
            </a>
          )}
        </div>
        <ProjectCapture slug={project.slug} className="case-capture" />
      </header>

      <div className="case-content section-shell">
        {project.slug === "reciclaje" && <RecyclingDemo />}
        <section className="case-block case-lead">
          <p className="eyebrow">Contexto</p>
          <h2>{project.context}</h2>
        </section>
        <section className="case-pair">
          <div className="case-block">
            <p className="eyebrow">Problema abordado</p>
            <h2>El punto de partida</h2>
            <p>{project.problem}</p>
          </div>
          <div className="case-block">
            <p className="eyebrow">Solución</p>
            <h2>La respuesta técnica</h2>
            <p>{project.solution}</p>
          </div>
        </section>
        <section className="architecture-block">
          <div>
            <p className="eyebrow">Arquitectura</p>
            <h2>Un flujo legible de principio a fin.</h2>
          </div>
          <ol>
            {project.architecture.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ol>
        </section>
        <section className="case-stack case-block">
          <p className="eyebrow">Tecnologías y componentes</p>
          <div>
            {project.technologies.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
        </section>
        <section className="case-block">
          <h2>
            {project.slug === "seym-soft"
              ? "Alcance documentado"
              : "Funcionalidades"}
          </h2>
          <ul className="mt-5 grid gap-2 text-[var(--muted)] sm:grid-cols-2">
            {project.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>
        {project.challenge && (
          <section className="case-block">
            <h2>Reto técnico</h2>
            <p>{project.challenge}</p>
          </section>
        )}
        <section className="case-block">
          <h2>Aprendizajes del caso</h2>
          <p>{project.takeaway}</p>
        </section>
        <section className="repositories-block">
          <div>
            <p className="eyebrow">Repositorios</p>
            <h2>Explorar el código.</h2>
          </div>
          <div className="repository-list">
            {project.repositories.map((repository) => (
              <Link
                key={repository.url}
                href={repository.codeUrl ?? repository.url}
                target="_blank"
                rel="noreferrer"
              >
                <GitBranch aria-hidden="true" />
                <span>{repository.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
