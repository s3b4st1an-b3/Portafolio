export const scenes = [
  { id: "inicio", label: "Inicio", arrival: 0 },
  {
    id: "sobre-mi",
    label: "Sobre mí",
    arrival: 0.1,
  },
  {
    id: "tecnologias",
    label: "Tecnologías",
    arrival: 0.025,
  },
  {
    id: "seymsoft",
    label: "SeymSoft",
    arrival: 0.17,
  },
  {
    id: "reciclaje",
    label: "Reciclaje",
    arrival: 0.12,
  },
  {
    id: "contacto",
    label: "Contacto",
    arrival: 0.06,
  },
] as const;

type ReadingStop = { beat: number; seconds: number };

export const readingStops: Partial<
  Record<(typeof scenes)[number]["id"], readonly ReadingStop[]>
> = {
  inicio: [{ beat: 0.25, seconds: 0.9 }],
  "sobre-mi": [{ beat: 0.36, seconds: 1.25 }],
  tecnologias: [
    { beat: 0.43, seconds: 1.1 },
    { beat: 0.67, seconds: 0.85 },
  ],
  seymsoft: [{ beat: 0.37, seconds: 1.65 }],
  reciclaje: [
    { beat: 0.34, seconds: 1.7 },
    { beat: 0.76, seconds: 0.75 },
  ],
  contacto: [
    { beat: 0.55, seconds: 1.15 },
    { beat: 0.76, seconds: 1.15 },
  ],
};
