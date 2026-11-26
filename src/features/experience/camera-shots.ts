export type Point = [number, number, number];

type Shot = {
  at: number;
  name: string;
  position: Point;
  target: Point;
  fov: number;
};

export const shots: Shot[] = [
  {
    at: 0,
    name: "Plano general del estudio",
    position: [8.6, 6.8, 11.4],
    target: [0.8, 1.05, -0.9],
    fov: 42,
  },
  {
    at: 0.35,
    name: "Aproximación al estudio",
    position: [6.1, 4.5, 8.7],
    target: [0.1, 1.25, -0.9],
    fov: 41,
  },
  {
    at: 0.79,
    name: "Dolly a la estación",
    position: [3.7, 3.1, 5.1],
    target: [0.1, 1.6, -1.1],
    fov: 38,
  },
  {
    at: 1.1,
    name: "Plano medio de los monitores",
    position: [1.5, 2.85, 3.85],
    target: [0, 1.95, -1.3],
    fov: 40,
  },
  {
    at: 1.36,
    name: "Detalle del teclado",
    position: [0.6, 2.28, 1.52],
    target: [-0.12, 1.55, -0.25],
    fov: 35,
  },
  {
    at: 1.66,
    name: "Arco lateral del estudio",
    position: [3.9, 3.05, 2.65],
    target: [0, 1.64, -0.85],
    fov: 41,
  },
  {
    at: 1.91,
    name: "Travelling por el corredor",
    position: [6.2, 2.38, 3.15],
    target: [7.8, 1.45, -1.5],
    fov: 45,
  },
  {
    at: 2.02,
    name: "Revelación del muro tecnológico",
    position: [9.75, 4.2, 5.9],
    target: [11.55, 1.5, -1.55],
    fov: 45,
  },
  {
    at: 2.19,
    name: "Frontend",
    position: [7.9, 2.95, 2.8],
    target: [7.55, 1.55, -1.65],
    fov: 38,
  },
  {
    at: 2.31,
    name: "Backend",
    position: [9.65, 3.05, 2.85],
    target: [9.1, 1.55, -1.65],
    fov: 39,
  },
  {
    at: 2.43,
    name: "Bases de datos",
    position: [11.05, 2.55, 2.75],
    target: [10.65, 1.65, -1.65],
    fov: 38,
  },
  {
    at: 2.55,
    name: "Desarrollo móvil",
    position: [12.7, 2.85, 2.55],
    target: [12.2, 1.5, -1.65],
    fov: 39,
  },
  {
    at: 2.67,
    name: "Herramientas",
    position: [14.2, 2.65, 2.6],
    target: [13.75, 1.55, -1.65],
    fov: 38,
  },
  {
    at: 2.79,
    name: "Inteligencia artificial",
    position: [15.6, 3.15, 2.65],
    target: [15.3, 1.65, -1.65],
    fov: 40,
  },
  {
    at: 2.98,
    name: "Grúa hacia SeymSoft",
    position: [18.1, 5.5, 1.75],
    target: [21.4, 1.5, -6.8],
    fov: 45,
  },
  {
    at: 3.17,
    name: "Plano general de SeymSoft",
    position: [21.8, 5.7, 0.7],
    target: [21.75, 1.48, -7.58],
    fov: 46,
  },
  {
    at: 3.37,
    name: "Captura de la tienda web",
    position: [19.02, 2.72, -2.57],
    target: [19.66, 1.91, -7.1],
    fov: 41,
  },
  {
    at: 3.56,
    name: "Travelling del backend",
    position: [22.1, 3.1, -3.85],
    target: [22.1, 1.8, -7.85],
    fov: 41,
  },
  {
    at: 3.73,
    name: "Datos de operación de SeymSoft",
    position: [25.35, 2.98, -4.15],
    target: [24.3, 1.13, -7.49],
    fov: 38,
  },
  {
    at: 3.83,
    name: "Aplicación móvil de SeymSoft",
    position: [27.0, 3.35, -4.63],
    target: [25.35, 1.43, -8.28],
    fov: 40,
  },
  {
    at: 3.92,
    name: "Plano del sistema conectado",
    position: [26.75, 6.6, -1.25],
    target: [21.55, 1.1, -7.9],
    fov: 43,
  },
  {
    at: 4.12,
    name: "Revelación del laboratorio",
    position: [16.45, 5.75, -10.6],
    target: [12.9, 1.56, -17.28],
    fov: 44,
  },
  {
    at: 4.34,
    name: "Monitor del clasificador",
    position: [10.75, 3.04, -14.25],
    target: [10.35, 1.73, -18.65],
    fov: 42,
  },
  {
    at: 4.54,
    name: "Seguimiento de materiales",
    position: [11.7, 4.68, -11.95],
    target: [13.17, 0.94, -16.75],
    fov: 45,
  },
  {
    at: 4.73,
    name: "Bandejas y diagnóstico",
    position: [11.28, 4.13, -12.98],
    target: [13.85, 0.74, -16.38],
    fov: 43,
  },
  {
    at: 4.95,
    name: "Salida del laboratorio",
    position: [7.1, 5.7, -11.85],
    target: [4.8, 1.1, -6.4],
    fov: 45,
  },
  {
    at: 5.14,
    name: "Corredor de regreso",
    position: [0.85, 4.2, -9.1],
    target: [0, 1.9, -1.6],
    fov: 42,
  },
  {
    at: 5.29,
    name: "Órbita de regreso",
    position: [-6.25, 3.55, -5.9],
    target: [0, 2.05, -1.45],
    fov: 44,
  },
  {
    at: 5.43,
    name: "Detalle de la mesa y la lámpara",
    position: [-3.72, 2.91, 1.48],
    target: [-1.92, 2.04, -1.05],
    fov: 39,
  },
  {
    at: 5.55,
    name: "SeymSoft en pantalla",
    position: [-1.12, 2.87, 1.55],
    target: [-1.23, 2.62, -1.7],
    fov: 36,
  },
  {
    at: 5.65,
    name: "Travelling entre monitores",
    position: [0, 2.96, 1.77],
    target: [0, 2.57, -1.68],
    fov: 40,
  },
  {
    at: 5.76,
    name: "Reciclaje en pantalla",
    position: [1.23, 2.84, 1.55],
    target: [1.04, 2.6, -1.7],
    fov: 36,
  },
  {
    at: 5.89,
    name: "Apertura del plano final",
    position: [1.04, 3.46, 3.57],
    target: [0.05, 2.34, -1.26],
    fov: 41,
  },
  {
    at: 6,
    name: "Los dos proyectos · plano final",
    position: [0.43, 4.28, 6.25],
    target: [-0.14, 2.02, -1.24],
    fov: 43,
  },
];

export function shotAt(progress: number) {
  return Math.max(
    0,
    shots.findLastIndex((shot) => shot.at <= progress),
  );
}

// Hermite timing keeps the curve parameter's velocity continuous across
// keyframes, even when their scroll intervals have different lengths.
export function cameraCurveParameter(index: number, local: number) {
  const last = shots.length - 1;
  if (index >= last) return 1;
  const interval = shots[index + 1].at - shots[index].at;
  const previous = shots[index - 1];
  const following = shots[index + 2];
  const startSpeed = previous
    ? (2 * interval) / (shots[index + 1].at - previous.at)
    : 1;
  const endSpeed = following
    ? (2 * interval) / (following.at - shots[index].at)
    : 1;
  const square = local * local;
  const cube = square * local;
  const fraction =
    3 * square -
    2 * cube +
    (cube - 2 * square + local) * startSpeed +
    (cube - square) * endSpeed;
  return (index + fraction) / last;
}
