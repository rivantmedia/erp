"use client";

import Dashboard from "@/components/Dashboard/Dashboard";
import { EmployeesProvider } from "@/context/EmployeesContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { data: session } = useSession();
	const router = useRouter();

	if (!session) {
		router.replace("/");
		return null;
	}

	return (
		<EmployeesProvider>
			<Dashboard>{children}</Dashboard>
		</EmployeesProvider>
	);
}
