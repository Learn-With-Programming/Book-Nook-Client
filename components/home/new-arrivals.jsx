"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { booksApi } from "@/lib/api";
import BookCard from "@/components/book-card";
import Spinner from "@/components/spinner";

export default function NewArrivals() {
  const [books, setBooks] = useState(null);

  useEffect(() => {
    let alive = true;
    booksApi
      .list("?limit=6&sort=-addedDate")
      .then((data) => {
        if (alive) setBooks(Array.isArray(data) ? data : (data.books ?? []));
      })
      .catch((err) => {
        if (alive) {
          setBooks([]);
          toast.error(err.message || "Could not load the newest books.");
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!books) return <Spinner label="Fetching the newest arrivals…" />;

  if (books.length === 0) {
    return (
      <div className="py-10 text-center text-base-content/60">
        No books have been added yet — be the first to add one!
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book, index) => (
          <motion.div
            key={book._id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
          >
            <BookCard book={book} />
          </motion.div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link
          href="/books"
          className="btn btn-secondary rounded-full px-8 font-semibold"
        >
          See All Books
        </Link>
      </div>
    </div>
  );
}
