"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Clock3, RefreshCcw, Sparkles } from "lucide-react";
import { HomeBanner } from "@/components/home-banner";
import { BookCard } from "@/components/book-card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { buttonVariants } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import { cn } from "@/lib/utils";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
};

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "BookNook | Home";

    async function loadBooks() {
      try {
        const res = await apiGet("/books?limit=6");
        if (res.ok) {
          const data = await res.json();
          setBooks(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  return (
    <div>
      <HomeBanner />

      <section className="mx-auto max-w-6xl px-4 py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex flex-col gap-2"
        >
          <h2 className="font-heading text-3xl font-bold">New Arrivals</h2>
          <p className="text-muted-foreground">
            The newest books added to BookNook.
          </p>
        </motion.div>

        {loading ? (
          <LoadingSpinner />
        ) : books.length === 0 ? (
          <p className="text-muted-foreground">No books yet. Be the first to add one!</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard
                key={book._id}
                id={book._id}
                title={book.title}
                author={book.author}
                category={book.category}
                image={book.image}
              />
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Link href="/books" className={cn(buttonVariants({ size: "lg" }))}>
            See All Books
          </Link>
        </div>
      </section>

      <section className="bg-muted/40 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 flex flex-col gap-2"
          >
            <h2 className="font-heading text-3xl font-bold">How Borrowing Works</h2>
            <p className="text-muted-foreground">
              Three simple steps from shelf to reading chair.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: BookOpen,
                title: "Browse",
                text: "Explore all books and open a title you like.",
              },
              {
                icon: Clock3,
                title: "Borrow",
                text: "Confirm your borrow and keep the book for 7 days.",
              },
              {
                icon: RefreshCcw,
                title: "Return",
                text: "Return from My Borrows when you are done reading.",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-xl border bg-background p-6"
              >
                <item.icon className="mb-3 text-primary" />
                <h3 className="font-heading text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex flex-col gap-2"
        >
          <h2 className="font-heading text-3xl font-bold">Top Categories</h2>
          <p className="text-muted-foreground">
            Popular shelves our readers visit most.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {["Fiction", "Science", "History", "Kids", "Others"].map((category) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 rounded-xl border p-5"
            >
              <Sparkles className="text-primary" />
              <span className="font-medium">{category}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
