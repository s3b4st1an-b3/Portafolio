"use client";

import { useEffect, type RefObject } from "react";

export function EditorialFilm({
  root,
}: {
  root: RefObject<HTMLDivElement | null>;
}) {
  useEffect(() => {
    const element = root.current;
    if (!element || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const { target, intersectionRatio } of entries) {
          if (intersectionRatio < 0.28) continue;
          target.setAttribute("data-title-revealed", "");
          observer.unobserve(target);
        }
      },
      { threshold: 0.28, rootMargin: "-76px 0px -5% 0px" },
    );
    element
      .querySelectorAll(".cinema-copy > h2")
      .forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [root]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia();
        media.add(
          {
            motion: "(prefers-reduced-motion: no-preference)",
            wide: "(min-width: 900px) and (min-height: 650px)",
          },
          ({ conditions }) => {
            if (!conditions?.motion) return;
            const wide = conditions.wide;
            element
              .querySelectorAll<HTMLElement>("[data-story-chapter]")
              .forEach((chapter) => {
                const panel =
                  chapter.querySelector<HTMLElement>(".cinema-panel");
                const visual = chapter.querySelector<HTMLElement>(
                  ".fusion-bookend, .fusion-about-frame, .tool-explorer, .fusion-cover",
                );
                if (!panel || !visual) return;
                const id = chapter.id;
                if (id === "inicio") return;
                if (id === "contacto") return;
                if (id === "sobre-mi") {
                  const label = panel.querySelector(".fusion-cut-title");
                  const image = panel.querySelector(".fusion-about-photo");
                  if (label && image) {
                    gsap
                      .timeline({
                        scrollTrigger: {
                          trigger: chapter,
                          start: wide ? "top 62%" : "top 63%",
                          end: wide ? "top 6%" : "22% 26%",
                          scrub: true,
                        },
                      })
                      .fromTo(
                        label,
                        { xPercent: -112, clipPath: "inset(0 100% 0 0)" },
                        {
                          xPercent: 0,
                          clipPath: "inset(0% 0% 0% 0%)",
                          duration: 0.48,
                        },
                        0.22,
                      )
                      .to(
                        image,
                        {
                          xPercent: 27,
                          yPercent: -12,
                          scale: 0.66,
                          duration: 0.62,
                          ease: "power2.inOut",
                        },
                        0.05,
                      );
                  }
                }
                const isBusiness = id === "seymsoft";
                const delayed = id === "tecnologias" || id === "reciclaje";
                const trigger =
                  delayed || isBusiness
                    ? (visual.closest("[data-film-cue]") ?? chapter)
                    : chapter;
                const mask =
                  id === "reciclaje"
                    ? "circle(14% at 65% 48%)"
                    : isBusiness
                      ? "inset(0 0 82% 0)"
                      : id === "tecnologias"
                        ? "inset(0 14% 4% 0)"
                        : "inset(0 88% 0 0)";
                const endMask =
                  id === "reciclaje"
                    ? "circle(80% at 50% 50%)"
                    : "inset(0% 0% 0% 0%)";
                gsap
                  .timeline({
                    scrollTrigger: {
                      trigger,
                      start: isBusiness
                        ? "top 80%"
                        : delayed
                          ? "top 84%"
                          : wide
                            ? "top 87%"
                            : "top 88%",
                      end:
                        id === "reciclaje"
                          ? "top 36%"
                          : delayed || isBusiness
                            ? "top 48%"
                            : wide
                              ? "top 28%"
                              : "top 23%",
                      scrub: true,
                    },
                  })
                  .fromTo(
                    visual,
                    {
                      clipPath: mask,
                      xPercent:
                        wide && !isBusiness
                          ? id === "sobre-mi"
                            ? -24
                            : 18
                          : 0,
                      yPercent: isBusiness ? 7 : 5,
                      scale: isBusiness ? 0.97 : 1,
                    },
                    {
                      clipPath: endMask,
                      xPercent: 0,
                      yPercent: 0,
                      scale: 1,
                      duration: 1,
                      ease: id === "reciclaje" ? "sine.inOut" : "power2.out",
                    },
                    0,
                  );
                const image =
                  id === "sobre-mi" || isBusiness
                    ? null
                    : visual.querySelector("img");
                if (image)
                  gsap.fromTo(
                    image,
                    { scale: 1.17 },
                    {
                      scale: 1,
                      ease: "none",
                      scrollTrigger: {
                        trigger,
                        start: delayed ? "top 82%" : "top bottom",
                        end:
                          id === "reciclaje"
                            ? "top 32%"
                            : delayed
                              ? "top 42%"
                              : "bottom top",
                        scrub: true,
                      },
                    },
                  );
                if (id === "tecnologias")
                  gsap.fromTo(
                    panel.querySelectorAll(".tech-carousel"),
                    { x: wide ? 56 : 9, y: wide ? 22 : 6 },
                    {
                      x: 0,
                      y: 0,
                      stagger: 0.08,
                      scrollTrigger: {
                        trigger,
                        start: "top 81%",
                        end: "top 45%",
                        scrub: true,
                      },
                    },
                  );
              });
          },
        );
        cleanup = () => media.revert();
      },
      () => {},
    );
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [root]);
  return null;
}
