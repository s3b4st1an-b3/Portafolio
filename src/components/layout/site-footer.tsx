import Link from "next/link";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>{siteConfig.name}</p>
      <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
        GitHub
      </Link>
    </footer>
  );
}
