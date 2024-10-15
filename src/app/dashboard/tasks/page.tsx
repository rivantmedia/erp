"use client";

import { useSession } from "next-auth/react";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }
}

export default function Main() {
  const { data: session } = useSession();
  return (
    <div>
      {session ? (
        <h1>
          Welcome {session.user?.name} , {session.user?.role}!
        </h1>
      ) : (
        <h1>Not signed in</h1>
      )}
    </div>
  );
}
