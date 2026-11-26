import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found section-shell">
      <p className="eyebrow">404 · Ruta no encontrada</p>
      <h1>Esta pieza no forma parte del sistema.</h1>
      <Link className="primary-link" href="/">
        Volver al inicio
      </Link>
    </main>
  );
}
