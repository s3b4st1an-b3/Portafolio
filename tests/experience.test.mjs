import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

function loadModule(path) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  return import(
    "data:text/javascript;base64," + Buffer.from(outputText).toString("base64")
  );
}

const [
  { getProject, projects },
  { technologies },
  { siteConfig },
  { scenes },
  { sectionAt, scrollProgress },
  { shots, shotAt, cameraCurveParameter },
  { createPlayhead },
] = await Promise.all([
  loadModule("../src/data/projects.ts"),
  loadModule("../src/data/technologies.ts"),
  loadModule("../src/config/site.ts"),
  loadModule("../src/features/experience/scenes.ts"),
  loadModule("../src/features/experience/scroll-math.ts"),
  loadModule("../src/features/experience/camera-shots.ts"),
  loadModule("../src/features/experience/playhead.ts"),
]);

test("each chapter retains its deep link in reading order", () => {
  assert.deepEqual(
    scenes.map(({ id }) => id),
    ["inicio", "sobre-mi", "tecnologias", "seymsoft", "reciclaje", "contacto"],
  );
});

test("the active chapter follows the document reading line in both directions", () => {
  assert.equal(sectionAt([-950, -400, 400, 950], 425), 2);
  assert.equal(sectionAt([-600, -50, 750, 1300], 425), 1);
  assert.equal(sectionAt([500, 900], 425), 0);
});

test("scroll progress interpolates between boundaries and clamps overscroll", () => {
  assert.equal(scrollProgress(100, 500, 0), 0);
  assert.equal(scrollProgress(100, 500, 300), 0.5);
  assert.equal(scrollProgress(100, 500, 900), 1);
  assert.equal(scrollProgress(200, 200, 199), 0);
  assert.equal(scrollProgress(200, 200, 200), 1);
});

test("published content resolves to the supplied projects and contact information", () => {
  assert.equal(siteConfig.name, "Sebastian Bedoya Valencia");
  assert.equal(new URL(siteConfig.links.github).hostname, "github.com");
  assert.equal(technologies.length, 6);
  assert.equal(technologies.flatMap(({ tools }) => tools).length, 17);
  assert.equal(getProject("seym-soft").repositories.length, 3);
  assert.equal(getProject("reciclaje").repositories.length, 1);
  assert.equal(getProject("desconocido"), undefined);
  for (const project of projects)
    assert.equal(new URL(project.demo).protocol, "https:");
});

test("the same progress selects the same shot when travelling forwards and backwards", () => {
  assert.equal(shots[0].at, 0);
  assert.equal(shots.at(-1).at, 6);
  assert.ok(
    shots.every((shot, index) => !index || shot.at > shots[index - 1].at),
  );
  const times = [0, 1.4, 2.4, 3.6, 4.7, 5.5, 6];
  assert.deepEqual(
    times.map(shotAt),
    times.toReversed().map(shotAt).toReversed(),
  );
});

test("the playhead invalidates only when its position changes", () => {
  const playhead = createPlayhead();
  const observed = [];
  const detach = playhead.subscribe(() => observed.push(playhead.read()));
  playhead.write(1.8);
  playhead.write(1.8);
  playhead.write(0.4);
  detach();
  playhead.write(2.1);
  assert.deepEqual(observed, [1.8, 0.4]);
});

test("camera timing reaches each authored pose without a speed reset", () => {
  const h = 0.00001;
  for (let i = 1; i < shots.length - 1; i++) {
    const knot = cameraCurveParameter(i, 0);
    assert.equal(knot, cameraCurveParameter(i - 1, 1));
    const left =
      (knot - cameraCurveParameter(i - 1, 1 - h)) /
      (h * (shots[i].at - shots[i - 1].at));
    const right =
      (cameraCurveParameter(i, h) - knot) /
      (h * (shots[i + 1].at - shots[i].at));
    assert.ok(Math.abs(left - right) < 0.0001);
  }
});
