import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "BookNook — A Small Online Library",
    template: "%s | BookNook",
  },
  description:
    "BookNook is a cozy online library. Add a book, borrow a book, return a book — connect with readers and share your shelves.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en" data-scroll-behavior="smooth"
      data-theme="booknook"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-base-100 font-sans text-base-content">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
