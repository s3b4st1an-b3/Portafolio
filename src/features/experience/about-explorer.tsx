"use client";

import { useState } from "react";
import { Code2, Database, ListChecks } from "lucide-react";

const topics = [
  {
    title: "Construcción",
    description:
      "Me interesa convertir los procesos diarios de un negocio en herramientas que se puedan usar con facilidad.",
    icon: Code2,
  },
  {
    title: "Datos",
    description:
      "Quiero profundizar en cómo diseñar y consultar datos para que la información del software sea consistente.",
    icon: Database,
  },
  {
    title: "Calidad",
    description:
      "Quiero seguir aprendiendo a probar los flujos importantes de una aplicación y detectar errores antes de entregar.",
    icon: ListChecks,
  },
];

export function AboutExplorer() {
  const [active, setActive] = useState(0);
  const topic = topics[active];
  const Icon = topic.icon;

  return (
    <div className="about-explorer">
      <div
        className="about-explorer-controls"
        role="group"
        aria-label="Áreas de interés"
      >
        {topics.map(({ title }, index) => (
          <button
            key={title}
            type="button"
            aria-pressed={index === active}
            aria-controls="about-topic"
            onClick={() => setActive(index)}
          >
            {title}
          </button>
        ))}
      </div>
      <div
        className="about-explorer-detail"
        id="about-topic"
        aria-live="polite"
      >
        <div key={topic.title}>
          <Icon size={22} aria-hidden="true" />
          <p>{topic.description}</p>
        </div>
      </div>
    </div>
  );
}
