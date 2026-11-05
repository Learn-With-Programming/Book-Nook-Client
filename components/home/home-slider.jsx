"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const slides = [
  {
    image: "/slider/doors.jpg",
    alt: "A cozy library full of books waiting to be read",
    kicker: "A Small Online Library",
    title: "Every shelf is a doorway.",
    text: "BookNook is a cozy corner of the internet where readers share the books they love — and lend them to fellow readers for a few days.",
  },
  {
    image: "/slider/borrow.jpg",
    alt: "An open book being read",
    kicker: "Borrow in three clicks",
    title: "Pick a book. Claim your dates. Read.",
    text: "Found something interesting? Borrow it for a few days, keep track of your return date, and send it back when you're done.",
  },
  {
    image: "/slider/share.jpg",
    alt: "Hands holding a freshly opened book",
    kicker: "Share your library",
    title: "Add your books. Start the lending.",
    text: "Upload the books sitting on your shelf, set how many copies you have, and let the BookNook community borrow them.",
  },
];

export default function HomeSlider() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative" aria-label="BookNook highlights">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        onSlideChange={(swiper) =>
          setActive(swiper.realIndex ?? swiper.activeIndex)
        }
        className="home-slider h-115 w-full md:h-135"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.kicker}>
            <div className="relative h-full w-full overflow-hidden bg-base-300">
              <img
                src={slide.image}
                alt={slide.alt}
                className="h-full w-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div
                className={`absolute inset-0 bg-linear-to-r from-black/85 via-black/55 to-black/20 ${
                  slide.align === "right"
                    ? "lg:from-black/20 lg:via-black/50 lg:to-black/85"
                    : ""
                }`}
              />
              <div
                className={`absolute inset-0 mx-auto flex max-w-7xl flex-col justify-center gap-4 px-6 text-white md:px-10 ${
                  slide.align === "right" ? "lg:items-end" : ""
                }`}
              >
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className={`flex max-w-xl flex-col gap-4 ${
                    slide.align === "right" ? "lg:items-end lg:text-right" : ""
                  }`}
                >
                  <span className="w-fit rounded-full bg-primary px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-content">
                    {slide.kicker}
                  </span>
                  <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
                    {slide.title}
                  </h1>
                  <p className="text-sm leading-7 text-white/85 md:text-base">
                    {slide.text}
                  </p>
                  <Link
                    href="/books"
                    className="btn btn-primary mt-1 w-fit rounded-full px-8 text-base font-semibold"
                  >
                    Browse Books
                  </Link>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
