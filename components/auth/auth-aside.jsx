import Logo from "@/components/logo";

export default function AuthAside() {
  return (
    <div className="relative hidden overflow-hidden rounded-3xl bg-linear-to-br from-[#29303f] via-[#3b3423] to-[#5a3c1e] p-10 text-white lg:flex lg:flex-col lg:justify-between">
      <img
        src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=900&auto=format&fit=crop"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-25"
        loading="eager"
      />
      <Logo compact />
      <div className="relative">
        <h2 className="font-display text-3xl font-bold leading-snug">
          &ldquo;A room without books is like a body without a soul.&rdquo;
        </h2>
        <p className="mt-3 text-sm text-white/70">— Marcus Tullius Cicero</p>
      </div>
      <ul className="relative space-y-2 text-sm text-white/80">
        <li>📚 Borrow books for a few days</li>
        <li>🪶 Share the books from your own shelf</li>
        <li>🔔 Keep every return date in one place</li>
      </ul>
    </div>
  );
}
