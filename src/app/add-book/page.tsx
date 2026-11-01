"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiSend, uploadToImgbb } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/loading-spinner";

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

export default function AddBookPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Fiction");
  const [description, setDescription] = useState("");
  const [totalCopies, setTotalCopies] = useState("1");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "BookNook | Add Book";
  }, []);

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (!session) {
    router.push("/login?redirect=/add-book");
    return <LoadingSpinner />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please choose a book image");
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadToImgbb(imageFile);

      const res = await apiSend("/books", "POST", {
        title,
        author,
        category,
        image: imageUrl,
        description,
        totalCopies: Number(totalCopies),
        userName: session.user.name,
        userEmail: session.user.email,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to add book");
      }

      toast.success("Book added successfully");
      router.push("/my-books");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 font-heading text-3xl font-bold">Add Book</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border p-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Book Title</Label>
          <Input
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="author">Author Name</Label>
          <Input
            id="author"
            required
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="image">Book Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            required
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Short Description</Label>
          <Textarea
            id="description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="copies">Total Copies</Label>
          <Input
            id="copies"
            type="number"
            min={1}
            required
            value={totalCopies}
            onChange={(e) => setTotalCopies(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="userName">User Name</Label>
          <Input id="userName" readOnly value={session.user.name || ""} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="userEmail">Email</Label>
          <Input id="userEmail" readOnly value={session.user.email || ""} />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Book"}
        </Button>
      </form>
    </div>
  );
}
