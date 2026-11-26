import { ArrowDown, MoveUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { projects } from "@/data/projects";
import { RecyclingDemo } from "@/features/projects/recycling-demo";
import { Bookend } from "./bookend";
import { AboutExplorer } from "./about-explorer";
import { RecyclingSpotlight } from "./recycling-spotlight";
import {
  GalleryMonitorLinks,
  ProjectPreview,
  StoryNav,
} from "./story-controls";
import { SeymsoftPurchase } from "./seymsoft-purchase";
import { TechnologyGallery } from "./technology-gallery";
import { ScrollStory } from "./scroll-story";

const [seymsoft, recycling] = projects;

function TypedLine({ text, offset = 0 }: { text: string; offset?: number }) {
  let position = offset;
  return text.split(" ").map((word, index) => (
    <span key={index} className="hero-type-word">
      {index > 0 && <span className="hero-type-space"> </span>}
      {Array.from(word).map((letter, character) => (
        <span
          key={character}
          className="hero-type-char"
          style={{ "--character": position++ } as React.CSSProperties}
        >
          {letter}
        </span>
      ))}
    </span>
  ));
}

function Photo({
  subject,
  className,
}: {
  subject: "workspace" | "code";
  className: string;
}) {
  const workspace = subject === "workspace";
  return (
    <figure className={className} data-film={workspace ? "intro" : "portrait"}>
      <Image
        src={
          workspace
            ? "/images/editorial/workspace.webp"
            : "/images/editorial/code.webp"
        }
        alt={
          workspace
            ? "Portátil con código y un monitor en un espacio de trabajo"
            : "Detalle de código fuente en una pantalla"
        }
        width={1440}
        height={workspace ? 958 : 962}
        sizes={
          workspace
            ? "(max-width: 760px) 90vw, 34vw"
            : "(max-width: 760px) 90vw, 53vw"
        }
        loading={workspace ? "eager" : "lazy"}
      />
    </figure>
  );
}

function FilmCover({
  slug,
  image,
  alt,
}: {
  slug: string;
  image: string;
  alt: string;
}) {
  return (
    <figure
      data-film="projects"
      className={`fusion-cover fusion-cover-${slug}`}
    >
      <Image
        src={image}
        alt={alt}
        fill
        sizes="(max-width: 760px) 100vw, 60vw"
      />
    </figure>
  );
}

export function StoryChapters() {
  return (
    <ScrollStory>
      <a className="skip-link" href="#contenido-principal">
        Saltar al contenido
      </a>
      <StoryNav github={siteConfig.links.github} />
      <main id="contenido-principal" tabIndex={-1}>
        <section
          id="inicio"
          data-story-chapter
          className="story-hero"
          aria-labelledby="titulo-inicio"
          tabIndex={-1}
        >
          <Bookend kind="intro">
            <Image
              className="fusion-studio-poster"
              src="/images/editorial/robot-opening.webp"
              alt="Primer plano del robot del portafolio con visor negro y ojos cian"
              fill
              preload
              sizes="100vw"
            />
          </Bookend>
          <div className="story-shell cinema-panel cinema-intro">
            <div className="hero-heading">
              <p className="story-kicker">
                <span />
                {siteConfig.title}
              </p>
              <h1 id="titulo-inicio" aria-label={siteConfig.name}>
                <span className="hero-first-name" aria-hidden="true">
                  <TypedLine text="Sebastian" />
                </span>{" "}
                <em aria-hidden="true">
                  <TypedLine text="Bedoya Valencia." offset={11} />
                </em>
              </h1>
              <p className="hero-statement">
                Construyo software que transforma ideas en soluciones.
              </p>
              <p className="story-summary">
                Me gusta desarrollar herramientas digitales que ayudan a
                empresas y emprendedores a facilitar sus procesos y hacer crecer
                sus negocios.
              </p>
              <div className="story-actions">
                <a className="story-primary" href="#seymsoft">
                  Ver proyectos
                </a>
                <a className="story-secondary" href="#contacto">
                  Contacto
                </a>
              </div>
              <a className="fusion-scroll" href="#sobre-mi">
                <ArrowDown size={15} aria-hidden="true" /> Explorar mediante el
                scroll
              </a>
            </div>
          </div>
        </section>

        <section
          id="sobre-mi"
          data-story-chapter
          className="story-section story-about"
          aria-labelledby="titulo-sobre-mi"
          tabIndex={-1}
        >
          <div className="story-shell cinema-panel">
            <div className="story-copy cinema-copy">
              <p className="story-kicker">
                <span />
                Sobre mí
              </p>
              <h2 id="titulo-sobre-mi">
                Código para <em>problemas reales.</em>
              </h2>
              <p className="story-lead">
                Soy desarrollador Full Stack y practicante de Análisis y
                Desarrollo de Software (ADSO).
              </p>
              <p className="story-summary">
                Me interesa crear herramientas para el trabajo diario de
                empresas y emprendedores, y profundizar en{" "}
                <strong>bases de datos</strong> y{" "}
                <strong>pruebas de software</strong>.
              </p>
            </div>
            <div className="about-exhibit">
              <div className="fusion-about-frame">
                <Photo subject="workspace" className="fusion-about-photo" />
                <p className="fusion-cut-title" aria-hidden="true">
                  Diseñar.
                  <br />
                  Construir.
                </p>
              </div>
              <AboutExplorer />
            </div>
          </div>
        </section>

        <section
          id="tecnologias"
          data-story-chapter
          className="story-section story-tech"
          aria-labelledby="titulo-tecnologias"
          tabIndex={-1}
        >
          <div className="story-shell cinema-panel">
            <div className="story-copy cinema-copy">
              <p className="story-kicker">
                <span />
                Tecnologías
              </p>
              <h2 id="titulo-tecnologias">
                Mi caja de <em>herramientas.</em>
              </h2>
              <TechnologyGallery />
            </div>
          </div>
        </section>

        <section
          id="seymsoft"
          data-story-chapter
          className="story-section story-project"
          aria-labelledby="titulo-seymsoft"
          tabIndex={-1}
        >
          <span id="proyectos" className="story-project-anchor" />
          <div className="story-shell cinema-panel">
            <div className="story-copy cinema-copy">
              <p className="story-kicker">
                <span />
                Proyecto principal · ADSO
              </p>
              <h2 id="titulo-seymsoft">SeymSoft</h2>
              <p className="story-lead">{seymsoft.summary}</p>
              <p className="story-contribution">
                <strong>Mi aporte</strong> {seymsoft.role}
              </p>
              <div className="story-actions">
                <Link
                  className="story-primary"
                  href="/projects/seym-soft"
                  prefetch={false}
                >
                  Ver caso de estudio
                </Link>
                <a className="story-secondary" href={seymsoft.demo}>
                  Visitar tienda
                </a>
                <ProjectPreview slug="seym-soft" />
              </div>
              <SeymsoftPurchase repositories={seymsoft.repositories} />
            </div>
            <div className="fusion-business-cue" data-film-cue>
              <Bookend kind="business">
                <FilmCover
                  slug="seymsoft"
                  image="/images/projects/seymsoft/papeleria-magic-tienda.webp"
                  alt="Captura de la tienda de Papelería y Variedades Magic en SeymSoft"
                />
              </Bookend>
            </div>
          </div>
        </section>

        <section
          id="reciclaje"
          data-story-chapter
          className="story-section story-project story-recycling"
          aria-labelledby="titulo-reciclaje"
          tabIndex={-1}
        >
          <div className="story-shell cinema-panel">
            <div className="story-copy cinema-copy">
              <p className="story-kicker">
                <span />
                Proyecto · Python e IA
              </p>
              <h2 id="titulo-reciclaje">
                Clasificador de <em>Reciclaje</em>
              </h2>
              <p className="story-lead">{recycling.summary}</p>
              <p className="story-contribution">
                <strong>Mi aporte</strong> {recycling.role}
              </p>
              <div className="story-actions">
                <Link
                  className="story-primary"
                  href="/projects/reciclaje"
                  prefetch={false}
                >
                  Ver caso de estudio
                </Link>
                <a
                  className="story-secondary"
                  href={recycling.repositories[0].url}
                >
                  Repositorio
                </a>
                {recycling.demoAvailable !== false && recycling.demo && (
                  <a className="story-secondary" href={recycling.demo}>
                    Abrir aplicación
                  </a>
                )}
                <ProjectPreview slug="reciclaje" />
                <a className="story-secondary" href="#demo-reciclaje">
                  Probar con una imagen
                </a>
              </div>
            </div>
            <RecyclingSpotlight>
              <FilmCover
                slug="recycling"
                image="/images/projects/reciclaje/clasificador-pantalla-inicial.webp"
                alt="Captura real de la interfaz del Clasificador de Reciclaje"
              />
            </RecyclingSpotlight>
          </div>
          <RecyclingDemo className="story-shell" />
        </section>

        <section
          id="contacto"
          data-story-chapter
          className="story-section story-contact"
          aria-labelledby="titulo-contacto"
          tabIndex={-1}
        >
          <div className="story-shell cinema-panel fusion-close">
            <div className="story-copy cinema-copy">
              <p className="story-kicker">
                <span />
                Contacto
              </p>
              <h2 id="titulo-contacto">
                Hablemos de <em>tu proyecto.</em>
              </h2>
              <p className="story-lead">
                Puedes conocer mi código y mis proyectos en GitHub.
              </p>
              <div className="story-actions">
                <a className="story-primary" href={siteConfig.links.github}>
                  Ver perfil en GitHub
                </a>
              </div>
            </div>
            <div className="fusion-exhibit">
              <Bookend kind="gallery" overlay={<GalleryMonitorLinks />}>
                <Image
                  className="fusion-studio-poster"
                  src="/images/editorial/studio-gallery.webp"
                  alt="Los monitores del escritorio muestran SeymSoft y el Clasificador de Reciclaje"
                  fill
                  loading="eager"
                  sizes="(max-width: 850px) 90vw, 55vw"
                />
              </Bookend>
            </div>
          </div>
        </section>
      </main>
      <footer className="story-footer">
        <div className="story-shell">
          <p>{siteConfig.name}</p>
          <a href="#inicio">
            Volver al inicio <MoveUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </footer>
    </ScrollStory>
  );
}
