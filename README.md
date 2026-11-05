# Website Name : BookNook — A Small Online Library

# Website live site URL : https://book-nook-client-amber.vercel.app/

# Website Features :

# 1. Cinematic Swiper hero — a 3-slide fading slider ("Every shelf is a doorway",

"Borrow in three clicks", "Share your library"), each slide linking straight to the
book shelves.

# 2. Dynamic New Arrivals — the 6 most recently added books are loaded from MongoDB

(server-side sort + limit) as equal-height cards with author, category badge and
a View Details action, plus a "See All Books" button.

# 3. Full book lifecycle — add books with an imgbb cover upload and a Total Copies

counter, edit them via a pre-filled modal, and delete them behind a custom confirm
dialog (never the browser's) — all behind JWT-protected API calls.

# 4. Borrow & return system — one click opens the borrow modal with your read-only

identity and a return date; borrowed books live in a tidy My Borrows table with
overdue highlighting and one-click returns. Copies automatically dip and restore,
and "Not Available" locks the borrow button at 0 copies.

# 5. BetterAuth + Google sign-in — email/password registration with a live password

checklist (uppercase, lowercase, min 6 characters), Google social login, session
cookies that survive reloads (no login-ping-pong on refresh), and smart
?redirect= handling for private routes.

Cozy-reading-nook design, dark mode included — custom parchment/ink/amber
daisyUI themes with serif display headings, subtle Framer-Motion entrances, a fully
responsive layout from mobile to desktop, and toasts (never alert()) for every
success and error.

Every page speaks — per-route page titles ("BookNook | All Books"), loading
spinners for every fetch, a quote-panel login/register split, your profile card,
and a custom 404 with a way back home.
