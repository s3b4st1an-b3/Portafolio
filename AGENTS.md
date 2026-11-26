<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Convenciones del portafolio

## Arquitectura

- Usa App Router. En `src/app` residen las rutas, los layouts, los metadatos y los estilos globales.
- Crea `src/components/ui` para piezas reutilizables, `src/components/layout` para estructuras compartidas y `src/components/sections` para secciones de página.
- Mantén las escenas procedurales y el shell de WebGL en `src/components/three`. Las escenas no deben contener contenido esencial que no exista también en HTML.
- Coloca el código específico del catálogo en `src/features/projects`. Mantén ahí los componentes, utilidades y tipos que solo usa esa funcionalidad.
- Usa `src/data` para contenido estático compartido, `src/hooks` para hooks compartidos, `src/lib` para utilidades compartidas, `src/types` para contratos transversales y `src/config` para configuración compartida.
- Guarda imágenes públicas en `public/images/projects`, `public/images/profile` o `public/images/editorial` según su uso. Usa `tests` para pruebas transversales.
- Crea cada carpeta cuando tenga su primer archivo. Importa módulos desde `src` con `@/*` al cruzar responsabilidades y usa imports relativos dentro de un mismo módulo.

## Calidad

- Prefiere Server Components. Usa `"use client"` en el componente más pequeño que requiera estado, eventos o APIs del navegador.
- Usa TypeScript estricto, contratos pequeños y `unknown` con validación cuando el tipo de una entrada sea desconocido.
- Prioriza HTML semántico, accesibilidad y utilidades de Tailwind. Usa ESLint para reglas de código y Prettier para el formato.
- Antes de entregar cambios, ejecuta lint, comprobación de tipos, comprobación de formato y build con los scripts del README.
- En la portada, sirve primero el contenido HTML. Mantén el recorrido editorial en scroll nativo. Reserva WebGL para la apertura, SeymSoft y el cierre. Activa y desmonta las escenas según visibilidad.
- Limita el DPR, conserva la carga diferida y valida el fallback sin WebGL y `prefers-reduced-motion`. Ejecuta `npm test` cuando cambies el estado, las rutas o los datos del recorrido.
- Usa GSAP y ScrollTrigger en `editorial-film.tsx` para los encuadres fotográficos. Limpia sus líneas de tiempo al cambiar de modo o desmontar el componente.

## Alcance

El portafolio es una aplicación Next.js con escenas procedurales de React Three Fiber. El contenido parte de archivos locales. Docker, CI/CD y el despliegue quedan para etapas posteriores.
