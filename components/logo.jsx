import { BookOpen } from "lucide-react";

export default function Logo({ compact = false }) {
  return (
    <span className="inline-flex items-center gap-2">
      <BookOpen
        className="h-8 w-8 shrink-0 text-primary"
        strokeWidth={2.2}
        aria-hidden="true"
      />

      <span
        className={`font-display font-bold tracking-tight ${
          compact ? "text-xl" : "text-2xl"
        }`}
      >
        Book<span className="text-primary">Nook</span>
      </span>
    </span>
  );
}
