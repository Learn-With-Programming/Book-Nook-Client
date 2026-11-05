"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { booksApi } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import BookCard from "@/components/book-card";
import SectionHeading from "@/components/section-heading";
import Spinner from "@/components/spinner";

export default function AllBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    let alive = true;
    booksApi
      .list()
      .then((data) => {
        if (alive) {
          setBooks(Array.isArray(data) ? data : (data.books ?? []));
        }
      })
      .catch((err) => {
        if (alive) {
          setBooks([]);
          toast.error(err.message || "Could not load the books.");
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <SectionHeading eyebrow="The whole shelf" title="All Books" />

      <div className="mt-10">
        {loading ? (
          <Spinner label="Organizing the shelves…" />
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-base-300 bg-base-200/40 px-6 py-20 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
                />
              </svg>
            </div>

            <h3 className="mb-2 text-2xl font-semibold text-base-content">
              No Books Yet
            </h3>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
