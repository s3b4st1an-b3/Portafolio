# Sebastian Bedoya Valencia · Portafolio Fusion

Portafolio Full Stack con dos casos de estudio y un recorrido editorial de seis capítulos con tres escenas 3D. Usa Next.js App Router, React, TypeScript estricto, Tailwind CSS y React Three Fiber.

## Dirección visual

Un robot 3D ocupa el hero completo. La cámara abre con un primer plano y retrocede para dejar ver el torso y los brazos. «Sobre mí» combina texto y fotografía con iluminación menta. «Tecnologías» reúne seis categorías en tres filas desplazadas de movimiento continuo. La captura de SeymSoft se revela al entrar en pantalla su propio encuadre y Reciclaje se abre con una máscara circular. El cierre reúne los dos proyectos en monitores tridimensionales.

La paleta usa tinta `#101722`, acero `#7894B2`, papel `#F4F7FB`, azul de acción `#4F8CFF` y cian `#72DCE8`. Space Grotesk e Inter se sirven localmente. Las fotos, capturas y sus fuentes están documentadas en [ATRIBUCIONES.md](ATRIBUCIONES.md).

## Requisitos

- Node.js 20.19+ en la rama 20, 22.13+ en la rama 22 o Node.js 24 en adelante. Se verificó con Node.js 22.17.1.
- npm 10 o superior y Git.

## Instalación

```bash
npm ci
npm run dev
```

Abre [localhost:3000](http://localhost:3000).

## Comandos

| Comando                | Uso                                                                              |
| ---------------------- | -------------------------------------------------------------------------------- |
| `npm run dev`          | Inicia el servidor de desarrollo.                                                |
| `npm run lint`         | Ejecuta ESLint y falla si hay advertencias.                                      |
| `npm run typecheck`    | Genera los tipos de rutas de Next.js y ejecuta TypeScript sin emitir JavaScript. |
| `npm test`             | Comprueba los límites del progreso, el capítulo activo y los datos.              |
| `npm run test:browser` | Prueba el build en Chromium y guarda capturas en `.next/qa-*`.                   |
| `npm run format`       | Aplica el formato de Prettier.                                                   |
| `npm run format:check` | Comprueba el formato sin modificar archivos.                                     |
| `npm run build`        | Genera el build de producción.                                                   |
| `npm start`            | Sirve el build de producción. Ejecuta el build primero.                          |

Las rutas, los metadatos y los estilos globales viven en `src/app`. El alias `@/*` apunta a `src/*`. Las convenciones para incorporar componentes, funcionalidades y contenido están en [AGENTS.md](AGENTS.md).

El proyecto conserva `package-lock.json` para instalaciones reproducibles y expone scripts que pueden usarse en una futura integración continua o en una imagen de contenedor.

## Recorrido editorial

El robot sigue el cursor con la cabeza y reacciona con luz y estelas breves. «Sobre mí», «Tecnologías», «SeymSoft» y «Reciclaje» se recorren con scroll nativo. Al salir de la portada, la cabecera se convierte en una isla que indica la sección activa y conserva el acceso a cada capítulo. Al recargar la portada se vuelve al inicio. Los enlaces directos a capítulos conservan su destino. En el cierre aparecen dos monitores con capturas auténticas de los proyectos que abren fichas con contexto, arquitectura y repositorios. SeymSoft tiene su propia escena con controles que enfocan la web, el backend, los datos y el móvil.

## Movimiento, renderizado y accesibilidad

- `story-chapters.tsx` sirve el contenido y las anclas desde el servidor. `scroll-timeline.ts` actualiza el indicador de lectura y la sección activa.
- `editorial-film.tsx` carga GSAP y ScrollTrigger de forma diferida. Las máscaras, la escala y el parallax responden al scroll en ambas direcciones. En móvil, el desplazamiento decorativo es más corto.
- `bookend.tsx` activa WebGL por visibilidad. El robot se modela en `robot-assembly.tsx` y se anima en `robot-opening.tsx`. `world.tsx` aloja el escritorio final y el entorno de SeymSoft. Las tres escenas dibujan bajo demanda. El robot limita el DPR a 1.4 en escritorio y 1.15 en pantallas compactas.
- Los carruseles de tecnologías combinan capturas de los proyectos, documentación oficial y ejemplos ilustrativos. La vista con movimiento reducido y el respaldo sin WebGL conservan las imágenes del robot y de los monitores del cierre, sus enlaces y los controles HTML.

La prueba en Chromium usa Node.js 22.13+ y requiere la ruta del navegador en `PORTFOLIO_CHROME`. Ejecuta `npm run build` antes de la prueba.

## Contenido configurable

- Los proyectos y repositorios se centralizan en `src/data/projects.ts`.
- Las tecnologías se centralizan en `src/data/technologies.ts`.
- Los enlaces personales se centralizan en `src/config/site.ts`.
- LinkedIn, correo y CV permanecen desactivados hasta disponer de sus URLs reales.
- Las capturas WebP viven en `public/images/projects/seymsoft/` y `public/images/projects/reciclaje/`. La de SeymSoft se tomó de la [tienda pública de Papelería Magic](https://www.seymsoft.dev/). La de Reciclaje muestra el estado inicial de la [interfaz del repositorio](https://github.com/s3b4st1an-b3/Proyecto_de_reciclaje/tree/3ff0a5d0f009d1c9c936c710a0601d5c7e6b73e7/public), abierta en local con la cámara inactiva. Ambas aparecen en paneles 3D y en las páginas de detalle.
