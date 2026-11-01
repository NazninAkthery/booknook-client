"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BookCardProps = {
  id: string;
  title: string;
  author: string;
  category: string;
  image: string;
};

export function BookCard({ id, title, author, category, image }: BookCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <Card className="flex h-full flex-col overflow-hidden">
        <div className="aspect-[3/4] w-full overflow-hidden bg-muted">
          <img src={image} alt={title} className="size-full object-cover" />
        </div>
        <CardHeader className="gap-2">
          <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{author}</p>
          <Badge variant="secondary" className="w-fit">
            {category}
          </Badge>
        </CardHeader>
        <CardContent className="flex-1" />
        <CardFooter>
          <Link
            href={`/books/${id}`}
            className={cn(buttonVariants(), "w-full")}
          >
            View Details
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
