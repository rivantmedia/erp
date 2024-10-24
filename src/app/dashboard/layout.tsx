"use client";

import Dashboard from "@/components/Dashboard/Dashboard";
import { withAuth } from "@/components/WithAuth";
import { EmployeesProvider } from "@/context/EmployeesContext";
import { RolesProvider } from "@/context/RolesContext";

function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<RolesProvider>
			<EmployeesProvider>
				<Dashboard>{children}</Dashboard>
			</EmployeesProvider>
		</RolesProvider>
	);
}

export default withAuth(RootLayout);
