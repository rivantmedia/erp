"use client";

import { useSession } from "next-auth/react";
import UserPermissions, { PermissionsResolvable } from "@/lib/UserPermissions";
//TODO: Add error handling for fetch requests with status !== 2xx

import { createContext, useContext, useEffect, useReducer } from "react";

const RolesContext = createContext({});

export type Role = {
	id: string;
	index: number;
	name: string;
	permissions: number;
};

const initialState = {
	roles: [] as Role[],
	isChangeLoading: false,
	isRoleLoading: false,
	error: ""
};

type Action =
	| { type: "loadingChange" }
	| { type: "loadingRole" }
	| { type: "roles/loaded"; payload: Role[] }
	| { type: "rejected"; payload: string }
	| { type: "role/added"; payload: Role }
	| { type: "role/removed"; payload: string }
	| { type: "role/edit"; payload: Role };

function reducer(state: typeof initialState, action: Action) {
	switch (action.type) {
		case "loadingChange":
			return { ...state, isChangeLoading: true };

		case "loadingRole":
			return { ...state, isRoleLoading: true };

		case "roles/loaded":
			return { ...state, roles: action.payload, isRoleLoading: false };

		case "role/added":
			return {
				...state,
				roles: [...state.roles, action.payload],
				isChangeLoading: false
			};

		case "role/edit":
			return {
				...state,
				roles: state.roles.map((r) =>
					r.id === action.payload.id ? action.payload : r
				),
				isChangeLoading: false
			};

		case "role/removed":
			return {
				...state,
				roles: state.roles.filter((r) => r.id !== action.payload),
				isRoleLoading: false
			};

		case "rejected":
			return {
				...state,
				error: action.payload,
				isChangeLoading: false,
				isRoleLoading: false
			};

		default:
			throw new Error("Invalid action type");
	}
}

function RolesProvider({ children }: { children: React.ReactNode }) {
	const [{ roles, isChangeLoading, isRoleLoading, error }, dispatch] =
		useReducer(reducer, initialState);
	const { data: session } = useSession();

	useEffect(() => {
		async function fetchRoles() {
			dispatch({ type: "loadingRole" });
			try {
				const res = await fetch("/api/roles");
				if (res.status !== 200) throw new Error("Failed to load roles");
				const data = await res.json();
				dispatch({ type: "roles/loaded", payload: data });
			} catch {
				dispatch({
					type: "rejected",
					payload: "There was a error loading Roles"
				});
			}
		}

		fetchRoles();
	}, []);

	async function addRole(newRole: object) {
		newRole = { ...newRole };
		dispatch({ type: "loadingChange" });
		try {
			const res = await fetch("/api/roles", {
				method: "POST",
				body: JSON.stringify(newRole),
				headers: {
					"content-type": "application/json",
					"Accept": "application/json"
				}
			});
			if (res.status !== 201) throw new Error("Failed to add role");
			const data = await res.json();
			dispatch({ type: "role/added", payload: data });
			return { message: "Role added successfully", error: false };
		} catch {
			dispatch({
				type: "rejected",
				payload: "There was an error adding the role"
			});
			return { message: "Failed to add role", error: true };
		}
	}

	async function editRole(roleData: Role) {
		dispatch({ type: "loadingChange" });
		try {
			const res = await fetch("/api/roles", {
				method: "PATCH",
				body: JSON.stringify(roleData),
				headers: {
					"content-type": "application/json",
					"Accept": "application/json"
				}
			});
			if (res.status !== 200) throw new Error("Failed to update role");
			const data = await res.json();
			dispatch({ type: "role/edit", payload: data });
			return { message: "Role updated successfully", error: false };
		} catch {
			dispatch({
				type: "rejected",
				payload: "There was an error updating the role"
			});
			return { message: "Failed to update role", error: true };
		}
	}

	async function removeRole(roleId: string) {
		dispatch({ type: "loadingRole" });
		try {
			const res = await fetch("/api/roles", {
				method: "DELETE",
				body: JSON.stringify({ roleId }),
				headers: {
					"content-type": "application/json",
					"Accept": "application/json"
				}
			});
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const data = await res.json();
			dispatch({ type: "role/removed", payload: data.id });
		} catch {
			dispatch({
				type: "rejected",
				payload: "There was an error deleting the role"
			});
		}
	}

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
				roles,
				isChangeLoading,
				isRoleLoading,
				error,
				addRole,
				removeRole,
				accessCheckError,
				editRole
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
