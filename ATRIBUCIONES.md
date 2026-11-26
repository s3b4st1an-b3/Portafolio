# Atribución de recursos

| Archivo                              | Autor y procedencia                                                                               | Licencia y uso                                                                                                                                    |
| ------------------------------------ | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `workspace.webp`                     | [Emile Perron, Unsplash](https://unsplash.com/photos/xrVDYZRGdw4)                                 | [Unsplash License](https://unsplash.com/license). Fotografía de contexto de la apertura, procedente del portafolio editorial y convertida a WebP. |
| `code.webp`                          | [Ilya Pavlov, Unsplash](https://unsplash.com/photos/monitor-showing-java-programming-OqtafYT5kTw) | [Unsplash License](https://unsplash.com/license). Fotografía de código para «Sobre mí», procedente del portafolio editorial y convertida a WebP.  |
| `papeleria-magic-tienda.webp`        | [Tienda de Papelería y Variedades Magic](https://www.seymsoft.dev/)                               | Captura auténtica aportada en el portafolio 3D para documentar SeymSoft.                                                                          |
| `clasificador-pantalla-inicial.webp` | [Repositorio del Clasificador](https://github.com/s3b4st1an-b3/Proyecto_de_reciclaje)             | Captura auténtica de la interfaz ejecutada localmente en el trabajo anterior.                                                                     |
| `estudio.webp` en cada proyecto      | Escenas procedurales del portafolio 3D                                                            | Imágenes de respaldo renderizadas a partir del estudio.                                                                                           |

Los archivos `robot-opening.webp` y `studio-gallery.webp` son renders capturados de las escenas procedurales del portafolio. El robot se modeló para este sitio y sus materiales se generan en WebGL.

Las capturas de herramientas proceden de la documentación oficial. Se redimensionaron y se sirven localmente en WebP. Las tarjetas marcadas como «Ejemplo» usan ilustraciones de código y flujos redactadas para este portafolio.

| Diapositiva | Fuente de la captura                                                                          |
| ----------- | --------------------------------------------------------------------------------------------- |
| Postman     | [Guía rápida de Postman](https://learning.postman.com/docs/getting-started/quick-start/)      |
| React       | [React Developer Tools](https://react.dev/learn/react-developer-tools)                        |
| Flutter     | [Flutter Inspector](https://docs.flutter.dev/tools/devtools/inspector)                        |
| Git         | [Historial de Git en VS Code](https://code.visualstudio.com/docs/sourcecontrol/history)       |
| GitHub      | [Hello World de GitHub Docs](https://docs.github.com/en/get-started/using-github/hello-world) |

El video de WhatsApp se usó como referencia de montaje, escala y transiciones. Sus fotogramas, marcas y audio se mantienen fuera de la aplicación.

Las tres fotos de la demo proceden de [TrashNet, de Gary Thung y Mindy Yang](https://huggingface.co/datasets/garythung/trashnet). Se usaron `paper115.jpg`, `glass108.jpg` y `plastic100.jpg`. La [licencia MIT](https://github.com/garythung/trashnet/blob/master/LICENSE) está incluida junto a las muestras en `public/images/projects/reciclaje/muestras/LICENSE.txt`.

Las fotos se convirtieron a WebP y se enviaron con esos mismos bytes a `/api/classify` del [proyecto de Reciclaje, revisión 3ff0a5d](https://github.com/s3b4st1an-b3/Proyecto_de_reciclaje/tree/3ff0a5d0f009d1c9c936c710a0601d5c7e6b73e7). El modelo ONNX devolvió Papel/Cartón, Vidrio y Plástico respectivamente. Los archivos `*-entrada.webp` muestran el recorte RGB de 224 × 224 anterior a la normalización numérica.
