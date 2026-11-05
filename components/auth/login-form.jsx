"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function GoogleButton({ callbackURL }) {
  return (
    <button
      type="button"
      onClick={async () => {
        const { error } = await authClient.signIn.social({
          provider: "google",
          callbackURL,
        });
        if (error) {
          toast.error(
            error.status === 404 || error.status === 400
              ? "Google login isn't configured yet — please use email & password."
              : error.message || "Couldn't start Google login.",
          );
        }
      }}
      className="btn w-full rounded-full border-base-300 bg-base-100 text-base-content hover:border-primary"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M12 10.2v3.9h5.4c-.24 1.4-1.66 4.1-5.4 4.1A6.2 6.2 0 1 1 12 5.8c1.9 0 3.2.8 3.9 1.5l2.7-2.6A9.6 9.6 0 0 0 12 2 10 10 0 1 0 12 22c5.8 0 9.6-4 9.6-9.7 0-.7-.08-1.2-.18-1.7H12Z"
        />
      </svg>
      Continue with Google
    </button>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await authClient.signIn.email({ email, password });
    setSubmitting(false);
    if (error) {
      toast.error(
        error.message?.toLowerCase().includes("invalid")
          ? "Wrong email or password. Please try again."
          : error.message || "Login failed. Please try again.",
      );
      return;
    }
    toast.success("Welcome back — happy reading!");
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="card w-full max-w-md bg-base-100 p-8 shadow-lg">
      <h1 className="font-display text-center text-3xl font-bold">
        Welcome Back
      </h1>

      <GoogleButton callbackURL={redirectTo} />

      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-widest text-base-content/40">
        <span className="h-px flex-1 bg-base-300" />
        or
        <span className="h-px flex-1 bg-base-300" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input input-bordered mt-1 w-full bg-base-200/50"
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <button
              type="button"
              onClick={() =>
                toast.info(
                  "Password reset is coming after the assignment — please use your password for now.",
                )
              }
              className="link-hover link text-xs text-primary"
            >
              Forget password?
            </button>
          </div>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input input-bordered mt-1 w-full bg-base-200/50"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary w-full rounded-full font-semibold"
        >
          {submitting ? <span className="loading loading-spinner" /> : "Login"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-base-content/70">
        New to BookNook?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
