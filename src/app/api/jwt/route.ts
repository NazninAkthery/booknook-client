import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = jwt.sign(
    {
      email: session.user.email,
      name: session.user.name,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  return NextResponse.json({ token });
}
