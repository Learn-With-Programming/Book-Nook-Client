import SectionHeading from "@/components/section-heading";

const steps = [
  {
    title: "Find a book",
    text: "Browse the shelves or search the newest arrivals. Every card shows the author, the category and who shares it.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Borrow for a few days",
    text: "Open the book details, pick your return date and confirm. The available copies go down by one instantly.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
        <rect x="4" y="3.5" width="16" height="17" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8 7.5h8M8 11h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M9.5 15.5l1.8 1.8 3.4-3.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Return when you're done",
    text: "My Borrows keeps every due date in one table. One click on Return sends the book back and the copies go up again.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
        <path d="M4 12a7.5 7.5 0 0 1 12.8-5.3L20 9.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M20 4.5v5.2h-5.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 12a7.5 7.5 0 0 1-12.8 5.3L4 14.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M4 19.5v-5.2h5.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function HowBorrowingWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      <SectionHeading
        title="How Borrowing Works"
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="relative rounded-2xl border border-base-300 bg-base-100 p-8 text-center shadow-sm"
          >
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-content">
              Step {index + 1}
            </span>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              {step.icon}
            </div>
            <h3 className="font-display mt-4 text-xl font-bold">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-base-content/70">{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
