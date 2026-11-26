"use client";

import { ArrowRight, MoveUpRight } from "lucide-react";
import { useState } from "react";
import { seymsoftPurchase } from "@/data/project-architecture";
import type { Repository } from "@/types/portfolio";
import { useStory } from "./scroll-story";

const purchaseShots = { web: 3.37, backend: 3.56, data: 3.73, mobile: 3.83 };

export function SeymsoftPurchase({
  repositories,
}: {
  repositories: readonly Repository[];
}) {
  const { setBusinessShot } = useStory();
  const [index, setIndex] = useState(0);
  const step = seymsoftPurchase[index];
  const nextIndex = (index + 1) % seymsoftPurchase.length;

  function select(nextIndex: number) {
    setIndex(nextIndex);
    setBusinessShot(purchaseShots[seymsoftPurchase[nextIndex].id]);
  }

  return (
    <section
      className="system-explorer seymsoft-purchase"
      aria-labelledby="seymsoft-compra"
    >
      <div className="seymsoft-purchase-heading">
        <h3 id="seymsoft-compra">Sigue una compra</h3>
        <p>Del carrito a la consulta de la venta. Recorrido ilustrado.</p>
      </div>
      <ul className="system-controls" aria-label="Pasos de la compra">
        {seymsoftPurchase.map((item, itemIndex) => (
          <li key={item.id}>
            <button
              type="button"
              aria-pressed={itemIndex === index}
              aria-controls="seymsoft-module"
              onClick={() => select(itemIndex)}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
      <div id="seymsoft-module" className="system-detail">
        <div aria-live="polite">
          <p className="seymsoft-purchase-progress">
            Paso {index + 1} de {seymsoftPurchase.length}
          </p>
          <h4>{step.title}</h4>
          <p>{step.description}</p>
        </div>
        <ol className="seymsoft-purchase-diagram" aria-label="Flujo del paso">
          {step.diagram.map((node, nodeIndex) => (
            <li key={node}>
              {nodeIndex > 0 && <ArrowRight size={13} aria-hidden="true" />}
              <span>{node}</span>
            </li>
          ))}
        </ol>
        {step.id === "data" && (
          <dl>
            <div>
              <dt>Se registran</dt>
              <dd>El último pago y la venta.</dd>
            </div>
            <div>
              <dt>Se actualizan</dt>
              <dd>El estado del pedido y las existencias.</dd>
            </div>
          </dl>
        )}
        <div className="seymsoft-purchase-actions">
          <a href={`${repositories[step.repository].url}/${step.source}`}>
            Ver en GitHub <MoveUpRight size={13} aria-hidden="true" />
          </a>
          <button type="button" onClick={() => select(nextIndex)}>
            {nextIndex === 0
              ? "Volver a Web"
              : `Siguiente: ${seymsoftPurchase[nextIndex].name}`}
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
