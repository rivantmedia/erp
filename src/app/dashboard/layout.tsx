"use client";

import Dashboard from "@/components/Dashboard/Dashboard";
import { withAuth } from "@/components/WithAuth";
import { EmployeesProvider } from "@/context/EmployeesContext";
import { RolesProvider } from "@/context/RolesContext";

function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<EmployeesProvider>
			<RolesProvider>
				<Dashboard>{children}</Dashboard>
			</RolesProvider>
		</EmployeesProvider>
	);
}

export default withAuth(RootLayout);
