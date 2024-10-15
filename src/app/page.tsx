"use client";

import { Center } from "@mantine/core";
import { AuthenticationForm } from "@/components/AuthenticationForm";

export default function Home() {
  return (
    <Center h="100vh">
      <AuthenticationForm />
    </Center>
  );
}
