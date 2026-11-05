import Link from "next/link";
import SectionHeading from "@/components/section-heading";

const categories = [
  {
    name: "Fiction",
    text: "Novels, short stories and worlds you can live in for a weekend.",
    icon: "🪄",
  },
  {
    name: "Science",
    text: "From star maps to cell biology — books that explain how things work.",
    icon: "🔬",
  },
  {
    name: "History",
    text: "Empires, explorers and ordinary lives from long ago.",
    icon: "🏛️",
  },
  {
    name: "Kids",
    text: "Bedtime stories, picture books and first adventures.",
    icon: "🧸",
  },
  {
    name: "Others",
    text: "Poetry, art, cooking and everything that resists a shelf label.",
    icon: "✨",
  },
];

export default function TopCategories() {
  return (
    <section className="bg-base-200/70 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading title="Top Categories" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.name}
              href="/books"
              className="card card-hover rounded-2xl border border-base-300 bg-base-100 p-6 text-center"
            >
              <span className="text-4xl">{category.icon}</span>
              <h3 className="font-display mt-3 text-lg font-bold">
                {category.name}
              </h3>
              <p className="mt-1 text-xs leading-5 text-base-content/60">
                {category.text}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
