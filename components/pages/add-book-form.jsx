"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { booksApi } from "@/lib/api";
import { uploadToImgbb } from "@/lib/imgbb";
import { todayISO } from "@/lib/format";
import SectionHeading from "@/components/section-heading";
import CategoryPicker from "@/components/category-picker";

export default function AddBookForm() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    copies: 1,
  });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // মেমোরি লিক রোধ করতে আগের প্রিভিউ অবজেক্ট ইউআরএল ক্লিনআপ করার ইফেক্ট
  useEffect(() => {
    return () => {
      if (image?.preview) {
        URL.revokeObjectURL(image.preview);
      }
    };
  }, [image]);

  function setField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Please pick an image smaller than 5 MB.");
      e.target.value = "";
      return;
    }
    // পুরোনো প্রিভিউ থাকলে তা রিমুভ করে নতুন প্রিভিউ সেট করা
    if (image?.preview) {
      URL.revokeObjectURL(image.preview);
    }
    setImage({ file, preview: URL.createObjectURL(file) });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.category) {
      toast.error("Please select a category for the book.");
      return;
    }
    if (!image) {
      toast.error("Please upload a cover image for the book.");
      return;
    }
    setSubmitting(true);
    try {
      // ১. ইমেজ আপলোড ও ডাটাবেস সেভ ব্যাকগ্রাউন্ডে প্রসেস হবে
      const imageUrl = await uploadToImgbb(image.file);
      await booksApi.create({
        title: form.title.trim(),
        author: form.author.trim(),
        category: form.category,
        image: imageUrl,
        description: form.description.trim(),
        copies: Number(form.copies),
        addedDate: todayISO(),
        userName: session?.user?.name || "Unknown reader",
        userEmail: session?.user?.email || "",
      });
      toast.success(`"${form.title}" joined the BookNook shelf!`);
      router.push("/books");
    } catch (err) {
      toast.error(err.message || "Could not add the book. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <SectionHeading eyebrow="Share your shelf" title="Add a New Book" />

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-md md:p-8"
      >
        <fieldset className="rounded-2xl border border-base-300/70 bg-base-200/30 p-4">
          <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-primary">
            Your details
          </legend>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium" htmlFor="owner-name">
                User Name
              </label>
              <input
                id="owner-name"
                readOnly
                value={session?.user?.name || ""}
                placeholder="Log in first"
                className="input input-bordered mt-1 w-full bg-base-200"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="owner-email">
                User Email
              </label>
              <input
                id="owner-email"
                readOnly
                value={session?.user?.email || ""}
                placeholder="Log in first"
                className="input input-bordered mt-1 w-full bg-base-200"
              />
            </div>
          </div>
        </fieldset>

        {/* Book details */}
        <fieldset className="rounded-2xl border border-base-300/70 bg-base-200/30 p-4">
          <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-primary">
            Book details
          </legend>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium" htmlFor="title">
                Book Title
              </label>
              <input
                id="title"
                required
                disabled={submitting}
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="e.g. The Midnight Library"
                className="input input-bordered mt-1 w-full bg-base-100 placeholder:text-base-content/35"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="author">
                Author Name
              </label>
              <input
                id="author"
                required
                disabled={submitting}
                value={form.author}
                onChange={(e) => setField("author", e.target.value)}
                placeholder="e.g. Matt Haig"
                className="input input-bordered mt-1 w-full bg-base-100 placeholder:text-base-content/35"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="category">
                Category
              </label>
              <CategoryPicker
                value={form.category}
                onChange={(category) => setField("category", category)}
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="copies">
                Total Copies{" "}
                <span className="text-base-content/50">
                  (1 = only yours to read)
                </span>
              </label>
              <input
                id="copies"
                type="number"
                required
                disabled={submitting}
                min={1}
                step={1}
                value={form.copies}
                onChange={(e) => setField("copies", e.target.value)}
                className="input input-bordered mt-1 w-full bg-base-100"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium" htmlFor="description">
                Short Description
              </label>
              <textarea
                id="description"
                required
                disabled={submitting}
                rows={4}
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="What is this book about? Why would someone love it?"
                className="textarea textarea-bordered mt-1 w-full bg-base-100 placeholder:text-base-content/35"
              />
            </div>
          </div>
        </fieldset>

        {/* Cover image */}
        <fieldset className="rounded-2xl border border-base-300/70 bg-base-200/30 p-4">
          <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-primary">
            Cover image
          </legend>
          <label className="text-sm font-medium" htmlFor="image">
            Book Image{" "}
            <span className="text-base-content/50">(upload to imgbb)</span>
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            required
            disabled={submitting}
            onChange={handleFile}
            className="file-input file-input-bordered mt-1 w-full bg-base-100"
          />
          {image && (
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-base-300 bg-base-100 p-3">
              <img
                src={image.preview}
                alt="Cover preview"
                loading="lazy"
                className="h-20 w-16 rounded-lg object-cover"
              />
              <p className="text-xs text-base-content/60">
                Cover looks good! It will be uploaded to imgbb when you submit.
              </p>
            </div>
          )}
        </fieldset>

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary w-full rounded-full font-semibold md:w-auto md:px-10"
        >
          {submitting ? (
            <>
              <span className="loading loading-spinner" />
              Uploading & saving…
            </>
          ) : (
            "Add Book"
          )}
        </button>
      </form>
    </section>
  );
}