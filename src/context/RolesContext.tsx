"use client";

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
	isLoading: false,
	error: ""
};

type Action =
	| { type: "loading" }
	| { type: "roles/loaded"; payload: Role[] }
	| { type: "rejected"; payload: string }
	| { type: "role/added"; payload: Role }
	| { type: "role/removed"; payload: string };

function reducer(state: typeof initialState, action: Action) {
	switch (action.type) {
		case "loading":
			return { ...state, isLoading: true };

		case "roles/loaded":
			return { ...state, roles: action.payload, isLoading: false };

		case "role/added":
			return {
				...state,
				roles: [...state.roles, action.payload],
				isLoading: false
			};

		case "role/removed":
			return {
				...state,
				roles: state.roles.filter((r) => r.id !== action.payload),
				isLoading: false
			};

		case "rejected":
			return { ...state, error: action.payload, isLoading: false };

		default:
			throw new Error("Invalid action type");
	}
}

function RolesProvider({ children }: { children: React.ReactNode }) {
	const [{ roles, isLoading, error }, dispatch] = useReducer(
		reducer,
		initialState
	);

	useEffect(() => {
		async function fetchRoles() {
			dispatch({ type: "loading" });
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
		dispatch({ type: "loading" });
		try {
			const res = await fetch("/api/roles", {
				method: "POST",
				body: JSON.stringify(newRole),
				headers: {
					"content-type": "application/json",
					"Accept": "application/json"
				}
			});
			const data = await res.json();
			dispatch({ type: "role/added", payload: data });
		} catch {
			dispatch({
				type: "rejected",
				payload: "There was an error adding the role"
			});
		}
	}

	async function removeRole(roleId: string) {
		dispatch({ type: "loading" });
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
			dispatch({ type: "role/removed", payload: roleId });
		} catch {
			dispatch({
				type: "rejected",
				payload: "There was an error deleting the role"
			});
		}
	}

	return (
		<RolesContext.Provider
			value={{ roles, isLoading, error, addRole, removeRole }}
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
	return context as typeof initialState & {
		addRole: (newRole: object) => void;
		removeRole: (roleId: string) => void;
	};
}

export { RolesProvider, useRoles };
