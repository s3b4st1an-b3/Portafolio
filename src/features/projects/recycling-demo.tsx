"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, ScanLine } from "lucide-react";
import { recyclingExamples } from "@/data/recycling-examples";
import "./recycling-demo.css";

type Sample = (typeof recyclingExamples)[number];

export function RecyclingDemo({ className }: { className?: string }) {
  const [selected, setSelected] = useState<Sample | null>(null);

  return (
    <section
      id="demo-reciclaje"
      className={`recycling-demo ${className ?? ""}`}
      aria-labelledby="demo-reciclaje-titulo"
      tabIndex={-1}
    >
      <div className="recycling-demo-panel">
        <header className="recycling-demo-heading">
          <h2 id="demo-reciclaje-titulo">Prueba con una imagen</h2>
          <p>
            Elige una muestra para ver la entrada del modelo y el resultado que
            devolvió.
          </p>
        </header>
        <div
          className="recycling-demo-samples"
          role="group"
          aria-label="Imágenes de muestra"
        >
          {recyclingExamples.map((sample) => (
            <button
              key={sample.id}
              type="button"
              aria-pressed={selected?.id === sample.id}
              aria-controls="demo-reciclaje-flujo"
              onClick={() => setSelected(sample)}
            >
              <Image
                src={sample.photo}
                alt=""
                width={sample.width}
                height={sample.height}
                unoptimized
              />
              <span>
                {sample.label}
                <ArrowRight size={16} aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
        <div id="demo-reciclaje-flujo" className="recycling-demo-flow">
          {selected ? (
            <ol key={selected.id} className="recycling-demo-steps">
              <li>
                <figure>
                  <Image
                    src={selected.photo}
                    alt={selected.label}
                    width={selected.width}
                    height={selected.height}
                    unoptimized
                  />
                  <figcaption>Foto original</figcaption>
                </figure>
              </li>
              <li>
                <figure className="recycling-demo-crop">
                  <Image
                    src={selected.input}
                    alt={`Recorte centrado de ${selected.label.toLowerCase()}`}
                    width={selected.inputSize}
                    height={selected.inputSize}
                    unoptimized
                  />
                  <figcaption>
                    Recorte para el modelo · {selected.inputSize} ×{" "}
                    {selected.inputSize} px
                  </figcaption>
                </figure>
              </li>
              <li className="recycling-demo-result">
                <ScanLine size={24} aria-hidden="true" />
                <p>Resultado del modelo ONNX</p>
                <strong>{selected.category}</strong>
              </li>
            </ol>
          ) : (
            <p className="recycling-demo-placeholder">
              Foto original → Recorte para el modelo → Categoría
            </p>
          )}
        </div>
        <p className="recycling-demo-note">
          Los resultados se obtuvieron previamente con el modelo del proyecto.
          Las muestras son de TrashNet.
        </p>
        <span className="sr-only" role="status" aria-live="polite">
          {selected
            ? `${selected.label}. Resultado del modelo: ${selected.category}.`
            : ""}
        </span>
      </div>
    </section>
  );
}
