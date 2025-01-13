"use client";

import { useSession } from "next-auth/react";
import UserPermissions, { PermissionsResolvable } from "@/lib/UserPermissions";
//TODO: Add error handling for fetch requests with status !== 2xx

import { createContext, useContext } from "react";

const RolesContext = createContext({});

function RolesProvider({ children }: { children: React.ReactNode }) {
	const { data: session } = useSession();

	function accessCheckError(permissionsRequired: PermissionsResolvable) {
		if (!session) {
			return false;
		}

		if (session.user.sAdmin) return true;

		//Check if user has enough permissions in case permissions are required to perform action
		if (!session.user.role && permissionsRequired) return false;

		const fetchedRole = session.user.role?.permissions;

		if (
			!fetchedRole ||
			!new UserPermissions(fetchedRole).has(permissionsRequired)
		) {
			return false;
		}

		return true;
	}

	return (
		<RolesContext.Provider
			value={{
				accessCheckError
			}}
		>
			{children}
		</RolesContext.Provider>
	);
}

function useRoles() {
	const context = useContext(RolesContext);
	if (context === undefined) {
		throw new Error("useRoles must be used within a RolesProvider");
	}
	return context;
}

export { RolesProvider, useRoles };
