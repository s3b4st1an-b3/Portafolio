import { captures } from "./project-images";
import type { technologies } from "./technologies";

type ToolName = (typeof technologies)[number]["tools"][number];
type TechnologyExhibit = {
  color: string;
  description: string;
  href?: string;
  link?: string;
} & (
  | { image: string; alt: string; preview?: never }
  | {
      image?: never;
      alt?: never;
      preview: { label: string; lines: readonly string[] };
    }
);

export const technologyExhibits: Record<ToolName, TechnologyExhibit> = {
  HTML: {
    color: "#ffae85",
    description:
      "Estructurar páginas con encabezados, navegación y contenido semántico.",
    preview: {
      label: "index.html",
      lines: [
        "<main>",
        '  <article aria-labelledby="titulo">',
        '    <h1 id="titulo">Catálogo</h1>',
        "  </article>",
        "</main>",
      ],
    },
  },
  JavaScript: {
    color: "#ffe177",
    description:
      "Agregar interacciones a las interfaces y transformar datos en el navegador.",
    preview: {
      label: "catalogo.js",
      lines: [
        "const disponibles = productos",
        "  .filter(producto => producto.stock > 0)",
        "  .map(producto => producto.nombre);",
      ],
    },
  },
  React: {
    color: "#6ce5ef",
    image: "/images/tools/react.webp",
    alt: "Panel de componentes de React Developer Tools",
    href: "https://react.dev/learn/react-developer-tools",
    description:
      "Construir interfaces con componentes y administrar su estado y propiedades.",
  },
  "Tailwind CSS": {
    color: "#86e5ef",
    description: "Construir layouts responsivos con clases de utilidad.",
    preview: {
      label: "Estilos de interfaz",
      lines: [
        '<section class="grid gap-4',
        '  sm:grid-cols-2 lg:grid-cols-3">',
        "  <!-- Lista de productos -->",
        "</section>",
      ],
    },
  },
  "Node.js": {
    color: "#b7e998",
    description:
      "Ejecutar JavaScript del lado del servidor para crear servicios y APIs.",
    preview: {
      label: "servidor.mjs",
      lines: [
        'import { createServer } from "node:http";',
        "",
        "createServer((req, res) => {",
        '  res.end("Servicio activo");',
        "}).listen(3000);",
      ],
    },
  },
  Python: {
    color: "#ffce79",
    description:
      "Procesar datos y conectar la interfaz con el modelo del Clasificador de Reciclaje.",
    href: "/projects/reciclaje",
    link: "Ver caso de estudio",
    preview: {
      label: "clasificacion.py",
      lines: [
        "def clasificar(imagen, modelo):",
        "    entrada = preparar(imagen)",
        "    resultado = modelo.predecir(entrada)",
        "    return resultado",
      ],
    },
  },
  Django: {
    color: "#79e3b7",
    description:
      "Organizar aplicaciones web en Python con rutas, vistas y acceso a datos.",
    preview: {
      label: "urls.py",
      lines: [
        "from django.urls import path",
        "from .views import catalogo",
        "",
        "urlpatterns = [",
        '    path("catalogo/", catalogo),',
        "]",
      ],
    },
  },
  PostgreSQL: {
    color: "#8fbaff",
    description: "Definir esquemas y consultar datos relacionales con SQL.",
    preview: {
      label: "inventario.sql",
      lines: [
        "SELECT categoria, SUM(stock)",
        "FROM inventario",
        "GROUP BY categoria",
        "ORDER BY categoria;",
      ],
    },
  },
  MySQL: {
    color: "#ffd19a",
    description:
      "Almacenar datos relacionales y consultar operaciones con filtros y agregaciones.",
    preview: {
      label: "ventas.sql",
      lines: [
        "SELECT fecha, COUNT(*) AS pedidos",
        "FROM ventas",
        "WHERE estado = 'pagado'",
        "GROUP BY fecha;",
      ],
    },
  },
  MongoDB: {
    color: "#9aef9a",
    description:
      "Organizar datos como documentos y consultar colecciones por sus campos.",
    preview: {
      label: "Consulta de documentos",
      lines: [
        "db.productos.find(",
        "  { stock: { $gt: 0 } },",
        "  { nombre: 1, stock: 1 }",
        ");",
      ],
    },
  },
  Dart: {
    color: "#81d7fb",
    description:
      "Escribir la lógica y los modelos tipados de aplicaciones móviles.",
    preview: {
      label: "producto.dart",
      lines: [
        "class Producto {",
        "  final String nombre;",
        "  final int stock;",
        "  const Producto(this.nombre, this.stock);",
        "}",
      ],
    },
  },
  Flutter: {
    color: "#8dbefa",
    image: "/images/tools/flutter.webp",
    alt: "Inspector de widgets de Flutter",
    href: "https://docs.flutter.dev/tools/devtools/inspector",
    description:
      "Construir interfaces móviles con Dart y revisar su jerarquía desde el inspector.",
  },
  Postman: {
    color: "#ff9a62",
    image: "/images/tools/postman.webp",
    alt: "Petición GET y respuesta mostradas en Postman",
    href: "https://learning.postman.com/docs/getting-started/quick-start/",
    description:
      "Enviar peticiones HTTP y revisar los parámetros, el código de estado y la respuesta.",
  },
  Git: {
    color: "#ffa17f",
    image: "/images/tools/git.webp",
    alt: "Gráfico de ramas y commits de Git en Visual Studio Code",
    href: "https://code.visualstudio.com/docs/sourcecontrol/history",
    description:
      "Organizar cambios en commits, trabajar con ramas y revisar el historial.",
  },
  GitHub: {
    color: "#d6abff",
    image: "/images/tools/github.webp",
    alt: "Comparación de líneas agregadas y eliminadas en GitHub",
    href: "https://docs.github.com/en/get-started/start-your-journey/hello-world",
    description: "Publicar repositorios y colaborar revisando cambios.",
  },
  "Machine Learning": {
    color: "#9de3a6",
    image: captures.reciclaje.file,
    alt: captures.reciclaje.alt,
    href: "/projects/reciclaje",
    link: "Ver caso de estudio",
    description:
      "Aplicación de un modelo ONNX a la clasificación de imágenes en el proyecto de Reciclaje.",
  },
  "manejo de IA": {
    color: "#d4adfd",
    description:
      "Usar herramientas de IA como apoyo para explorar alternativas y revisar sus resultados.",
    preview: {
      label: "Flujo de trabajo",
      lines: [
        "01  Definir el objetivo",
        "02  Probar una propuesta",
        "03  Revisar y contrastar el resultado",
      ],
    },
  },
};
