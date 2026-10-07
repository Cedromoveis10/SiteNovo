import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-3xl flex-col justify-center px-5 pt-28 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-display text-5xl tracking-tight">
        Esta página não está na coleção.
      </h1>
      <p className="mt-5 text-muted">
        O endereço pode ter mudado. Volte à coleção ou fale com um especialista.
      </p>
      <div className="mt-10 flex justify-center gap-3">
        <Link href="/produtos" className="btn btn-primary">
          Ver coleção
        </Link>
        <Link href="/" className="btn btn-secondary">
          Home
        </Link>
      </div>
    </div>
  );
}
