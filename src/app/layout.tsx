import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./globals.css";

import { MantineProvider } from "@mantine/core";
import SessionWrapper from "@/components/SessionWrapper";

export const metadata: Metadata = {
	title: "Rivant Media ERP",
	description: "Rivant Media ERP"
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<SessionWrapper>
					<MantineProvider defaultColorScheme="dark">
						{children}
					</MantineProvider>
				</SessionWrapper>
			</body>
		</html>
	);
}
