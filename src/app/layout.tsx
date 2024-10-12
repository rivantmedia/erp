import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "./globals.css";

import { MantineProvider } from "@mantine/core";

export const metadata: Metadata = {
  title: "Rivant Media ERP",
  description: "Rivant Media ERP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MantineProvider defaultColorScheme="dark">{children}</MantineProvider>
      </body>
    </html>
  );
}
