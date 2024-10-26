import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./globals.css";

import { MantineProvider } from "@mantine/core";
import SessionWrapper from "@/components/SessionWrapper";
import { DatesProvider } from "@mantine/dates";

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
						<DatesProvider settings={{ consistentWeeks: true }}>
							{children}
						</DatesProvider>
					</MantineProvider>
				</SessionWrapper>
			</body>
		</html>
	);
}
