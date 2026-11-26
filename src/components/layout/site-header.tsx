"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { scenes } from "@/features/experience/scenes";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  return (
    <header className="site-header">
      <Link href="/" className="wordmark" onClick={() => setOpen(false)}>
        <span>SB</span>
        Sebastian Bedoya
      </Link>
      <button
        className="nav-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="primary-navigation"
        aria-label={open ? "Cerrar navegación" : "Abrir navegación"}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <nav
        id="primary-navigation"
        className={open ? "site-nav is-open" : "site-nav"}
      >
        {scenes.map((item) => (
          <a key={item.id} href={`/#${item.id}`}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
