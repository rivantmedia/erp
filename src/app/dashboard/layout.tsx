"use client";

import Dashboard from "@/components/Dashboard/Dashboard";
import { withAuth } from "@/components/WithAuth";
import { EmployeesProvider } from "@/context/EmployeesContext";

function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<EmployeesProvider>
			<Dashboard>{children}</Dashboard>
		</EmployeesProvider>
	);
}

export default withAuth(RootLayout);
