export const siteConfig = {
  name: "Sebastian Bedoya Valencia",
  title: "Desarrollador Full Stack",
  description:
    "Desarrollo aplicaciones web y móviles para digitalizar procesos de negocio.",
  links: {
    github: "https://github.com/s3b4st1an-b3",
    linkedin: null,
    email: null,
    cv: null,
  } satisfies {
    github: string;
    linkedin: string | null;
    email: string | null;
    cv: string | null;
  },
} as const;
