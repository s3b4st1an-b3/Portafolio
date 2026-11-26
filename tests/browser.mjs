import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const browser = process.env.PORTFOLIO_CHROME;
if (!browser)
  throw new Error("Define PORTFOLIO_CHROME con la ruta de Chromium.");
const origin = "http://127.0.0.1:4319";
const profile = await mkdtemp(resolve(".next", "qa-"));
const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", "4319"],
  { stdio: "inherit", windowsHide: true },
);
const chrome = spawn(
  browser,
  [
    "--headless=new",
    "--disable-background-networking",
    "--disable-extensions",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=0",
    "--enable-unsafe-swiftshader",
    "--use-angle=swiftshader",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: "ignore", windowsHide: true },
);
let browserError;
chrome.on("error", (error) => {
  browserError = error;
});

async function until(probe, label, timeout = 15000) {
  const end = performance.now() + timeout;
  while (performance.now() < end) {
    if (browserError) throw browserError;
    const result = await probe().catch(() => null);
    if (result) return result;
    await delay(100);
  }
  throw new Error("Tiempo agotado: " + label);
}

let socket;
let command;
try {
  await until(async () => (await fetch(origin)).ok, "servidor Next.js");
  const debuggingPort = await until(
    async () =>
      (await readFile(join(profile, "DevToolsActivePort"), "utf8")).split(
        /\r?\n/,
      )[0],
    "conexión con Chromium",
  );
  const target = await until(async () => {
    const response = await fetch(`http://127.0.0.1:${debuggingPort}/json/list`);
    const targets = await response.json();
    return targets.find((item) => item.type === "page");
  }, "página de Chromium");
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((yes, no) => {
    socket.addEventListener("open", yes, { once: true });
    socket.addEventListener("error", no, { once: true });
  });
  const pending = new Map();
  const exceptions = [];
  let id = 0;
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.method === "Runtime.exceptionThrown") {
      const { text, exception } = message.params.exceptionDetails;
      exceptions.push(exception?.description ?? text);
    }
    if (
      message.method === "Runtime.consoleAPICalled" &&
      message.params.type === "error"
    ) {
      exceptions.push(
        message.params.args
          .map((arg) => arg.value ?? arg.description)
          .join(" "),
      );
    }
    const reply = pending.get(message.id);
    if (reply) {
      pending.delete(message.id);
      if (message.error) reply.reject(new Error(message.error.message));
      else reply.resolve(message.result);
    }
  });
  command = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const messageId = ++id;
      pending.set(messageId, { resolve, reject });
      socket.send(JSON.stringify({ id: messageId, method, params }));
    });
  const evaluate = async (expression) => {
    const { result, exceptionDetails } = await command("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (exceptionDetails)
      throw new Error(
        exceptionDetails.exception?.description ?? exceptionDetails.text,
      );
    return result.value;
  };
  const click = (selector) =>
    evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const mouse = (type, x, y) =>
    command("Input.dispatchMouseEvent", {
      type,
      x,
      y,
      ...(type === "mouseMoved" ? {} : { button: "left", clickCount: 1 }),
    });
  const open = (path) => command("Page.navigate", { url: origin + path });
  const screenshot = async (name) => {
    const { data } = await command("Page.captureScreenshot", { format: "png" });
    await writeFile(join(profile, name + ".png"), Buffer.from(data, "base64"));
  };

  await command("Page.enable");
  await command("Runtime.enable");
  const size = (width) =>
    command("Emulation.setDeviceMetricsOverride", {
      width,
      height: width < 761 ? 844 : 900,
      deviceScaleFactor: 1,
      mobile: width < 761,
    });
  const media = (value) =>
    command("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-motion", value }],
    });
  const page = (path, selector) =>
    open(path).then(() =>
      until(
        () =>
          evaluate(
            `location.pathname === ${JSON.stringify(path.split(/[?#]/)[0])} && !!document.querySelector(${JSON.stringify(selector)})`,
          ),
        path,
      ),
    );
  const chapter = (id) =>
    until(
      () =>
        evaluate(
          `document.querySelector('.scroll-story')?.dataset.chapter === "${id}"`,
        ),
      "sección " + id,
    );
  await media("reduce");
  await size(1440);
  await page("/?responsive=1", ".fusion-editorial");
  assert.equal(
    await evaluate(
      "getComputedStyle(document.querySelector('.hero-type-char')).animationName",
    ),
    "none",
    "la portada respeta el movimiento reducido",
  );
  for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    await size(width);
    await evaluate(
      "new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))",
    );
    assert.ok(
      await evaluate("document.documentElement.scrollWidth <= innerWidth"),
      "ancho " + width,
    );
    assert.equal(
      await evaluate("document.querySelectorAll('canvas').length"),
      0,
    );
    if ([390, 768, 1440].includes(width))
      await screenshot("editorial-" + width);
  }

  await command("Page.addScriptToEvaluateOnNewDocument", {
    source: `Object.defineProperty(navigator, 'hardwareConcurrency', { value: 8 });
      Object.defineProperty(navigator, 'deviceMemory', { value: 8 });
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, options) {
        return original.call(this, type, type === 'webgl2'
          ? { ...options, failIfMajorPerformanceCaveat: false, preserveDrawingBuffer: true }
          : options);
      };`,
  });
  await media("no-preference");
  await size(390);
  await page("/?robot-mobile=1", ".fusion-bookend-intro");
  await until(
    () =>
      evaluate(
        "document.querySelector('#titulo-inicio').getBoundingClientRect().height > 0",
      ),
    "hero móvil visible",
  );
  assert.ok(
    await evaluate(`(() => {
      const stage = document.querySelector('.fusion-bookend-intro').getBoundingClientRect();
      const nav = document.querySelector('.story-header').getBoundingClientRect();
      const title = document.querySelector('#titulo-inicio');
      const titleBounds = title.getBoundingClientRect();
      const letters = Array.from(title.querySelectorAll('.hero-type-char'));
      return stage.height > 0
        && Math.abs(stage.top - nav.bottom) <= 1
        && stage.bottom <= titleBounds.top
        && titleBounds.bottom <= innerHeight
        && title.querySelector('em').textContent.trim() === 'Bedoya Valencia.'
        && letters.every(letter => getComputedStyle(letter).animationName === 'none'
          && getComputedStyle(letter).opacity === '1');
    })()`),
    "el nombre completo aparece de inmediato debajo del robot en móvil",
  );
  await until(
    () =>
      evaluate(
        "!!document.querySelector('.fusion-bookend-intro[data-live=true] canvas')",
      ),
    "robot WebGL en móvil",
  );
  await delay(2600);
  await screenshot("robot-movil");

  await size(1440);
  await page("/?film=1", ".fusion-editorial");
  assert.ok(
    await evaluate(`(() => {
      const letters = document.querySelectorAll('#titulo-inicio .hero-type-char');
      const first = getComputedStyle(letters[0]);
      const next = getComputedStyle(letters[1]);
      const last = getComputedStyle(letters[letters.length - 1]);
      return first.animationName === 'hero-keypress' && parseFloat(first.animationDelay) < parseFloat(next.animationDelay) && parseFloat(last.animationDelay) >= 1.8;
    })()`),
    "el nombre se escribe carácter por carácter",
  );
  await until(
    () =>
      evaluate(
        "!!document.querySelector('.fusion-bookend-intro[data-live=true] canvas')",
      ),
    "apertura WebGL",
  );
  await delay(380);
  const robotBounds = await evaluate(
    "document.querySelector('.fusion-bookend-intro').getBoundingClientRect().toJSON()",
  );
  assert.ok(
    robotBounds.width >= 1400 && robotBounds.height >= 720,
    "el robot ocupa todo el hero en escritorio",
  );
  const robotPoster = await command("Page.captureScreenshot", {
    format: "png",
    clip: {
      x: Math.ceil(robotBounds.x + 2),
      y: Math.ceil(robotBounds.y + 2),
      width: Math.floor(robotBounds.width - 4),
      height: Math.floor(robotBounds.height - 4),
      scale: 1,
    },
  });
  await writeFile(
    join(profile, "robot-poster.png"),
    Buffer.from(robotPoster.data, "base64"),
  );
  await delay(2300);
  const visual = await evaluate(
    "JSON.stringify(document.querySelector('.fusion-bookend-intro').getBoundingClientRect().toJSON())",
  ).then(JSON.parse);
  const center = {
    x: visual.x + visual.width / 2,
    y: visual.y + visual.height / 2,
  };
  await mouse("mouseMoved", center.x, center.y);
  await delay(500);
  await screenshot("apertura");
  const original = await evaluate(
    "document.querySelector('canvas').toDataURL()",
  );
  await mouse("mouseMoved", center.x + visual.width * 0.42, center.y + 50);
  await delay(170);
  await screenshot("robot-seguimiento");
  await delay(550);
  assert.notEqual(
    await evaluate("document.querySelector('canvas').toDataURL()"),
    original,
    "el objeto reacciona al cursor",
  );

  const titleMotion = await evaluate(`(async () => {
    const heading = document.getElementById('titulo-tecnologias');
    const started = new Promise(resolve => {
      const observer = new MutationObserver(() => {
        const animation = heading.getAnimations().find(item => item.animationName === 'editorial-title-entry');
        if (!animation) return;
        observer.disconnect();
        resolve(animation);
      });
      observer.observe(heading, { attributeFilter: ['data-title-revealed'] });
      setTimeout(() => { observer.disconnect(); resolve(null); }, 4000);
    });
    heading.scrollIntoView({ block: 'center', behavior: 'instant' });
    const animation = await started;
    if (!animation) return null;
    await new Promise(resolve => setTimeout(resolve, 500));
    const inMotion = animation.playState === 'running' && getComputedStyle(heading).clipPath !== 'none';
    await animation.finished;
    return { inMotion, opacity: getComputedStyle(heading).opacity };
  })()`);
  assert.deepEqual(
    titleMotion,
    { inMotion: true, opacity: "1" },
    "el título sigue en movimiento tras un salto y se asienta sin seguir desplazándose",
  );
  await until(
    () =>
      evaluate(
        "document.querySelector('.story-header').dataset.floating === 'true'",
      ),
    "la barra se convierte en isla al salir de la portada",
  );
  assert.deepEqual(
    await evaluate(`Array.from(document.querySelectorAll('.tech-carousel-track')).map(rail =>
      Array.from(rail.querySelectorAll('[data-original]')).map(card => card.dataset.tool))`),
    [
      [
        "HTML",
        "JavaScript",
        "React",
        "Tailwind CSS",
        "Node.js",
        "Python",
        "Django",
      ],
      ["PostgreSQL", "MySQL", "MongoDB", "Dart", "Flutter"],
      ["Postman", "Git", "GitHub", "Machine Learning", "manejo de IA"],
    ],
  );
  await click('[aria-label="Pausar · Frontend y Backend"]');
  await click('[aria-label="Pausar · Bases de datos y móvil"]');
  await click('[aria-label="Pausar · Herramientas de desarrollo e IA"]');
  const railState = (id) =>
    evaluate(`(() => {
    const track = document.getElementById(${JSON.stringify(id)});
    const length = track.querySelector('[data-original]').offsetLeft - track.firstElementChild.offsetLeft;
    return { left: track.scrollLeft, length };
  })()`);
  await until(
    async () => (await railState("slider-herramientas")).length > 500,
    "los carruseles tienen una vuelta completa",
  );
  await evaluate(`document.querySelectorAll('.tech-carousel-track').forEach(track => {
    const origin = track.querySelector('[data-original]').offsetLeft - track.firstElementChild.offsetLeft;
    track.scrollTo({left:origin,behavior:'instant'});
  })`);
  const toolsRail = await railState("slider-herramientas");
  const devRail = await railState("slider-web");
  await click('[aria-label="Siguiente · Herramientas de desarrollo e IA"]');
  await until(
    async () =>
      (await railState("slider-herramientas")).left > toolsRail.length + 30,
    "avanza el slider de herramientas",
  );
  assert.equal((await railState("slider-web")).left, devRail.length);
  await click('[aria-label="Anterior · Herramientas de desarrollo e IA"]');
  await until(
    async () =>
      Math.abs(
        (await railState("slider-herramientas")).left - toolsRail.length,
      ) <= 3,
    "regresa el slider a Postman",
  );
  await click(
    '#slider-herramientas [data-original][data-tool="Postman"] button',
  );
  assert.equal(
    await evaluate(
      "document.querySelector('#tech-description h3').textContent",
    ),
    "Postman",
  );
  await evaluate(
    "document.getElementById('slider-herramientas').scrollIntoView({block:'center',behavior:'instant'})",
  );
  await until(
    () =>
      evaluate(
        `document.querySelector('[data-original][data-tool="Postman"] img')?.naturalWidth > 0`,
      ),
    "carga la captura de Postman",
  );
  await screenshot("herramientas");
  await mouse("mouseMoved", 4, 85);
  await click('[aria-label="Reproducir · Herramientas de desarrollo e IA"]');
  await until(
    async () =>
      (await railState("slider-herramientas")).left > toolsRail.length + 20,
    "el tercer carrusel avanza automáticamente",
  );
  const movingAt = (await railState("slider-herramientas")).left;
  await until(
    async () => (await railState("slider-herramientas")).left > movingAt + 5,
    "el carrusel sigue avanzando",
  );
  await evaluate(`(() => {
    const rail = document.getElementById("slider-herramientas");
    const length = rail.querySelector("[data-original]").offsetLeft - rail.firstElementChild.offsetLeft;
    rail.scrollTo({left: 2 * length - 14, behavior: "instant"});
  })()`);
  await until(async () => {
    const { left, length } = await railState("slider-herramientas");
    return left > length + 10 && left < length + 140;
  }, "la fila enlaza el final con el principio de la vuelta");
  await click('[aria-label="Pausar · Herramientas de desarrollo e IA"]');
  await click(
    '#slider-herramientas [data-original][data-tool="Machine Learning"] button',
  );
  assert.equal(
    await evaluate(
      "document.querySelector('#tech-description a').getAttribute('href')",
    ),
    "/projects/reciclaje",
  );
  await evaluate("window.scrollTo({top: 0, behavior: 'instant'})");
  await until(
    () =>
      evaluate(
        "document.querySelector('.story-header').dataset.floating === 'false'",
      ),
    "la barra recupera su ancho inicial",
  );

  const sample = (id, offset) =>
    evaluate(`(() => {
    const section = document.getElementById("${id}");
    const top = section.getBoundingClientRect().top + scrollY;
    scrollTo({top: top + ${offset}, behavior: "instant"});
    return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => {
      const figure = section.querySelector('.fusion-about-frame, .tool-explorer, .fusion-bookend, .fusion-cover');
      resolve({mask: getComputedStyle(figure).clipPath, transform: getComputedStyle(figure).transform});
    })));
  })()`);
  const storeMaskAt = (ratio) =>
    evaluate(`(() => {
    const cue = document.querySelector('.fusion-business-cue');
    scrollTo({top: scrollY + cue.getBoundingClientRect().top - innerHeight * ${ratio}, behavior: "instant"});
    return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() =>
      resolve(getComputedStyle(cue.firstElementChild).clipPath))));
  })()`);
  const storeBefore = await storeMaskAt(0.92);
  assert.match(storeBefore, /inset\(0(?:px|%) 0(?:px|%) 82%/);
  assert.notEqual(
    await storeMaskAt(0.68),
    storeBefore,
    "la captura empieza a revelarse cuando entra su propio marco",
  );
  assert.match(await storeMaskAt(0.42), /inset\(0(?:px|%)\)/);
  for (const [id, shape] of [
    ["sobre-mi", "inset"],
    ["tecnologias", "inset"],
    ["seymsoft", "inset"],
    ["reciclaje", "circle"],
  ]) {
    const entering = await sample(id, -380);
    const revealed = await sample(id, 250);
    assert.match(entering.mask, new RegExp(shape), id);
    assert.notEqual(entering.mask, revealed.mask, id + " cambia de máscara");
    assert.notEqual(
      entering.transform,
      revealed.transform,
      id + " cambia de encuadre",
    );
    assert.deepEqual(
      await sample(id, -380),
      entering,
      id + " vuelve al mismo fotograma",
    );
    await sample(id, id === "seymsoft" ? 0 : id === "sobre-mi" ? -45 : -105);
    await until(
      () =>
        evaluate(
          id === "seymsoft"
            ? "!!document.querySelector('.fusion-bookend-business[data-live=true] canvas')"
            : "!document.querySelector('canvas')",
        ),
      "sección editorial sin canvas",
    );
    await screenshot(id);
    if (id === "sobre-mi") {
      await click(".about-explorer-controls button:nth-child(2)");
      assert.match(
        await evaluate("document.getElementById('about-topic').textContent"),
        /consultar datos/,
      );
    }
  }
  await sample("reciclaje", -35);
  const capture = await evaluate(
    "document.querySelector('#reciclaje .fusion-cover').getBoundingClientRect().toJSON()",
  );
  await mouse("mouseMoved", capture.x + 18, Math.max(105, capture.y + 100));
  await until(
    () =>
      evaluate(
        "parseFloat(getComputedStyle(document.querySelector('#reciclaje .fusion-cover'), '::after').opacity) > .8",
      ),
    "el borde de Reciclaje se enciende al pasar el cursor",
  );
  await screenshot("reciclaje-borde");
  await click('#reciclaje a[href="#demo-reciclaje"]');
  await until(
    () =>
      evaluate(`(() => {
        const demo = document.querySelector('#demo-reciclaje');
        const top = demo.getBoundingClientRect().top;
        return location.hash === '#demo-reciclaje' && top >= 0 && top <= 110;
      })()`),
    "acceso a la demo de Reciclaje desde la portada",
  );
  assert.equal(
    await evaluate(
      "getComputedStyle(document.querySelector('.recycling-demo-samples')).display",
    ),
    "grid",
  );
  assert.equal(
    await evaluate("document.querySelector('#demo-reciclaje-flujo strong')"),
    null,
  );
  for (const [index, category, asset] of [
    [1, "Papel/Cartón", "papel"],
    [2, "Vidrio", "vidrio"],
    [3, "Plástico", "plastico"],
  ]) {
    const button = `#demo-reciclaje [role="group"] button:nth-child(${index})`;
    if (index === 1) {
      await evaluate(
        `document.querySelector(${JSON.stringify(button)}).focus()`,
      );
      await command("Input.dispatchKeyEvent", {
        type: "keyDown",
        key: "Enter",
        code: "Enter",
        text: "\r",
        unmodifiedText: "\r",
        windowsVirtualKeyCode: 13,
        nativeVirtualKeyCode: 13,
      });
      await command("Input.dispatchKeyEvent", {
        type: "keyUp",
        key: "Enter",
        code: "Enter",
        windowsVirtualKeyCode: 13,
      });
    } else {
      await click(button);
    }
    await until(
      () =>
        evaluate(`(() => {
      const crop = document.querySelector('#demo-reciclaje-flujo img[src$="/${asset}-entrada.webp"]');
      return crop?.naturalWidth === 224 && crop.naturalHeight === 224;
    })()`),
      "recorte real de " + asset,
    );
    assert.equal(
      await evaluate(
        "document.querySelector('#demo-reciclaje-flujo strong').textContent",
      ),
      category,
    );
    assert.equal(
      await evaluate(
        "document.querySelectorAll('#demo-reciclaje button[aria-pressed=true]').length",
      ),
      1,
    );
  }
  await screenshot("reciclaje-demo");
  await click('[data-chapter-link][href="#seymsoft"]');
  await chapter("seymsoft");
  await until(
    () =>
      evaluate(
        "!!document.querySelector('.fusion-bookend-business[data-live=true] canvas')",
      ),
    "la cámara de SeymSoft está disponible",
  );
  const businessMotion = await evaluate(`(async () => {
    const canvas = document.querySelector('.fusion-bookend-business canvas');
    const preview = document.createElement('canvas');
    preview.width = 64;
    preview.height = 48;
    const context = preview.getContext('2d');
    const sample = () => {
      context.drawImage(canvas, 0, 0, 64, 48);
      return preview.toDataURL();
    };
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const before = sample();
    Array.from(document.querySelectorAll('.system-controls button')).find(button => button.textContent === 'Datos').click();
    await new Promise(resolve => setTimeout(resolve, 330));
    const middle = sample();
    await new Promise(resolve => setTimeout(resolve, 1250));
    const end = sample();
    return before !== end && middle !== end;
  })()`);
  assert.ok(
    await evaluate(
      "document.querySelector('#seymsoft-module dl').children.length > 1",
    ),
  );
  assert.match(
    await evaluate("document.querySelector('#seymsoft-module').innerText"),
    /Paso 3 de 4[\s\S]+transacción/,
  );
  assert.ok(
    businessMotion,
    "la cámara continúa el trayecto después del primer medio segundo",
  );
  await click(".seymsoft-purchase-actions button");
  await until(
    () =>
      evaluate(
        "document.querySelector('.system-controls button[aria-pressed=true]').textContent === 'Móvil'",
      ),
    "la compra termina en la consulta móvil",
  );
  assert.equal(
    await evaluate(
      "document.querySelector('.seymsoft-purchase-actions a').href",
    ),
    "https://github.com/MiguelY08/proyecto_seymSoft_movil/blob/developer/movil_seymsoft/lib/data/repositories/sales_repository.dart",
  );
  await click(".seymsoft-purchase-actions button");
  await until(
    () =>
      evaluate(
        "document.querySelector('.system-controls button[aria-pressed=true]').textContent === 'Web'",
      ),
    "volver al inicio del flujo de compra",
  );
  await delay(1550);
  await screenshot("seymsoft-web");
  await click('#seymsoft button[aria-haspopup="dialog"]');
  await until(
    () => evaluate("!!document.querySelector('dialog[open]')"),
    "galería HTML",
  );
  await click(".desk-gallery-header button");
  await until(
    () => evaluate("!document.querySelector('dialog[open]')"),
    "cerrar captura",
  );
  await click('#seymsoft a[href="/projects/seym-soft"]');
  await until(
    () =>
      evaluate(
        "location.pathname === '/projects/seym-soft' && !!document.querySelector('.back-link')",
      ),
    "caso SeymSoft",
  );
  await click(".back-link");
  await chapter("seymsoft");

  await click('[data-chapter-link][href="#contacto"]');
  await chapter("contacto");
  await until(
    () =>
      evaluate(
        "!!document.querySelector('.fusion-bookend-gallery[data-live=true] canvas')",
      ),
    "dos monitores WebGL",
  );
  await until(
    () =>
      evaluate(
        "document.querySelectorAll('.fusion-render canvas').length === 1",
      ),
    "una sola escena activa",
  );
  assert.equal(
    await evaluate(
      "document.querySelectorAll('.fusion-bookend-gallery .fusion-exhibit-links button').length",
    ),
    2,
  );
  await mouse("mouseMoved", 20, 120);
  await delay(700);
  const closingCanvas =
    "document.querySelector('.fusion-bookend-gallery canvas').toDataURL()";
  const unlitDesk = await evaluate(closingCanvas);
  await screenshot("cierre");
  const desk = await evaluate(
    "JSON.stringify(document.querySelector('.fusion-bookend-gallery').getBoundingClientRect().toJSON())",
  ).then(JSON.parse);
  for (const [slug, title, left] of [
    ["seym-soft", "SeymSoft", true],
    ["reciclaje", "Clasificador de Reciclaje", false],
  ]) {
    let point;
    for (const y of [0.38, 0.46, 0.31, 0.54]) {
      for (const x of left
        ? [0.38, 0.32, 0.44, 0.27]
        : [0.61, 0.67, 0.55, 0.72]) {
        const coords = [desk.x + desk.width * x, desk.y + desk.height * y];
        await mouse("mouseMoved", ...coords);
        await evaluate(
          "new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))",
        );
        if (
          await evaluate(
            `document.querySelector('.fusion-bookend-gallery').dataset.deskHover === "${slug}"`,
          )
        ) {
          point = coords;
          break;
        }
      }
      if (point) break;
    }
    assert.ok(point, "pantalla seleccionable " + slug);
    await delay(600);
    assert.notEqual(
      await evaluate(closingCanvas),
      unlitDesk,
      "el escritorio reacciona con luz al pasar sobre " + slug,
    );
    await screenshot("cierre-luz-" + slug);
    await mouse("mousePressed", ...point);
    await mouse("mouseReleased", ...point);
    await until(
      () =>
        evaluate(
          `document.querySelector('dialog[open] h3')?.textContent === "${title}"`,
        ),
      "ficha de " + title,
    );
    assert.equal(
      await evaluate(
        "document.querySelectorAll('.fusion-project-facts section').length",
      ),
      4,
    );
    await click(".desk-gallery-header button");
    await until(
      () => evaluate("!document.querySelector('dialog[open]')"),
      "cerrar ficha",
    );
  }
  await media("reduce");
  await until(
    () =>
      evaluate(
        "!document.querySelector('canvas') && getComputedStyle(document.querySelector('#seymsoft figure')).clipPath === 'none'",
      ),
    "modo reducido",
  );
  await evaluate("document.querySelector('[data-monitor=seym-soft]').focus()");
  await command("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Enter",
    code: "Enter",
    text: "\r",
    unmodifiedText: "\r",
    windowsVirtualKeyCode: 13,
    nativeVirtualKeyCode: 13,
  });
  await command("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Enter",
    code: "Enter",
    windowsVirtualKeyCode: 13,
  });
  await until(
    () =>
      evaluate(
        "document.querySelector('dialog[open] h3')?.textContent === 'SeymSoft'",
      ),
    "abrir la ficha desde el monitor con el teclado",
  );
  await click(".desk-gallery-header button");
  await until(
    () =>
      evaluate(
        "!document.querySelector('dialog[open]') && document.activeElement?.dataset.monitor === 'seym-soft'",
      ),
    "devolver el foco al monitor tras cerrar la ficha",
  );
  await size(390);
  await page("/#contacto", ".fusion-bookend-gallery");
  await chapter("contacto");
  await screenshot("cierre-movil");
  const mobileMonitor = await evaluate(`(() => {
    const frame = document.querySelector('.fusion-bookend-gallery').getBoundingClientRect();
    const [left, right] = Array.from(document.querySelectorAll('.fusion-exhibit-links button'), button => button.getBoundingClientRect());
    if (left.right > right.left || left.left < frame.left || right.right > frame.right) return null;
    return { x: Math.round(right.left + right.width / 2), y: Math.round(right.top + right.height / 2) };
  })()`);
  assert.ok(
    mobileMonitor,
    "los botones de proyecto caben sobre el estudio móvil",
  );
  await command("Emulation.setTouchEmulationEnabled", {
    enabled: true,
    maxTouchPoints: 1,
  });
  await command("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [mobileMonitor],
  });
  await command("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await until(
    () =>
      evaluate(
        "document.querySelector('dialog[open] h3')?.textContent === 'Clasificador de Reciclaje'",
      ),
    "abrir una ficha tocando el monitor en modo reducido",
  );
  await click(".desk-gallery-header button");
  await until(
    () => evaluate("!document.querySelector('dialog[open]')"),
    "cerrar ficha móvil",
  );
  await command("Emulation.setTouchEmulationEnabled", { enabled: false });
  await click(".story-menu");
  assert.equal(
    await evaluate(
      "document.querySelector('.story-menu').getAttribute('aria-expanded')",
    ),
    "true",
  );
  await click('[data-chapter-link][href="#tecnologias"]');
  await chapter("tecnologias");
  assert.equal(
    await evaluate(
      "document.querySelector('.story-menu').getAttribute('aria-expanded')",
    ),
    "false",
  );
  await click('[data-chapter-link][href="#contacto"]');
  await chapter("contacto");
  await command("Page.reload");
  await until(
    () =>
      evaluate(
        "location.hash === '' && window.scrollY === 0 && document.querySelector('.scroll-story')?.dataset.chapter === 'inicio'",
      ),
    "recargar vuelve al inicio",
  );
  assert.equal(
    await evaluate("document.querySelectorAll('.story-travel').length"),
    0,
  );
  await until(
    () =>
      evaluate(
        "document.querySelector('.fusion-bookend-intro .fusion-studio-poster')?.naturalWidth > 0",
      ),
    "escritorio visible desde el inicio",
  );

  for (const [slug, title] of [
    ["seym-soft", "SeymSoft"],
    ["reciclaje", "Clasificador de Reciclaje"],
  ]) {
    for (const width of [320, 768, 1440]) {
      await size(width);
      await page("/projects/" + slug, ".case-intro");
      await until(
        () =>
          evaluate(
            "document.querySelector('.case-capture img')?.naturalWidth > 0",
          ),
        "captura " + slug,
      );
      assert.equal(
        await evaluate("document.querySelector('h1').textContent"),
        title,
      );
      assert.ok(
        await evaluate("document.documentElement.scrollWidth <= innerWidth"),
        "caso " + slug + " a " + width,
      );
    }
  }
  await size(390);
  await page("/projects/reciclaje#demo-reciclaje", "#demo-reciclaje");
  await click('#demo-reciclaje [role="group"] button:nth-child(2)');
  await until(
    () =>
      evaluate(
        "document.querySelector('#demo-reciclaje-flujo strong')?.textContent === 'Vidrio'",
      ),
    "demo en la página del proyecto",
  );
  assert.equal(
    await evaluate(
      "getComputedStyle(document.querySelector('.recycling-demo-steps')).gridTemplateColumns.split(' ').length",
    ),
    2,
  );
  assert.ok(
    await evaluate("document.documentElement.scrollWidth <= innerWidth"),
  );
  await screenshot("reciclaje-demo-movil");
  await media("no-preference");
  await command("Page.addScriptToEvaluateOnNewDocument", {
    source:
      "const real = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function(type, options) { return /webgl/i.test(type) ? null : real.call(this,type,options); };",
  });
  await page("/?fallback=1#contacto", ".fusion-editorial");
  await chapter("contacto");
  await until(
    () =>
      evaluate(
        "document.querySelector('.fusion-bookend-gallery .fusion-studio-poster')?.naturalWidth > 0",
      ),
    "capturas de respaldo",
  );
  assert.equal(await evaluate("document.querySelectorAll('canvas').length"), 0);
  assert.deepEqual(exceptions, []);
  console.log(
    "Chromium: máscaras reversibles, cursor, dos escenas, respaldo y nueve anchos verificados.",
  );
  console.log("Capturas en " + profile);
} finally {
  if (socket?.readyState === WebSocket.OPEN) {
    await Promise.race([command("Browser.close").catch(() => {}), delay(1200)]);
    socket.close();
  }
  if (chrome.exitCode === null) chrome.kill();
  if (server.exitCode === null) server.kill();
}
