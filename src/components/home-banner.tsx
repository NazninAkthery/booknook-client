"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    title: "Find Your Next Favorite Book",
    text: "Browse a growing shelf of fiction, science, history, and more.",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Borrow in a Few Clicks",
    text: "Pick a title, confirm your borrow, and enjoy reading for a week.",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Share Books With BookNook",
    text: "Add books you love and help other readers discover them.",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1600&q=80",
  },
];

export function HomeBanner() {
  return (
    <section className="w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="h-[420px] w-full md:h-[500px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.title}>
            <div
              className="flex h-full items-center bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${slide.image})`,
              }}
            >
              <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-white">
                <h1 className="font-heading text-3xl font-bold md:text-5xl">
                  {slide.title}
                </h1>
                <p className="max-w-xl text-base md:text-lg">{slide.text}</p>
                <Link
                  href="/books"
                  className={cn(buttonVariants({ size: "lg" }), "w-fit")}
                >
                  Browse Books
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
