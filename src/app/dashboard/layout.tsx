"use client";

import Dashboard from "@/components/Dashboard/Dashboard";
import { withAuth } from "@/components/WithAuth";
import { RolesProvider } from "@/context/RolesContext";

function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<RolesProvider>
			<Dashboard>{children}</Dashboard>
		</RolesProvider>
	);
}

export default withAuth(RootLayout);
