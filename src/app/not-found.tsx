import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="font-heading text-5xl font-bold">404</h1>
      <p className="text-lg text-muted-foreground">
        Sorry, the page you are looking for was not found.
      </p>
      <Link href="/" className={cn(buttonVariants({ size: "lg" }))}>
        Back to Home
      </Link>
    </div>
  );
}
