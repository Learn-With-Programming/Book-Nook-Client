"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { borrowsApi } from "@/lib/api";
import { formatDate } from "@/lib/format";
import Spinner from "@/components/spinner";
import SectionHeading from "@/components/section-heading";
import ConfirmModal from "@/components/confirm-modal";

export default function MyBorrows() {
  const { data: session, isPending } = authClient.useSession();
  const [borrows, setBorrows] = useState(null);
  const [returning, setReturning] = useState(null);
  const [returningBusy, setReturningBusy] = useState(false);

  async function load() {
    try {
      const now = Date.now();
      const data = await borrowsApi.list();
      const rows = (Array.isArray(data) ? data : (data.borrows ?? [])).map(
        (borrow) => ({
          ...borrow,
          overdue: new Date(borrow.returnDate).getTime() < now,
        }),
      );
      setBorrows(rows);
    } catch (err) {
      setBorrows([]);
      toast.error(err.message || "Could not load your borrowed books.");
    }
  }

  useEffect(() => {
    if (!session?.user?.email) return;
    let alive = true;
    (async () => {
      try {
        const now = Date.now();
        const data = await borrowsApi.list();
        if (!alive) return;
        const rows = (Array.isArray(data) ? data : (data.borrows ?? [])).map(
          (borrow) => ({
            ...borrow,
            overdue: new Date(borrow.returnDate).getTime() < now,
          }),
        );
        setBorrows(rows);
      } catch (err) {
        if (!alive) return;
        setBorrows([]);
        toast.error(err.message || "Could not load your borrowed books.");
      }
    })();
    return () => {
      alive = false;
    };
  }, [session?.user?.email]);

  // Optimistic Update for Returning Books
  async function handleReturn() {
    if (!returning) return;

    const borrowIdToRemove = returning._id || returning.borrowId;
    const returningBookTitle = returning.bookTitle;

    setBorrows((prevBorrows) =>
      prevBorrows
        ? prevBorrows.filter((b) => (b._id || b.borrowId) !== borrowIdToRemove)
        : [],
    );

    setReturning(null);
    setReturningBusy(true);

    try {
      await borrowsApi.returnBook(borrowIdToRemove);
      toast.success(`"${returningBookTitle}" is back on the shelf. Thanks!`);
    } catch (err) {
      toast.error(err.message || "Return failed. Please try again.");
      await load();
    } finally {
      setReturningBusy(false);
    }
  }

  if (isPending) return <Spinner label="Checking your session…" />;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <SectionHeading eyebrow="On your desk" title="My Borrows" />

      <div className="mt-10">
        {!borrows ? (
          <Spinner label="Checking the ledger…" />
        ) : borrows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-base-300 py-16 text-center text-base-content/60">
            Nothing borrowed yet —{" "}
            <Link
              href="/books"
              className="font-semibold text-primary hover:underline"
            >
              browse the shelves
            </Link>{" "}
            and pick your next read!
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-base-300 shadow-sm">
            <table className="table">
              <thead>
                <tr className="bg-base-200/70 text-sm text-base-content/70">
                  <th>Book</th>
                  <th>Borrowed</th>
                  <th>Return by</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {borrows.map((borrow) => (
                  <tr
                    key={borrow._id || borrow.borrowId}
                    className="hover:bg-base-200/40"
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={borrow.bookImage}
                          alt={`Cover of ${borrow.bookTitle}`}
                          className="h-16 w-12 rounded-md object-cover"
                          loading="lazy"
                        />
                        <p className="font-display font-semibold">
                          <Link
                            href={`/books/${borrow.bookId}`}
                            className="hover:text-primary"
                          >
                            {borrow.bookTitle}
                          </Link>
                        </p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap text-sm text-base-content/70">
                      {formatDate(borrow.borrowDate)}
                    </td>
                    <td className="whitespace-nowrap text-sm">
                      <span
                        className={
                          borrow.overdue
                            ? "font-semibold text-error"
                            : "text-base-content/70"
                        }
                      >
                        {formatDate(borrow.returnDate)}
                        {borrow.overdue && " · overdue"}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-end">
                        <button
                          onClick={() => setReturning(borrow)}
                          className="btn btn-sm btn-secondary rounded-full"
                        >
                          Return Book
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        open={Boolean(returning)}
        busy={returningBusy}
        title="Return this book?"
        message={
          returning
            ? `"${returning.bookTitle}" goes back to the shelf and its copies increase by one.`
            : ""
        }
        confirmLabel="Yes, return it"
        onCancel={() => setReturning(null)}
        onConfirm={handleReturn}
      />
    </section>
  );
}
