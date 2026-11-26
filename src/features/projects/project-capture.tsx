import Image from "next/image";
import type { ProjectSlug } from "@/types/portfolio";

import { captures } from "@/data/project-images";

export function ProjectCapture({
  slug,
  className,
}: {
  slug: ProjectSlug;
  className?: string;
}) {
  const capture = captures[slug];
  return (
    <figure
      className={className ? `project-capture ${className}` : "project-capture"}
    >
      <a href={capture.file} className="capture-frame">
        <div className="capture-bar">
          <span className="capture-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>{capture.address}</span>
          <span>Ver captura</span>
        </div>
        <Image
          src={capture.file}
          alt={capture.alt}
          width={1440}
          height={900}
          sizes="(max-width: 740px) 94vw, (max-width: 1400px) 84vw, 1250px"
        />
      </a>
      <figcaption>{capture.caption}</figcaption>
    </figure>
  );
}
