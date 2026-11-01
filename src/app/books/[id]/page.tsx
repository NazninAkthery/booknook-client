"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiGet, apiSend } from "@/lib/api";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  userName: string;
  userEmail: string;
  totalCopies: number;
};

export default function BookDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    document.title = "BookNook | Book Details";

    async function loadBook() {
      try {
        const res = await apiGet(`/books/${id}`, true);
        if (!res.ok) {
          toast.error("Failed to load book");
          return;
        }
        const data = await res.json();
        setBook(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (!isPending && session) {
      loadBook();
    }
  }, [id, isPending, session]);

  if (isPending || loading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    router.push(`/login?redirect=/books/${id}`);
    return <LoadingSpinner />;
  }

  if (!book) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p>Book not found.</p>
      </div>
    );
  }

  const handleBorrow = async (e: FormEvent) => {
    e.preventDefault();
    setBorrowing(true);

    try {
      const res = await apiSend("/borrows", "POST", {
        bookId: book._id,
        bookTitle: book.title,
        bookImage: book.image,
        userEmail: session.user.email,
        userName: session.user.name,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to borrow book");
      }

      toast.success("Book borrowed successfully");
      setOpen(false);
      router.push("/my-borrows");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to borrow book"
      );
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
      <div className="overflow-hidden rounded-xl border bg-muted">
        <img
          src={book.image}
          alt={book.title}
          className="aspect-[3/4] w-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="font-heading text-3xl font-bold">{book.title}</h1>
        <p className="text-lg text-muted-foreground">by {book.author}</p>
        <Badge className="w-fit" variant="secondary">
          {book.category}
        </Badge>
        <p>{book.description}</p>
        <p className="text-sm text-muted-foreground">
          Added by {book.userName} ({book.userEmail})
        </p>
        <p className="text-sm">Available copies: {book.totalCopies}</p>

        {book.totalCopies <= 0 ? (
          <Button disabled>Not Available</Button>
        ) : (
          <Button onClick={() => setOpen(true)}>Borrow This Book</Button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Borrow</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBorrow} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>User Name</Label>
              <Input readOnly value={session.user.name || ""} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input readOnly value={session.user.email || ""} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={borrowing}>
                {borrowing ? "Borrowing..." : "Confirm Borrow"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
