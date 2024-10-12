import { Text, Paper, Group, PaperProps } from "@mantine/core";
import { GoogleButton } from "@/components/GoogleButton";
import Link from "next/link";

export function AuthenticationForm(props: PaperProps) {
  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" fw={500} ta="center">
        Welcome to Rivant ERP, Login with
      </Text>

      <Link href="/dashboard">
        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl">Google</GoogleButton>
        </Group>
      </Link>
    </Paper>
  );
}
