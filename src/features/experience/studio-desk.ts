import type { ProjectSlug } from "@/types/portfolio";

export type DeskTarget = ProjectSlug | "lamp" | "phone";
export type DeskExhibit = {
  slug: ProjectSlug;
  mobileModule?: true;
};

export const deskTargetNames: Record<DeskTarget, string> = {
  "seym-soft": "Abrir captura de SeymSoft",
  reciclaje: "Abrir captura de Reciclaje",
  lamp: "Cambiar luz del estudio",
  phone: "Explorar la app móvil de SeymSoft",
};

export const monitorCues: Record<ProjectSlug, number> = {
  "seym-soft": 5.41,
  reciclaje: 5.625,
};

export function deskTargetVisible(target: DeskTarget, time: number) {
  if (target === "lamp" || target === "phone")
    return time < 1.91 || time >= 5.32;
  return time >= monitorCues[target] + 0.07;
}
