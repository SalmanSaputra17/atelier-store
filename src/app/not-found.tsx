import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="flex flex-1 items-center">
      <div className="container-prose section text-center">
        <p className="label-caps text-ink-muted">404</p>
        <h1 className="mt-3 text-title">Page not found</h1>
        <p className="mt-5 text-body-lg text-ink-muted">
          The page you&rsquo;re looking for has moved or no longer exists.
        </p>
        <Link href="/" className="btn btn-secondary mt-10">
          Return home
        </Link>
      </div>
    </main>
  );
}
