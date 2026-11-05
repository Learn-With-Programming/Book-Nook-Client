import RegisterForm from "@/components/auth/register-form";
import AuthAside from "@/components/auth/auth-aside";

export const metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl items-center px-4 py-10">
      <div className="mx-auto grid w-full items-center gap-10 lg:grid-cols-2">
        <AuthAside />
        <RegisterForm />
      </div>
    </section>
  );
}
