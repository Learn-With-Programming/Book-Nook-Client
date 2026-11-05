export default function Spinner({ label = "Loading…", className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-12 ${className}`}>
      <span className="loading loading-spinner loading-lg text-primary" />
      {label && <p className="text-sm text-base-content/60">{label}</p>}
    </div>
  );
}
