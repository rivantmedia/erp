"use client";

import Dashboard from "@/components/Dashboard/Dashboard";
import { withAuth } from "@/components/WithAuth";
import { EmployeesProvider } from "@/context/EmployeesContext";
import { RolesProvider } from "@/context/RolesContext";
import { TasksProvider } from "@/context/TasksContext";

function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<EmployeesProvider>
			<TasksProvider>
				<RolesProvider>
					<Dashboard>{children}</Dashboard>
				</RolesProvider>
			</TasksProvider>
		</EmployeesProvider>
	);
}

export default withAuth(RootLayout);
