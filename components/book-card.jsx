import Link from "next/link";

const categoryBadge = {
  Fiction: "badge-primary",
  Science: "badge-info",
  History: "badge-warning",
  Kids: "badge-success",
  Others: "badge-accent",
};

export default function BookCard({ book }) {
  return (
    <article className="card card-hover group overflow-hidden bg-base-100 shadow-md">
      <figure className="relative aspect-4/5 overflow-hidden bg-base-200">
        <img
          src={book.image}
          alt={`Cover of ${book.title}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <span
          className={`badge absolute right-3 top-3 border-0 shadow ${
            categoryBadge[book.category] || "badge-neutral"
          }`}
        >
          {book.category}
        </span>
      </figure>

      <div className="card-body gap-2 p-5">
        <h3 className="font-display text-lg font-bold leading-snug">{book.title}</h3>
        <p className="text-sm text-base-content/70">by {book.author}</p>
        <div className="card-actions mt-2">
          <Link
            href={`/books/${book._id}`}
            className="btn btn-primary btn-sm w-full rounded-full"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
