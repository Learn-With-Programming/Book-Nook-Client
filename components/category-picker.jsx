"use client";

import { useEffect, useRef, useState } from "react";
import { categories } from "@/lib/api";

export const categoryDot = {
  Fiction: "bg-primary",
  Science: "bg-info",
  History: "bg-warning",
  Kids: "bg-success",
  Others: "bg-accent",
};

export default function CategoryPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDocumentClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocumentClick);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  function choose(category) {
    onChange(category);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative mt-1">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select a category"
        onClick={() => setOpen((o) => !o)}
        className={`input input-bordered flex w-full items-center justify-between bg-base-100 text-left font-normal ${
          value ? "" : "text-base-content/35"
        }`}
      >
        <span className="flex items-center gap-2">
          {value && (
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${categoryDot[value] || "bg-neutral"}`}
            />
          )}
          {value || "Select a category"}
        </span>
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 shrink-0 text-base-content/60 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          aria-hidden="true"
        >
          <path
            d="m6 9 6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute inset-x-0 top-full z-40 mt-2 max-h-56 overflow-y-auto rounded-xl border border-base-300 bg-base-100 p-1.5 shadow-xl"
        >
          {categories().map((category) => {
            const selected = category === value;
            return (
              <li key={category} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => choose(category)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    selected
                      ? "bg-primary/10 font-semibold text-base-content"
                      : "hover:bg-base-200"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${categoryDot[category]}`}
                  />
                  {category}
                  {selected && (
                    <svg
                      viewBox="0 0 24 24"
                      className="ml-auto h-4 w-4 text-primary"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="m5 13 4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
