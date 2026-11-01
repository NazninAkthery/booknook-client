"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    document.title = "BookNook | My Profile";
  }, []);

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (!session) {
    router.push("/login?redirect=/profile");
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-2xl">My Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 text-center">
          <Avatar className="size-24">
            <AvatarImage
              src={session.user.image || ""}
              alt={session.user.name || "User"}
            />
            <AvatarFallback className="text-2xl">
              {(session.user.name || "U").charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <p className="text-xl font-semibold">{session.user.name}</p>
            <p className="text-muted-foreground">{session.user.email}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
