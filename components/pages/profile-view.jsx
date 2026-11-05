"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Spinner from "@/components/spinner";
import SectionHeading from "@/components/section-heading";

export default function ProfileView() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  if (isPending) return <Spinner label="Loading your profile…" />;
  if (!session?.user) return <Spinner label="Loading your profile…" />;

  const user = session.user;

  async function handleLogout() {
    await authClient.signOut();
    toast.success("Logged out. See you soon!");
    router.push("/");
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <SectionHeading
        eyebrow="Your corner"
        title="My Profile"
        subtitle="The card every reader sees when you share or borrow books."
      />

      <div className="card mt-8 overflow-hidden bg-base-100 shadow-lg">
        <div className="h-28 bg-linear-to-r from-primary/70 via-accent/60 to-secondary/70" />
        <div className="-mt-14 flex flex-col items-center gap-4 px-6 pb-8 text-center">
          <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-base-100 bg-base-200 shadow-md">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="h-full w-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-4xl font-bold text-primary">
                {(user.name || "U").charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold">{user.name}</h3>
            <p className="text-sm text-base-content/70">{user.email}</p>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-base-300 bg-base-200/40 p-4">
              <p className="text-xs uppercase tracking-widest text-base-content/50">Role</p>
              <p className="font-display font-semibold">Reader &amp; Librarian</p>
              <p className="mt-1 text-xs text-base-content/60">
                You can add books and borrow them.
              </p>
            </div>
            <div className="rounded-2xl border border-base-300 bg-base-200/40 p-4">
              <p className="text-xs uppercase tracking-widest text-base-content/50">Quick links</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                <Link href="/my-books" className="badge badge-outline hover:badge-secondary">
                  My Books
                </Link>
                <Link href="/my-borrows" className="badge badge-outline hover:badge-secondary">
                  My Borrows
                </Link>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-error mt-2 rounded-full px-8 text-error-content"
          >
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}
