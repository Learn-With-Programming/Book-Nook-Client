"use client";

import { useState } from "react";
import { toast } from "sonner";
import { uploadToImgbb } from "@/lib/imgbb";
import CategoryPicker from "@/components/category-picker";

export default function EditBookModal({ book, busy, onClose, onSave }) {
  const [form, setForm] = useState({
    title: book.title,
    author: book.author,
    category: book.category,
    image: book.image,
    description: book.description,
    copies: book.copies,
  });
  const [replacingImage, setReplacingImage] = useState(false);

  function setField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Please pick an image smaller than 5 MB.");
      return;
    }
    try {
      setReplacingImage(true);
      const url = await uploadToImgbb(file);
      setField("image", url);
      toast.success("New cover uploaded.");
    } catch (err) {
      toast.error(err.message || "Image upload failed.");
    } finally {
      setReplacingImage(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      ...form,
      copies: Number(form.copies),
    });
  }

  return (
    <div className="modal modal-open" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="modal-box max-w-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          aria-label="Close"
        >
          ✕
        </button>
        <h3 className="font-display text-xl font-bold">Edit “{book.title}”</h3>
        <p className="mt-1 text-sm text-base-content/60">
          Make your changes and save — readers will see the update right away.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Book Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              className="input input-bordered mt-1 w-full bg-base-200"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Author Name</label>
            <input
              required
              value={form.author}
              onChange={(e) => setField("author", e.target.value)}
              className="input input-bordered mt-1 w-full bg-base-200"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <CategoryPicker
              value={form.category}
              onChange={(category) => setField("category", category)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Total Copies</label>
            <input
              type="number"
              required
              min={0}
              value={form.copies}
              onChange={(e) => setField("copies", e.target.value)}
              className="input input-bordered mt-1 w-full bg-base-200"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">
              Cover image{" "}
              <span className="text-base-content/50">
                ({replacingImage ? "uploading…" : "pick a file to replace it"})
              </span>
            </label>
            <div className="mt-1 flex items-center gap-3">
              <img
                src={form.image}
                alt="Current cover"
                className="h-16 w-12 rounded-md object-cover"
                loading="lazy"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="file-input file-input-bordered file-input-sm w-full bg-base-200"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Short Description</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              className="textarea textarea-bordered mt-1 w-full bg-base-200"
            />
          </div>
        </div>

        <div className="modal-action">
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="btn btn-primary rounded-full px-6 font-semibold"
          >
            {busy ? <span className="loading loading-spinner" /> : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
