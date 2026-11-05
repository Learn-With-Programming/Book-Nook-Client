"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Logo from "@/components/logo";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
];

const privateLinks = [
  { href: "/add-book", label: "Add Book" },
  { href: "/my-books", label: "My Books" },
  { href: "/my-borrows", label: "My Borrows" },
];

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onDocumentClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    }
    function onEscape(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocumentClick);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  const links = session ? [...publicLinks, ...privateLinks] : publicLinks;

  async function handleLogout() {
    await authClient.signOut();
    toast.success("You have been logged out. See you soon!");
    router.push("/");
  }

  function linkClass(href) {
    const active = pathname === href;
    return `rounded-full px-3 py-2 text-sm font-medium transition-colors ${
      active
        ? "bg-primary text-primary-content"
        : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
    }`;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-base-300/60 bg-base-100/85 backdrop-blur">
      <nav className="navbar mx-auto max-w-7xl px-2 md:px-4">
        {/* Logo zone */}
        <div className="navbar-start">
          <Link
            href="/"
            className="flex items-center"
            aria-label="BookNook home"
          >
            <Logo />
          </Link>
        </div>

        <div className="navbar-center hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-end gap-1">
          {isPending ? (
            <span
              className="loading loading-spinner text-primary"
              aria-label="Loading session"
            />
          ) : session ? (
            <div className="dropdown dropdown-end">
              <button
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar"
                aria-label="Open user menu"
              >
                <div className="w-10 rounded-full ring-2 ring-primary/60">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="flex items-center justify-center text-lg font-semibold">
                      {(session.user.name || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </button>
              <ul
                tabIndex={0}
                className="menu dropdown-content z-50 mt-2 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
              >
                <li className="pointer-events-none items-stretch px-2 py-1.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {session.user.name}
                    </p>
                    <p className="truncate text-xs text-base-content/60">
                      {session.user.email}
                    </p>
                  </div>
                </li>
                <li className="pointer-events-none">
                  <hr className="my-1 border-base-300" />
                </li>
                <li>
                  <Link href="/profile">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        cx="12"
                        cy="8"
                        r="3.5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />
                      <path
                        d="M5 19c1.5-3 4-4.4 7-4.4S17.5 16 19 19"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />
                    </svg>
                    My Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="justify-start text-error"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M14 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7M10 12h9m0 0-3-3m3 3-3 3"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="hidden gap-2 sm:flex">
              <Link href="/login" className="btn btn-ghost rounded-full px-5">
                Login
              </Link>
              <Link
                href="/register"
                className="btn btn-primary rounded-full px-5"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="btn btn-ghost btn-circle lg:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute inset-x-0 top-full border-b border-base-300 bg-base-100 p-4 shadow-lg lg:hidden"
        >
          <div className="divider mt-0 before:text-base-300 after:text-base-300" />
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${linkClass(link.href)} block`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {!session && (
              <li className="mt-2 flex gap-2">
                <Link
                  href="/login"
                  className="btn btn-ghost flex-1"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn btn-primary flex-1"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
