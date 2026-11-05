import { Suspense } from "react";
import LoginForm from "@/components/auth/login-form";
import AuthAside from "@/components/auth/auth-aside";
import Spinner from "@/components/spinner";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl items-center px-4 py-10">
      <div className="mx-auto grid w-full items-center gap-10 lg:grid-cols-2">
        <AuthAside />
        <Suspense fallback={<Spinner label="Loading login…" />}>
          <LoginForm />
        </Suspense>
      </div>
    </section>
  );
}
