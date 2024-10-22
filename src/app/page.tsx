"use client";

import { Center } from "@mantine/core";
import AuthenticationForm from "@/components/AuthenticationForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.replace("/dashboard/tasks");
  }
  return (
    <Center h="100vh">
      <AuthenticationForm />
    </Center>
  );
}
