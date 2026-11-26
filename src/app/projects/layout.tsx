import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function ProjectsLayout({ children }: LayoutProps<"/projects">) {
  return (
    <>
      <a className="skip-link" href="#contenido-principal">
        Saltar al contenido
      </a>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
