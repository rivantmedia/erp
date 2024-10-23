"use client";

import { createContext, useContext, useEffect, useReducer } from "react";

const EmployeesContext = createContext({});

type Employee = {
	fname: string;
	lname: string;
	role: string;
	email: string;
	contact: number;
	employeeId: number;
	sAdmin: boolean;
};

const initialState = {
	employees: [] as Employee[],
	isLoading: false,
	error: ""
};

type Action =
	| { type: "loading" }
	| { type: "employees/loaded"; payload: Employee[] }
	| { type: "rejected"; payload: string }
	| { type: "employee/added"; payload: Employee }
	| { type: "employee/removed"; payload: number };

function reducer(state: typeof initialState, action: Action) {
	switch (action.type) {
		case "loading":
			return { ...state, isLoading: true };

		case "employees/loaded":
			return { ...state, employees: action.payload, isLoading: false };

		case "employee/added":
			return {
				...state,
				employees: [...state.employees, action.payload],
				isLoading: false
			};

		case "employee/removed":
			return {
				...state,
				employees: state.employees.filter(
					(e) => e.employeeId !== action.payload
				),
				isLoading: false
			};

		case "rejected":
			return { ...state, error: action.payload, isLoading: false };

		default:
			throw new Error("Invalid action type");
	}
}

function EmployeesProvider({ children }: { children: React.ReactNode }) {
	const [{ employees, isLoading, error }, dispatch] = useReducer(
		reducer,
		initialState
	);

	useEffect(() => {
		async function fetchEmployees() {
			dispatch({ type: "loading" });
			try {
				const res = await fetch("/api/employee");
				const data = await res.json();
				dispatch({ type: "employees/loaded", payload: data });
			} catch {
				dispatch({
					type: "rejected",
					payload: "There was a error loading Employees"
				});
			}
		}

		fetchEmployees();
	}, []);

	async function addEmployee(newEmployee: object) {
		newEmployee = { ...newEmployee, sAdmin: false };
		dispatch({ type: "loading" });
		try {
			const res = await fetch("/api/employee", {
				method: "POST",
				body: JSON.stringify(newEmployee),
				headers: {
					"content-type": "application/json",
					"Accept": "application/json"
				}
			});
			const data = await res.json();
			dispatch({ type: "employee/added", payload: data });
		} catch {
			dispatch({
				type: "rejected",
				payload: "There was an error adding the employee"
			});
		}
	}

	async function removeEmployee(employeeId: number) {
		dispatch({ type: "loading" });
		try {
			const res = await fetch("/api/employee", {
				method: "DELETE",
				body: JSON.stringify({ employeeId }),
				headers: {
					"content-type": "application/json",
					"Accept": "application/json"
				}
			});
			const data = await res.json();
			dispatch({ type: "employee/removed", payload: employeeId });
		} catch {
			dispatch({
				type: "rejected",
				payload: "There was an error deleting the employee"
			});
		}
	}

	return (
		<EmployeesContext.Provider
			value={{ employees, isLoading, error, addEmployee, removeEmployee }}
		>
			{children}
		</EmployeesContext.Provider>
	);
}

function useEmployees() {
	const context = useContext(EmployeesContext);
	if (context === undefined) {
		throw new Error("useEmployees must be used within a EmployeesProvider");
	}
	return context;
}

export { EmployeesProvider, useEmployees };
