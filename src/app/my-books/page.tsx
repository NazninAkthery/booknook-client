"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiGet, apiSend, uploadToImgbb } from "@/lib/api";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  userEmail: string;
  totalCopies: number;
};

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

export default function MyBooksPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Book | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const loadBooks = async (email: string) => {
    setLoading(true);
    try {
      const res = await apiGet("/books");
      if (res.ok) {
        const data: Book[] = await res.json();
        setBooks(data.filter((book) => book.userEmail === email));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "BookNook | My Books";
    if (!isPending && session?.user?.email) {
      loadBooks(session.user.email);
    }
  }, [isPending, session]);

  if (isPending || loading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    router.push("/login?redirect=/my-books");
    return <LoadingSpinner />;
  }

  const openEdit = (book: Book) => {
    setSelected({ ...book });
    setImageFile(null);
    setEditOpen(true);
  };

  const openDelete = (book: Book) => {
    setSelected(book);
    setDeleteOpen(true);
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    setSaving(true);
    try {
      let image = selected.image;
      if (imageFile) {
        image = await uploadToImgbb(imageFile);
      }

      const res = await apiSend(`/books/${selected._id}`, "PATCH", {
        title: selected.title,
        author: selected.author,
        category: selected.category,
        description: selected.description,
        totalCopies: Number(selected.totalCopies),
        image,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update book");
      }

      toast.success("Book updated successfully");
      setEditOpen(false);
      loadBooks(session.user.email);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update book"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;

    setSaving(true);
    try {
      const res = await apiSend(`/books/${selected._id}`, "DELETE");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete book");
      }

      toast.success("Book deleted successfully");
      setDeleteOpen(false);
      setBooks((prev) => prev.filter((book) => book._id !== selected._id));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete book"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 font-heading text-3xl font-bold">My Books</h1>

      {books.length === 0 ? (
        <p className="text-muted-foreground">You have not added any books yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book._id}>
                  <TableCell>
                    <img
                      src={book.image}
                      alt={book.title}
                      className="size-14 rounded object-cover"
                    />
                  </TableCell>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.category}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => openEdit(book)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDelete(book)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
          {selected && (
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Book Title</Label>
                <Input
                  value={selected.title}
                  onChange={(e) =>
                    setSelected({ ...selected, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Author Name</Label>
                <Input
                  value={selected.author}
                  onChange={(e) =>
                    setSelected({ ...selected, author: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <select
                  id="edit-category"
                  className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm"
                  value={selected.category}
                  onChange={(e) =>
                    setSelected({
                      ...selected,
                      category: e.target.value,
                    })
                  }
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Short Description</Label>
                <Textarea
                  value={selected.description}
                  onChange={(e) =>
                    setSelected({ ...selected, description: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Total Copies</Label>
                <Input
                  type="number"
                  min={0}
                  value={selected.totalCopies}
                  onChange={(e) =>
                    setSelected({
                      ...selected,
                      totalCopies: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Change Image (optional)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Book</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{selected?.title}</span>?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={saving}
            >
              {saving ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
