"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { booksApi, borrowsApi } from "@/lib/api";
import { formatDate, todayISO, addDaysISO } from "@/lib/format";
import Spinner from "@/components/spinner";
import SectionHeading from "@/components/section-heading";

const categoryBadge = {
  Fiction: "badge-primary",
  Science: "badge-info",
  History: "badge-warning",
  Kids: "badge-success",
  Others: "badge-accent",
};

export default function BookDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [book, setBook] = useState(null);
  const [failed, setFailed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [returnDate, setReturnDate] = useState(addDaysISO(7));
  const [borrowing, setBorrowing] = useState(false);

  async function load() {
    try {
      const data = await booksApi.get(id);
      setBook(data);
    } catch (err) {
      toast.error(err.message || "This book could not be found.");
      setFailed(true);
      setTimeout(() => router.push("/books"), 1200);
    }
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await booksApi.get(id);
        if (alive) setBook(data);
      } catch (err) {
        if (!alive) return;
        toast.error(err.message || "This book could not be found.");
        setFailed(true);
        setTimeout(() => router.push("/books"), 1200);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, router]);

  // Optimistic Update for Borrowing Books
  async function confirmBorrow(e) {
    e.preventDefault();
    if (!session) return;

    // ১. সার্ভার রেসপন্সের অপেক্ষা না করে তাৎক্ষণিকভাবে লোকাল স্টেটের কপি ১টি কমিয়ে দেওয়া হলো (Optimistic Update)
    const previousBookState = book;
    setBook((prev) => ({
      ...prev,
      copies: Number(prev.copies) - 1,
    }));

    // ২. সাথে সাথে মোডাল বন্ধ করে দেওয়া হলো যাতে ইউজার কোনো ল্যাগ ফিল না করে
    setShowModal(false);
    setBorrowing(true);

    try {
      // ৩. ব্যাকগ্রাউন্ডে সার্ভারে রিকোয়েস্ট পাঠানো হচ্ছে
      await borrowsApi.borrow({
        bookId: book._id,
        bookTitle: book.title,
        bookImage: book.image,
        userEmail: session.user.email,
        borrowDate: todayISO(),
        returnDate,
      });
      toast.success(
        `"${book.title}" is yours until ${formatDate(returnDate)}!`,
      );
    } catch (err) {
      // যদি সার্ভারে কোনো এরর হয়, তবে আগের সঠিক ডেটা ফিরিয়ে আনা হবে
      setBook(previousBookState);
      toast.error(err.message || "Borrowing failed. Please try again.");
    } finally {
      setBorrowing(false);
    }
  }

  if (failed) return <Spinner label="Hmm — taking you back to the shelves…" />;
  if (!book) return <Spinner label="Opening the book…" />;

  const soldOut = Number(book.copies) <= 0;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <SectionHeading eyebrow="Book details" title={book.title} align="left" />

      <div className="mt-8 grid gap-10 md:grid-cols-[2fr_3fr]">
        {/* Cover */}
        <motion.figure
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-base-300 bg-base-200 shadow-lg"
        >
          <img
            src={book.image}
            alt={`Cover of ${book.title}`}
            className="aspect-4/5 w-full object-cover"
            loading="lazy"
          />
          <span
            className={`badge absolute right-4 top-4 border-0 shadow ${
              categoryBadge[book.category] || "badge-neutral"
            }`}
          >
            {book.category}
          </span>
        </motion.figure>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-5"
        >
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              {book.title}
            </h2>
            <p className="mt-1 text-lg text-base-content/70">
              by {book.author}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <span className="badge badge-outline badge-lg">
              <strong className={soldOut ? "text-error" : "text-success"}>
                {soldOut
                  ? "Not Available"
                  : `${book.copies} cop${book.copies === 1 ? "y" : "ies"} available`}
              </strong>
            </span>
            <span className="badge badge-outline badge-lg">
              Added {formatDate(book.addedDate)}
            </span>
          </div>

          <p className="leading-7 text-base-content/80">{book.description}</p>

          <div className="rounded-2xl border border-base-300 bg-base-200/40 p-4 text-sm">
            <p className="font-semibold">Shared by</p>
            <p className="mt-1 text-base-content/70">
              {book.userName || "A BookNook reader"}
              {book.userEmail ? ` · ${book.userEmail}` : ""}
            </p>
          </div>

          <div className="mt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setShowModal(true)}
              disabled={soldOut}
              className={`btn btn-primary rounded-full px-8 font-semibold ${
                soldOut ? "" : ""
              }`}
              title={soldOut ? "All copies are currently borrowed" : undefined}
            >
              {soldOut ? "Not Available" : "Borrow This Book"}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Borrow modal */}
      {showModal && (
        <div className="modal modal-open" onClick={() => setShowModal(false)}>
          <form
            onSubmit={confirmBorrow}
            onClick={(e) => e.stopPropagation()}
            className="modal-box"
          >
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              aria-label="Close"
            >
              ✕
            </button>
            <h3 className="font-display text-xl font-bold">Borrow this book</h3>
            <p className="mt-1 text-sm text-base-content/60">
              {book.title} — it will be due back on your chosen date.
            </p>

            <div className="mt-5 space-y-3 text-sm">
              <label className="form-control">
                <span className="mb-1 font-medium">Borrower name</span>
                <input
                  readOnly
                  value={session?.user?.name || ""}
                  className="input input-bordered w-full bg-base-200/50"
                />
              </label>
              <label className="form-control">
                <span className="mb-1 font-medium">Email</span>
                <input
                  readOnly
                  value={session?.user?.email || ""}
                  className="input input-bordered w-full bg-base-200/50"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="form-control">
                  <span className="mb-1 font-medium">Borrow date</span>
                  <input
                    readOnly
                    value={formatDate(todayISO())}
                    className="input input-bordered w-full bg-base-200/50"
                  />
                </label>
                <label className="form-control">
                  <span className="mb-1 font-medium">Return date</span>
                  <input
                    type="date"
                    required
                    min={todayISO()}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="input input-bordered w-full bg-base-200/50"
                  />
                </label>
              </div>
            </div>

            <div className="modal-action">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={borrowing}
                className="btn btn-primary rounded-full px-6 font-semibold"
              >
                {borrowing ? "Borrowing…" : "Confirm Borrow"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}