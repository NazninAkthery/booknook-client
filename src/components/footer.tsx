import Link from "next/link";
import { BookOpen } from "lucide-react";

function XLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.75 8.44-4.91 8.44-9.93z" />
    </svg>
  );
}

function InstagramLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm11 1.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 font-heading text-xl font-semibold">
            <BookOpen className="text-primary" />
            <span>BookNook</span>
          </div>
          <p className="text-sm text-muted-foreground">
            A small online library where you can add a book, borrow a book, and
            return a book with ease.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <h3 className="font-heading text-base font-semibold">Contact</h3>
          <p>Email: hello@booknook.app</p>
          <p>Phone: +1 (555) 123-4567</p>
          <p>Address: 12 Library Lane, Book City</p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-base font-semibold">Follow Us</h3>
          <div className="flex items-center gap-3">
            <Link
              href="https://x.com"
              target="_blank"
              className="rounded-md p-2 hover:bg-accent"
              aria-label="X"
            >
              <XLogo className="size-5" />
            </Link>
            <Link
              href="https://facebook.com"
              target="_blank"
              className="rounded-md p-2 hover:bg-accent"
              aria-label="Facebook"
            >
              <FacebookLogo className="size-5" />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              className="rounded-md p-2 hover:bg-accent"
              aria-label="Instagram"
            >
              <InstagramLogo className="size-5" />
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t py-4 text-center text-sm text-muted-foreground">
        © 2026 BookNook. All rights reserved.
      </div>
    </footer>
  );
}
