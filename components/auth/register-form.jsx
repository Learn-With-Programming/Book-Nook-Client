"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { GoogleButton } from "@/components/auth/login-form";
import {
  passwordRules,
  validatePassword,
  isValidEmail,
} from "@/lib/validation";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function setField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handlePasswordChange(value) {
    setField("password", value);
    const { valid, errors: failed } = validatePassword(value);
    setErrors((prev) => ({
      ...prev,
      password: valid ? undefined : failed,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = ["Please tell us your name."];
    if (!isValidEmail(form.email))
      nextErrors.email = ["Please enter a valid email address."];
    const passwordCheck = validatePassword(form.password);
    if (!passwordCheck.valid) nextErrors.password = passwordCheck.errors;
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields before registering.");
      return;
    }

    setSubmitting(true);
    const { error } = await authClient.signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      image: form.photoURL.trim() || undefined,
    });
    setSubmitting(false);

    if (error) {
      toast.error(
        error.code === "USER_ALREADY_EXISTS"
          ? "This email is already registered — try logging in instead."
          : error.message || "Registration failed. Please try again.",
      );
      return;
    }
    await authClient.signOut();
    toast.success("Account created! Please log in with your new password.");
    router.push("/login");
  }

  const checklist = passwordRules.map((rule) => ({
    ...rule,
    passed: rule.test(form.password),
  }));

  return (
    <div className="card w-full max-w-md bg-base-100 p-8 shadow-lg">
      <h1 className="font-display text-center text-3xl font-bold">
        Create Account
      </h1>

      <GoogleButton callbackURL="/" />

      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-widest text-base-content/40">
        <span className="h-px flex-1 bg-base-300" />
        or
        <span className="h-px flex-1 bg-base-300" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="text-sm font-medium" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Your full name"
            className={`input input-bordered mt-1 w-full bg-base-200/50 ${
              errors.name ? "input-error" : ""
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-error">{errors.name[0]}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="you@example.com"
            className={`input input-bordered mt-1 w-full bg-base-200/50 ${
              errors.email ? "input-error" : ""
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-error">{errors.email[0]}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium" htmlFor="photoURL">
            Photo URL <span className="text-base-content/50">(optional)</span>
          </label>
          <input
            id="photoURL"
            type="url"
            value={form.photoURL}
            onChange={(e) => setField("photoURL", e.target.value)}
            placeholder="https://example.com/avatar.png"
            className="input input-bordered mt-1 w-full bg-base-200/50"
          />
        </div>

        <div>
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            placeholder="At least 6 characters"
            className={`input input-bordered mt-1 w-full bg-base-200/50 ${
              errors.password ? "input-error" : ""
            }`}
          />

          {/* Live password checklist */}
          <ul className="mt-2 space-y-1">
            {checklist.map((rule) => (
              <li
                key={rule.id}
                className={`flex items-center gap-1.5 text-xs ${
                  rule.passed ? "text-success" : "text-base-content/50"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  aria-hidden="true"
                >
                  {rule.passed ? (
                    <path
                      d="m5 12.5 4.5 4.5L19 7.5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <circle
                      cx="12"
                      cy="12"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  )}
                </svg>
                Must have {rule.label.toLowerCase()}
              </li>
            ))}
          </ul>
          {errors.password && (
            <p className="mt-1 text-xs text-error">
              Password must have: {errors.password.join(", ")}.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary w-full rounded-full font-semibold"
        >
          {submitting ? (
            <span className="loading loading-spinner" />
          ) : (
            "Register"
          )}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-base-content/70">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Login here
        </Link>
      </p>
    </div>
  );
}
