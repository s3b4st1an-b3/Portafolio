export type ProjectSlug = "seym-soft" | "reciclaje";

export type Repository = {
  label: string;
  url: string;
  codeUrl?: string;
};

export type Project = {
  slug: ProjectSlug;
  name: string;
  eyebrow: string;
  summary: string;
  context: string;
  role: string;
  demo: string;
  demoAvailable?: false;
  challenge?: string;
  takeaway: string;
  problem: string;
  solution: string;
  technologies: readonly string[];
  architecture: readonly string[];
  features: readonly string[];
  repositories: readonly Repository[];
  accent: "cyan" | "violet";
};
