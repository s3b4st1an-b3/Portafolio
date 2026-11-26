import type { Project } from "@/types/portfolio";

export const projects: readonly Project[] = [
  {
    slug: "seym-soft",
    name: "SeymSoft",
    eyebrow: "Proyecto integral · Formación ADSO",
    summary:
      "Sistema de gestión desarrollado para Papelería y Variedades Magic, un negocio que utiliza el software.",
    context:
      "SeymSoft nació de un trabajo colaborativo durante la formación en Análisis y Desarrollo de Software (ADSO).",
    role: "Uno de los creadores, en colaboración con el equipo ADSO.",
    challenge:
      "El alcance técnico incluía coordinar una interfaz web, un servicio backend y un cliente móvil para el mismo negocio.",
    takeaway:
      "Separar la interfaz, los datos operativos y la lógica de negocio permite explicar qué responsabilidad tiene cada componente del sistema.",
    demo: "https://www.seymsoft.dev/",
    problem:
      "Papelería y Variedades Magic necesitaba gestionar las operaciones del negocio en un sistema común.",
    solution:
      "La solución se divide en una interfaz web, un servicio backend y una experiencia móvil conectadas como partes de una arquitectura común.",
    technologies: ["Aplicación web", "Backend", "Aplicación móvil"],
    architecture: [
      "Frontend web",
      "Servicio backend",
      "Cliente móvil",
      "Integración entre componentes",
    ],
    features: [
      "Productos e inventario",
      "Proveedores",
      "Compras y ventas",
      "Clientes y pedidos",
      "Devoluciones",
      "Pagos y abonos",
      "Usuarios y roles",
      "Indicadores",
    ],
    repositories: [
      {
        label: "Frontend web",
        url: "https://github.com/MiguelY08/proyecto_seymSoft",
        codeUrl:
          "https://github.com/MiguelY08/proyecto_seymSoft/tree/pruebaDespliegueFrond/frontend",
      },
      {
        label: "Backend",
        url: "https://github.com/MiguelY08/proyecto_seymSoft_backend",
        codeUrl:
          "https://github.com/MiguelY08/proyecto_seymSoft_backend/tree/pruebaDespliegue/src",
      },
      {
        label: "Aplicación móvil",
        url: "https://github.com/MiguelY08/proyecto_seymSoft_movil",
        codeUrl:
          "https://github.com/MiguelY08/proyecto_seymSoft_movil/tree/developer/movil_seymsoft",
      },
    ],
    accent: "cyan",
  },
  {
    slug: "reciclaje",
    name: "Clasificador de Reciclaje",
    eyebrow: "Python · Inteligencia artificial",
    summary:
      "Aplicación que utiliza inteligencia artificial para clasificar materiales reciclables mediante imágenes.",
    context:
      "El proyecto explora el uso de Python y tecnologías de inteligencia artificial aplicado a la clasificación de residuos.",
    role: "Desarrollador principal, con el apoyo de compañeros.",
    demo: "https://proyecto-de-reciclaje.onrender.com",
    challenge:
      "El entrenamiento del modelo de inteligencia artificial fue uno de los mayores retos del proyecto.",
    takeaway:
      "El caso permite distinguir tres tareas del flujo de IA: capturar una imagen, ejecutar el modelo y presentar una categoría al usuario.",
    problem:
      "La clasificación de residuos requiere distinguir categorías a partir de información de entrada.",
    solution:
      "La aplicación captura una imagen desde la cámara y usa un modelo ONNX para distinguir papel y cartón, vidrio, plástico y residuos orgánicos.",
    technologies: ["Python", "Flask", "ONNX"],
    architecture: [
      "Interfaz web y captura de imagen",
      "API Flask",
      "Modelo ONNX",
      "Resultado de clasificación",
    ],
    features: [
      "Captura desde la cámara",
      "Clasificación en cuatro categorías de residuos",
    ],
    repositories: [
      {
        label: "Repositorio del proyecto",
        url: "https://github.com/s3b4st1an-b3/Proyecto_de_reciclaje",
      },
    ],
    accent: "violet",
  },
] as const;

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
