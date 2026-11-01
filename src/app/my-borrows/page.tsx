"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiGet, apiSend } from "@/lib/api";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Borrow = {
  _id: string;
  bookTitle: string;
  bookImage: string;
  borrowDate: string;
  returnDate: string;
};

export default function MyBorrowsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBorrows = async () => {
    setLoading(true);
    try {
      const res = await apiGet("/borrows", true);
      if (res.ok) {
        const data = await res.json();
        setBorrows(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "BookNook | My Borrows";
    if (!isPending && session) {
      loadBorrows();
    }
  }, [isPending, session]);

  if (isPending || loading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    router.push("/login?redirect=/my-borrows");
    return <LoadingSpinner />;
  }

  const handleReturn = async (id: string) => {
    try {
      const res = await apiSend(`/borrows/${id}`, "DELETE");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to return book");
      }

      toast.success("Book returned successfully");
      setBorrows((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to return book"
      );
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 font-heading text-3xl font-bold">My Borrows</h1>

      {borrows.length === 0 ? (
        <p className="text-muted-foreground">You have not borrowed any books yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Borrow Date</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {borrows.map((borrow) => (
                <TableRow key={borrow._id}>
                  <TableCell>
                    <img
                      src={borrow.bookImage}
                      alt={borrow.bookTitle}
                      className="size-14 rounded object-cover"
                    />
                  </TableCell>
                  <TableCell>{borrow.bookTitle}</TableCell>
                  <TableCell>
                    {new Date(borrow.borrowDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(borrow.returnDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => handleReturn(borrow._id)}>
                      Return Book
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
