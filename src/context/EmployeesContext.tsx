"use client";

import { createContext, useContext, useEffect, useReducer } from "react";

const EmployeesContext = createContext({});

export type Employee = {
	id?: string;
	fname: string;
	lname: string;
	title: string;
	email: string;
	department: string;
	contact: number;
	employeeId: number;
	roleId?: string;
	sAdmin?: boolean;
	type?: string;
	status?: string;
	location?: string;
	appliedOn?: Date;
	cvFile?: string;
	doj?: Date;
	contractEndDate?: Date;
	dateOfLeaving?: Date;
	contract?: string;
	personalMail?: string;
	personalPhone?: number;
	whatsapp?: number;
	photo?: string;
	upiId?: string;
	dob?: Date;
	aadhar?: number;
	PAN?: string;
	bank?: string;
	bankingName?: string;
	accountNo?: number;
	ifsc?: string;
	avgScore?: number;
	retainChoice?: string;
	extEligible?: boolean;
};

const initialState = {
	employees: [] as Employee[],
	isChangeLoading: false,
	isEmployeeLoading: false,
	error: ""
};

type Action =
	| { type: "loadingChange" }
	| { type: "loadingEmployee" }
	| { type: "employees/loaded"; payload: Employee[] }
	| { type: "rejected"; payload: string }
	| { type: "employee/added"; payload: Employee }
	| { type: "employee/removed"; payload: string }
	| { type: "employee/update"; payload: Employee };

function reducer(state: typeof initialState, action: Action) {
	switch (action.type) {
		case "loadingChange":
			return { ...state, isChangeLoading: true };

		case "loadingEmployee":
			return { ...state, isEmployeeLoading: true };

		case "employees/loaded":
			return {
				...state,
				employees: action.payload,
				isEmployeeLoading: false
			};

		case "employee/added":
			return {
				...state,
				employees: [...state.employees, action.payload],
				isChangeLoading: false
			};

		case "employee/update":
			return {
				...state,
				employees: state.employees.map((e) =>
					e.employeeId === action.payload.employeeId
						? action.payload
						: e
				),
				isChangeLoading: false
			};

		case "employee/removed":
			return {
				...state,
				employees: state.employees.filter(
					(e) => e.id !== action.payload
				),
				isEmployeeLoading: false
			};

		case "rejected":
			return {
				...state,
				error: action.payload,
				isEmployeeLoading: false,
				isChangeLoading: false
			};

		default:
			throw new Error("Invalid action type");
	}
}

function EmployeesProvider({ children }: { children: React.ReactNode }) {
	const [{ employees, isChangeLoading, isEmployeeLoading, error }, dispatch] =
		useReducer(reducer, initialState);

	useEffect(() => {
		async function fetchEmployees() {
			dispatch({ type: "loadingEmployee" });
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

	async function addEmployee(newEmployee: Employee) {
		dispatch({ type: "loadingChange" });
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

	async function updateEmployee(employeeData: Employee) {
		dispatch({ type: "loadingChange" });
		try {
			const res = await fetch("/api/employee", {
				method: "PATCH",
				body: JSON.stringify(employeeData),
				headers: {
					"content-type": "application/json",
					"Accept": "application/json"
				}
			});
			const data = await res.json();
			dispatch({ type: "employee/update", payload: data });
		} catch {
			dispatch({
				type: "rejected",
				payload: "There was an error adding the employee"
			});
		}
	}

	async function removeEmployee(id: string) {
		dispatch({ type: "loadingEmployee" });
		try {
			const res = await fetch("/api/employee", {
				method: "DELETE",
				body: JSON.stringify({ id }),
				headers: {
					"content-type": "application/json",
					"Accept": "application/json"
				}
			});
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const data = await res.json();
			dispatch({ type: "employee/removed", payload: id });
		} catch {
			dispatch({
				type: "rejected",
				payload: "There was an error deleting the employee"
			});
		}
	}

	return (
		<EmployeesContext.Provider
			value={{
				employees,
				isChangeLoading,
				isEmployeeLoading,
				error,
				addEmployee,
				removeEmployee,
				updateEmployee
			}}
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
