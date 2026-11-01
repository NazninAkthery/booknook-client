"use client";

import { useEffect, useState } from "react";
import { BookCard } from "@/components/book-card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { apiGet } from "@/lib/api";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
};

export default function AllBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "BookNook | All Books";

    async function loadBooks() {
      try {
        const res = await apiGet("/books");
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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-bold">All Books</h1>
        <p className="text-muted-foreground">
          Explore every title available in BookNook.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : books.length === 0 ? (
        <p className="text-muted-foreground">No books found.</p>
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
    </div>
  );
}
