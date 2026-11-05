const BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

let cachedToken = null;

async function mintToken() {
  cachedToken = null;
  const res = await fetch("/api/jwt");
  if (!res.ok) {
    let message = "Please log in to continue.";
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    cachedToken = null;
    if (res.status === 401) message = "Please log in to continue.";
    throw new Error(message);
  }
  const data = await res.json();
  cachedToken = data.token;
  return cachedToken;
}

export async function api(
  path,
  { method = "GET", body, auth = false, retry = true } = {},
) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) headers.Authorization = `Bearer ${await mintToken()}`;

  let res = await fetch(BASE + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (auth && res.status === 401 && retry) {
    return api(path, { method, body, auth, retry: false });
  }

  let data = {};
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error(
      data.message || data.error || `Something went wrong (${res.status}).`,
    );
  }
  return data;
}

export const booksApi = {
  list: (query = "") => api(`/books${query}`),

  get: (id) => api(`/books/${encodeURIComponent(id)}`),

  create: (book) => api("/books", { method: "POST", body: book, auth: true }),

  update: (id, changes) =>
    api(`/books/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: changes,
      auth: true,
    }),

  remove: (id) =>
    api(`/books/${encodeURIComponent(id)}`, { method: "DELETE", auth: true }),
};

export const borrowsApi = {
  borrow: (payload) =>
    api("/borrows", { method: "POST", body: payload, auth: true }),

  list: () => api("/borrows", { auth: true }),

  returnBook: (id) =>
    api(`/borrows/${encodeURIComponent(id)}`, { method: "DELETE", auth: true }),
};

export function categories() {
  return ["Fiction", "Science", "History", "Kids", "Others"];
}
