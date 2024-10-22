"use client";

import { AppShell, Burger, Group } from "@mantine/core";
import React, { useState } from "react";
import Logo from "@/components/Logo";
import styles from "./Dashboard.module.css";
import Link from "next/link";
import UserButton from "../UserButton/UserButton";
import { IconLogout } from "@tabler/icons-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const linksData = [
  { label: "Tasks", href: "tasks" },
  { label: "Employees", href: "employees" },
  { label: "Assets/Equipment", href: "assets" },
  { label: "Document", href: "document" },
  { label: "Projects", href: "project" },
  { label: "Role", href: "role" },
];

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const [opened, setOpened] = useState(false);
  const [activeLink, setActiveLink] = useState("Tasks");
  const router = useRouter();

  const toggle = () => setOpened((o) => !o);

  const links = linksData.map((link) => (
    <Link
      className={styles.link}
      data-active={activeLink === link.label || undefined}
      href={link.href}
      onClick={() => {
        toggle();
        setActiveLink(link.label);
      }}
      key={link.label}
    >
      {link.label}
    </Link>
  ));

  return (
    <AppShell
      header={{ height: { base: 60, md: 70, lg: 80 } }}
      navbar={{
        width: { base: 200, md: 300, lg: 400 },
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Link href="/">
            <Logo />
          </Link>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <div className={styles.navbarMain}>{links}</div>
        <div className={styles.footer}>
          <UserButton />

          <div
            className={styles.link2}
            onClick={() => {
              signOut();
              router.push("/");
            }}
          >
            <IconLogout className={styles.linkIcon} stroke={1.5} />
            <span>Logout</span>
          </div>
        </div>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
