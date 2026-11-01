# BookNook

A small online library where users can add books, borrow books, and return them.

**Live site:** (add Vercel URL after deploy)

## Features

- Browse all books and view new arrivals on the home page
- Register and login with email/password or Google
- Add, edit, and delete your own books with image upload
- Borrow available books and manage returns from My Borrows
- Dark and light theme toggle with simple page animations
- Protected private routes that stay logged in after reload

## Tech Stack

- Next.js (App Router) + TypeScript
- shadcn/ui + Tailwind CSS
- BetterAuth with MongoDB adapter
- Express API + MongoDB + JWT
- Framer Motion + Swiper.js
- ImgBB image upload

## Setup

1. Copy `.env.example` to `.env.local`
2. Fill in MongoDB, Google OAuth, JWT, BetterAuth, and ImgBB values
3. Run `npm install`
4. Run `npm run dev`
