"use client";

import { createContext, useContext, useEffect, useReducer } from "react";

const EmployeesContext = createContext({});

const initialState = {
  employees: [] as object[],
  isLoading: false,
  error: "",
};

type Action =
  | { type: "loading" }
  | { type: "employees/loaded"; payload: object[] }
  | { type: "rejected"; payload: string };

function reducer(state: typeof initialState, action: Action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "employees/loaded":
      return { ...state, employees: action.payload, isLoading: false };

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
          payload: "There was a error loading Employees",
        });
      }
    }

    fetchEmployees();
  }, []);

  return (
    <EmployeesContext.Provider value={{ employees, isLoading, error }}>
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
