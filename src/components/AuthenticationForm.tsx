"use client";

import { Text, Paper, Group, PaperProps } from "@mantine/core";
import { GoogleButton } from "@/components/GoogleButton";
import { signIn } from "next-auth/react";

export function AuthenticationForm(props: PaperProps) {
  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" fw={500} ta="center">
        Welcome to Rivant ERP, Login with
      </Text>
      <Group grow mb="md" mt="md">
        <GoogleButton radius="xl" onClick={() => signIn("google")}>
          Google
        </GoogleButton>
      </Group>
    </Paper>
  );
}
