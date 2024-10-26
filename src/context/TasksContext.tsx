"use client";

import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useReducer } from "react";

const tasksContext = createContext({});

export type Task = {
	id?: string;
	name: string;
	project: string;
	summary: string;
	description: string;
	start: Date;
	end: Date;
	assigneeId: string;
	assignedEmail?: string;
	creatorId: string;
	calendarEventId?: string;
};

const initialState = {
	tasks: [] as Task[],
	isLoading: false,
	error: ""
};

type Action =
	| { type: "loading" }
	| { type: "tasks/loaded"; payload: Task[] }
	| { type: "rejected"; payload: string }
	| { type: "task/added"; payload: Task }
	| { type: "task/removed"; payload: string }
	| { type: "task/update"; payload: Task };

function reducer(state: typeof initialState, action: Action) {
	switch (action.type) {
		case "loading":
			return { ...state, isLoading: true };

		case "tasks/loaded":
			return { ...state, tasks: action.payload, isLoading: false };

		case "task/added":
			return {
				...state,
				tasks: [...state.tasks, action.payload],
				isLoading: false
			};

		case "task/update":
			return {
				...state,
				tasks: state.tasks.map((e) =>
					e.id === action.payload.id ? action.payload : e
				),
				isLoading: false
			};

		case "task/removed":
			return {
				...state,
				tasks: state.tasks.filter((e) => e.id !== action.payload),
				isLoading: false
			};

		case "rejected":
			return { ...state, error: action.payload, isLoading: false };

		default:
			throw new Error("Invalid action type");
	}
}

function TasksProvider({ children }: { children: React.ReactNode }) {
	const [{ tasks, isLoading, error }, dispatch] = useReducer(
		reducer,
		initialState
	);
	const { data: session } = useSession();

	useEffect(() => {
		async function fetchTasks() {
			dispatch({ type: "loading" });
			try {
				const res = await fetch("/api/tasks");
				const data = await res.json();
				dispatch({ type: "tasks/loaded", payload: data });
				console.log(data);
			} catch {
				dispatch({
					type: "rejected",
					payload: "There was a error loading tasks"
				});
			}
		}

		fetchTasks();
	}, []);

	async function addTask(newTask: Task) {
		dispatch({ type: "loading" });
		try {
			const res = await fetch("/api/tasks", {
				method: "POST",
				body: JSON.stringify(newTask),
				headers: {
					"content-type": "application/json",
					"Accept": "application/json"
				}
			});
			const data = await res.json();
			dispatch({ type: "task/added", payload: data });
		} catch {
			dispatch({
				type: "rejected",
				payload: "There was an error adding the task"
			});
		}
	}

	async function updateTask(taskData: Task) {
		dispatch({ type: "loading" });
		try {
			const res = await fetch("/api/tasks", {
				method: "PATCH",
				body: JSON.stringify(taskData),
				headers: {
					"content-type": "application/json",
					"Accept": "application/json"
				}
			});
			const data = await res.json();
			dispatch({ type: "task/update", payload: data });
		} catch {
			dispatch({
				type: "rejected",
				payload: "There was an error adding the task"
			});
		}
	}

	async function removeTask(taskId: string) {
		dispatch({ type: "loading" });
		try {
			const res = await fetch("/api/tasks", {
				method: "DELETE",
				body: JSON.stringify({
					id: taskId,
					creatorId: session?.user.id
				}),
				headers: {
					"content-type": "application/json",
					"Accept": "application/json"
				}
			});
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const data = await res.json();
			dispatch({ type: "task/removed", payload: taskId });
		} catch {
			dispatch({
				type: "rejected",
				payload: "There was an error deleting the task"
			});
		}
	}

	return (
		<tasksContext.Provider
			value={{
				tasks,
				isLoading,
				error,
				addTask,
				removeTask,
				updateTask
			}}
		>
			{children}
		</tasksContext.Provider>
	);
}

function useTasks() {
	const context = useContext(tasksContext);
	if (context === undefined) {
		throw new Error("usetasks must be used within a tasksProvider");
	}
	return context;
}

export { TasksProvider, useTasks };
