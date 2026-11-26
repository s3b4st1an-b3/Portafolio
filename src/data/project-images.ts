import type { ProjectSlug } from "@/types/portfolio";

export const captures = {
  "seym-soft": {
    file: "/images/projects/seymsoft/papeleria-magic-tienda.webp",
    address: "seymsoft.dev",
    alt: "Portada de la tienda de Papelería Magic en SeymSoft, con la sección de categorías al pie",
    caption: "Tienda pública de Papelería Magic",
  },
  reciclaje: {
    file: "/images/projects/reciclaje/clasificador-pantalla-inicial.webp",
    address: "Interfaz del repositorio",
    alt: "Interfaz original del Clasificador de Reciclaje con cámara desactivada",
    caption:
      "Pantalla inicial ejecutada en local desde el repositorio del proyecto",
  },
} satisfies Record<
  ProjectSlug,
  { file: string; address: string; alt: string; caption: string }
>;
