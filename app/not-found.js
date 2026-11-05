import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-2xl flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <span className="font-display text-8xl font-bold text-primary md:text-9xl">404</span>
      <div className="h-1 w-16 rounded-full bg-accent" />
      <h1 className="font-display text-3xl font-bold">This page slipped out of the shelf.</h1>
      <p className="max-w-md text-sm leading-6 text-base-content/70 md:text-base">
        The page you are looking for was moved, removed, renamed — or maybe it was
        borrowed and never returned. Let&apos;s get you back to the good stuff.
      </p>
      <Link href="/" className="btn btn-primary rounded-full px-8 font-semibold">
        Back to Home
      </Link>
    </section>
  );
}
