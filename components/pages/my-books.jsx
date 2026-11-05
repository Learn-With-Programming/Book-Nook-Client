"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { booksApi } from "@/lib/api";
import { formatDate } from "@/lib/format";
import Spinner from "@/components/spinner";
import SectionHeading from "@/components/section-heading";
import ConfirmModal from "@/components/confirm-modal";
import EditBookModal from "@/components/pages/edit-book-modal";

export default function MyBooks() {
  const { data: session, isPending } = authClient.useSession();

  const [books, setBooks] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  async function load() {
    if (!session?.user?.email) return;

    try {
      const data = await booksApi.list(
        `?email=${encodeURIComponent(session.user.email)}`,
      );

      setBooks(Array.isArray(data) ? data : (data.books ?? []));
    } catch (err) {
      toast.error(err.message || "Could not load your books.");
    }
  }

  useEffect(() => {
    if (!session?.user?.email) return;

    let alive = true;

    (async () => {
      try {
        const data = await booksApi.list(
          `?email=${encodeURIComponent(session.user.email)}`,
        );

        if (alive) {
          setBooks(Array.isArray(data) ? data : (data.books ?? []));
        }
      } catch (err) {
        if (!alive) return;

        setBooks([]);
        toast.error(err.message || "Could not load your books.");
      }
    })();

    return () => {
      alive = false;
    };
  }, [session?.user?.email]);

  async function handleSave(changes) {
    setSaving(true);
    const updatedBookId = editing._id;

    setBooks((prevBooks) =>
      prevBooks
        ? prevBooks.map((b) =>
            b._id === updatedBookId ? { ...b, ...changes } : b,
          )
        : [],
    );

    try {
      await booksApi.update(updatedBookId, changes);
      toast.success("Book updated successfully!");
      setEditing(null);
    } catch (err) {
      toast.error(err.message || "Update failed. Please try again.");
      await load();
    } finally {
      setSaving(false);
    }
  }

  // 2. Optimistic Update for Deleting
  async function handleDelete() {
    if (!deleting) return;

    const bookIdToRemove = deleting._id;
    const deletingBookTitle = deleting.title;

    setBooks((prevBooks) =>
      prevBooks ? prevBooks.filter((b) => b._id !== bookIdToRemove) : [],
    );

    setDeleting(null);
    setDeletingBusy(true);

    try {
      await booksApi.remove(bookIdToRemove);
      toast.success(`"${deletingBookTitle}" was removed from the shelves.`);
    } catch (err) {
      if (err.message && err.message !== "book not found") {
        toast.error(err.message || "Delete failed. Please try again.");
        await load();
      }
    } finally {
      setDeletingBusy(false);
    }
  }

  if (isPending) {
    return <Spinner label="Checking your session…" />;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <SectionHeading eyebrow="Your shelf" title="My Books" />

      <div className="mt-10">
        {!books ? (
          <Spinner label="Collecting your books…" />
        ) : books.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-base-300 py-16 text-center text-base-content/60">
            You haven&apos;t added any books yet.{" "}
            <Link
              href="/add-book"
              className="font-semibold text-primary hover:underline"
            >
              Add your first book
            </Link>
            !
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-base-300 shadow-sm">
            <table className="table">
              <thead>
                <tr className="bg-base-200/70 text-sm text-base-content/70">
                  <th>Book</th>
                  <th>Category</th>
                  <th>Copies</th>
                  <th>Added</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-base-200/40">
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={book.image}
                          alt={`Cover of ${book.title}`}
                          className="h-16 w-12 rounded-md object-cover"
                          loading="lazy"
                        />

                        <div className="min-w-0">
                          <p className="font-display font-semibold">
                            <Link
                              href={`/books/${book._id}`}
                              className="hover:text-primary"
                            >
                              {book.title}
                            </Link>
                          </p>

                          <p className="truncate text-xs text-base-content/60">
                            by {book.author}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-outline">
                        {book.category}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`font-semibold ${
                          Number(book.copies) <= 0
                            ? "text-error"
                            : "text-success"
                        }`}
                      >
                        {book.copies}
                      </span>
                    </td>

                    <td className="whitespace-nowrap text-sm text-base-content/70">
                      {formatDate(book.addedDate)}
                    </td>

                    <td>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditing(book)}
                          className="btn btn-sm btn-secondary rounded-full"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setDeleting(book)}
                          className="btn btn-sm btn-error rounded-full"
                        >
                          Delete
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

      {/* Edit Book Modal */}
      {editing && (
        <EditBookModal
          book={editing}
          busy={saving}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      <ConfirmModal
        open={Boolean(deleting)}
        busy={deletingBusy}
        title="Delete this book?"
        message={
          deleting
            ? `"${deleting.title}" will be removed from the library and from reader shelves everywhere. This can't be undone.`
            : ""
        }
        confirmLabel="Yes, delete it"
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
}
