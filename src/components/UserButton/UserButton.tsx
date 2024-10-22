"use client";

import { UnstyledButton, Group, Avatar, Text, rem } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import classes from "./UserButton.module.css";
import { useSession } from "next-auth/react";

export default function UserButton() {
  const { data: session } = useSession();

  return (
    <UnstyledButton className={classes.user}>
      <Group>
        <Avatar src={session?.user.image} radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {session?.user.name}
          </Text>

          <Text c="dimmed" size="xs">
            {session?.user.role}
          </Text>
        </div>

        <IconChevronRight
          style={{ width: rem(14), height: rem(14) }}
          stroke={1.5}
        />
      </Group>
    </UnstyledButton>
  );
}
