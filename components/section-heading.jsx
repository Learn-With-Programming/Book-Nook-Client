export default function SectionHeading({ eyebrow, title, subtitle, align = "center" }) {
  const alignClass = align === "left" ? "items-start text-left" : "items-center text-center";
  return (
    <div className={`flex flex-col gap-2 ${alignClass}`}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      <span className="mx-0 mt-1 h-1 w-16 rounded-full bg-primary" />
      {subtitle && (
        <p className="max-w-2xl text-sm leading-6 text-base-content/70 md:text-base">{subtitle}</p>
      )}
    </div>
  );
}
