"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import { technologies } from "@/data/technologies";
import { technologyExhibits } from "@/data/technology-exhibits";

const rails = [
  { id: "slider-web", label: "Frontend y Backend", groups: [0, 1], speed: 162 },
  {
    id: "slider-datos-movil",
    label: "Bases de datos y móvil",
    groups: [2, 3],
    speed: -132,
  },
  {
    id: "slider-herramientas",
    label: "Herramientas de desarrollo e IA",
    groups: [4, 5],
    speed: 162,
  },
].map(({ groups, ...rail }) => ({
  ...rail,
  slides: groups.flatMap((index) => {
    const group = technologies[index];
    return group.tools.map((title) => ({
      title,
      category: group.name,
      ...technologyExhibits[title],
    }));
  }),
}));

type Tool = (typeof rails)[number]["slides"][number];
function loopPosition(left: number, length: number) {
  return length + (((left % length) + length) % length);
}

function ToolSlider({
  id,
  label,
  slides,
  active,
  onSelect,
  speed,
}: {
  id: string;
  label: string;
  slides: readonly Tool[];
  active: Tool;
  onSelect: (tool: Tool) => void;
  speed: number;
}) {
  const carousel = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const cycleLength = useRef(0);
  const manualUntil = useRef(0);
  const [playing, setPlaying] = useState(true);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      if (cycleLength.current) return;
      setAtStart(element.scrollLeft <= 2);
      setAtEnd(
        element.scrollLeft + element.clientWidth >= element.scrollWidth - 2,
      );
    };
    const measure = () => {
      const first = element.firstElementChild;
      const middle = element.querySelector<HTMLElement>("[data-original]");
      const previous = cycleLength.current;
      const length =
        !motion.matches && first instanceof HTMLElement && middle
          ? middle.offsetLeft - first.offsetLeft
          : 0;
      cycleLength.current = length;
      if (length && length !== previous) {
        const phase = previous
          ? loopPosition(element.scrollLeft, previous) / previous - 1
          : 0;
        element.scrollTo({ left: length * (1 + phase), behavior: "instant" });
        setAtStart(false);
        setAtEnd(false);
      } else if (!length && previous) {
        element.scrollTo({ left: 0, behavior: "instant" });
      }
      update();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(element);
    if (element.firstElementChild) resize.observe(element.firstElementChild);
    element.addEventListener("scroll", update, { passive: true });
    motion.addEventListener("change", measure);
    return () => {
      resize.disconnect();
      motion.removeEventListener("change", measure);
      element.removeEventListener("scroll", update);
    };
  }, []);

  const advance = useCallback((direction: number) => {
    const element = track.current;
    if (!element) return;
    const length = cycleLength.current;
    manualUntil.current = performance.now() + 850;
    if (length) {
      const left = loopPosition(element.scrollLeft, length);
      if (Math.abs(left - element.scrollLeft) > 1)
        element.scrollTo({ left, behavior: "instant" });
      const cards = Array.from(
        element.querySelectorAll<HTMLElement>("[data-original]"),
      );
      const origin = cards[0].offsetLeft;
      const offsets = cards.map((card) => card.offsetLeft - origin);
      const phase = left - length;
      const offset =
        direction < 0
          ? (offsets.findLast((position) => position < phase - 3) ??
            offsets[offsets.length - 1] - length)
          : (offsets.find((position) => position > phase + 3) ?? length);
      element.scrollTo({ left: length + offset, behavior: "smooth" });
      return;
    }
    const slide = element.querySelector("li");
    const gap = Number.parseFloat(getComputedStyle(element).columnGap);
    const distance = slide ? slide.offsetWidth + gap : element.clientWidth;
    const position = element.scrollLeft / distance;
    const nextIndex =
      direction < 0
        ? Math.ceil(position - 0.025) - 1
        : Math.floor(position + 0.025) + 1;
    const max = element.scrollWidth - element.clientWidth;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollTo({
      left: Math.max(0, Math.min(max, nextIndex * distance)),
      behavior: reduced ? "instant" : "smooth",
    });
  }, []);

  useEffect(() => {
    const area = carousel.current;
    const element = track.current;
    if (!area || !element || !playing || !("IntersectionObserver" in window))
      return;

    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previousTime = 0;
    let subpixel = 0;
    let visible = false;
    let hovered =
      matchMedia("(hover: hover)").matches && area.matches(":hover");
    let touching = false;
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    };
    const updatePlayback = () => {
      if (
        !visible ||
        motion.matches ||
        document.hidden ||
        hovered ||
        touching ||
        area.contains(document.activeElement)
      ) {
        stop();
      } else if (!frame) {
        frame = requestAnimationFrame(tick);
      }
    };
    const tick = (now: number) => {
      frame = 0;
      const length = cycleLength.current;
      if (length && previousTime && now > manualUntil.current) {
        subpixel += (Math.min(now - previousTime, 40) * speed) / 1000;
        const pixels = Math.trunc(subpixel);
        subpixel -= pixels;
        if (pixels)
          element.scrollTo({
            left: loopPosition(element.scrollLeft + pixels, length),
            behavior: "instant",
          });
      }
      previousTime = now;
      updatePlayback();
    };
    const enter = (event: PointerEvent) => {
      hovered = event.pointerType === "mouse";
      updatePlayback();
    };
    const leave = () => {
      hovered = false;
      updatePlayback();
    };
    const down = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      touching = true;
      updatePlayback();
    };
    const defer = () => {
      manualUntil.current = performance.now() + 900;
    };
    const up = () => {
      if (!touching) return;
      touching = false;
      defer();
      updatePlayback();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.intersectionRatio >= 0.22;
        updatePlayback();
      },
      { threshold: 0.22 },
    );
    observer.observe(element);
    area.addEventListener("pointerenter", enter);
    area.addEventListener("pointerleave", leave);
    area.addEventListener("focusin", updatePlayback);
    area.addEventListener("focusout", updatePlayback);
    element.addEventListener("pointerdown", down, { passive: true });
    element.addEventListener("wheel", defer, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    motion.addEventListener("change", updatePlayback);
    document.addEventListener("visibilitychange", updatePlayback);
    return () => {
      observer.disconnect();
      area.removeEventListener("pointerenter", enter);
      area.removeEventListener("pointerleave", leave);
      area.removeEventListener("focusin", updatePlayback);
      area.removeEventListener("focusout", updatePlayback);
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("wheel", defer);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      motion.removeEventListener("change", updatePlayback);
      document.removeEventListener("visibilitychange", updatePlayback);
      stop();
    };
  }, [playing, speed]);

  return (
    <div className="tech-carousel" ref={carousel}>
      <div className="tech-carousel-header">
        <h3 id={`label-${id}`}>{label}</h3>
        <div className="tech-carousel-nav">
          <button
            className="tech-autoplay"
            type="button"
            aria-label={`${playing ? "Pausar" : "Reproducir"} · ${label}`}
            aria-controls={id}
            onClick={() => setPlaying((value) => !value)}
          >
            {playing ? (
              <Pause size={17} aria-hidden="true" />
            ) : (
              <Play size={17} aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            aria-label={`Anterior · ${label}`}
            aria-controls={id}
            disabled={atStart}
            onClick={() => advance(-1)}
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={`Siguiente · ${label}`}
            aria-controls={id}
            disabled={atEnd}
            onClick={() => advance(1)}
          >
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
      <ul
        ref={track}
        className="tech-carousel-track"
        id={id}
        aria-labelledby={`label-${id}`}
      >
        {[0, 1, 2].flatMap((copy) =>
          slides.map((slide, index) => (
            <li
              key={`${copy}-${slide.title}`}
              data-original={copy === 1 ? "" : undefined}
              data-copy={copy === 1 ? undefined : ""}
              aria-hidden={copy === 1 ? undefined : true}
              data-position={index % 2}
              data-tool={slide.title}
              className="tech-carousel-card"
              style={{ "--slide-color": slide.color } as CSSProperties}
            >
              <button
                type="button"
                aria-controls="tech-description"
                aria-pressed={active === slide}
                tabIndex={copy === 1 ? undefined : -1}
                onMouseDown={
                  copy === 1 ? undefined : (event) => event.preventDefault()
                }
                onClick={() => onSelect(slide)}
              >
                <span className="tech-slide-media">
                  {slide.image !== undefined ? (
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      sizes="(max-width: 560px) 78vw, (max-width: 1300px) 38vw, 496px"
                    />
                  ) : (
                    <span className="technology-example" aria-hidden="true">
                      <span className="technology-example-file">
                        Ejemplo · {slide.preview.label}
                      </span>
                      <span className="technology-example-content">
                        {slide.preview.lines.map((line, index) => (
                          <span key={index}>
                            <i>{index + 1}</i>
                            {line || " "}
                          </span>
                        ))}
                      </span>
                    </span>
                  )}
                </span>
                <span className="tech-slide-label">
                  <span>
                    <small>{slide.category}</small>
                    <strong>{slide.title}</strong>
                  </span>
                </span>
              </button>
            </li>
          )),
        )}
      </ul>
    </div>
  );
}

export function TechnologyGallery() {
  const [active, setActive] = useState<Tool>(rails[2].slides[0]);
  return (
    <div data-film-cue>
      <div className="tool-explorer tech-mosaic">
        {rails.map((rail) => (
          <ToolSlider
            key={rail.id}
            {...rail}
            active={active}
            onSelect={setActive}
          />
        ))}
        <div
          id="tech-description"
          className="tech-mosaic-detail"
          aria-live="polite"
          style={{ "--detail-color": active.color } as CSSProperties}
        >
          <div key={active.title} className="tech-mosaic-selection">
            <div>
              <h3>{active.title}</h3>
              <p>{active.description}</p>
            </div>
            {active.href && (
              <a href={active.href}>
                {active.link ?? "Ver documentación"}
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
