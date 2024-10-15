"use client";

import { AppShell, Burger, Group } from "@mantine/core";
import React, { useState } from "react";
import { Logo } from "@/components/Logo";
import styles from "./Dashboard.module.css";
import Link from "next/link";

const linksData = [
  { label: "Tasks", href: "tasks" },
  { label: "Employees", href: "employees" },
  { label: "Assets/Equipment", href: "assets" },
  { label: "Document", href: "document" },
];

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const [opened, setOpened] = useState(false);
  const [activeLink, setActiveLink] = useState("Tasks");

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
          <Logo />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">{links}</AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
