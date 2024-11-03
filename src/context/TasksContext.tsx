"use client";

import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useReducer } from "react";

const tasksContext = createContext({});

export type Submission = {
	id: string;
	note: string;
	status: string;
	remarks?: string;
	submissionDate: Date;
	taskId: string;
};

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
	Submissions?: Submission[];
};

const initialState = {
	tasks: [] as Task[],
	isTaskLoading: false,
	isChangeLoading: false,
	error: ""
};

type Action =
	| { type: "taskLoading" }
	| { type: "changeLoading" }
	| { type: "tasks/loaded"; payload: Task[] }
	| { type: "rejected"; payload: string }
	| { type: "task/added"; payload: Task }
	| { type: "task/removed"; payload: string }
	| { type: "task/update"; payload: Task }
	| { type: "submission/added"; payload: Submission }
	| { type: "submission/update"; payload: Submission };

function reducer(state: typeof initialState, action: Action) {
	switch (action.type) {
		case "taskLoading":
			return { ...state, isTaskLoading: true };

		case "changeLoading":
			return { ...state, isChangeLoading: true };

		case "tasks/loaded":
			return { ...state, tasks: action.payload, isTaskLoading: false };

		case "task/added":
			return {
				...state,
				tasks: [...state.tasks, action.payload],
				isChangeLoading: false
			};

		case "task/update":
			return {
				...state,
				tasks: state.tasks.map((e) =>
					e.id === action.payload.id ? action.payload : e
				),
				isChangeLoading: false
			};

		case "task/removed":
			return {
				...state,
				tasks: state.tasks.filter((e) => e.id !== action.payload),
				isTaskLoading: false
			};

		case "submission/added":
			return {
				...state,
				tasks: state.tasks.map((task) =>
					task.id === action.payload.taskId
						? {
								...task,
								Submissions: [
									...(task.Submissions as Submission[]),
									action.payload
								]
						  }
						: task
				),
				isChangeLoading: false
			};

		case "submission/update":
			return {
				...state,
				tasks: state.tasks.map((task) =>
					task.id === action.payload.taskId
						? {
								...task,
								Submissions: task.Submissions?.map(
									(submission) =>
										submission.id === action.payload.id
											? action.payload
											: submission
								)
						  }
						: task
				)
			};

		case "rejected":
			return {
				...state,
				error: action.payload,
				isChangeLoading: false,
				isTaskLoading: false
			};

		default:
			throw new Error("Invalid action type");
	}
}

function TasksProvider({ children }: { children: React.ReactNode }) {
	const [{ tasks, isChangeLoading, isTaskLoading, error }, dispatch] =
		useReducer(reducer, initialState);
	const { data: session } = useSession();

	useEffect(() => {
		async function fetchTasks() {
			dispatch({ type: "taskLoading" });
			try {
				const res = await fetch("/api/tasks");
				const data = await res.json();
				dispatch({ type: "tasks/loaded", payload: data });
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
		dispatch({ type: "changeLoading" });
		try {
			const res = await fetch("/api/tasks", {
				method: "POST",
				body: JSON.stringify(newTask),
				headers: {
					"content-type": "application/json",
					"Accept": "application/json"
				}
			});
			if (res.status !== 201) throw new Error("Failed to create task");
			const data = await res.json();
			dispatch({ type: "task/added", payload: data });
			return { message: "Task created successfully", error: false };
		} catch {
			dispatch({
				type: "rejected",
				payload: "There was an error adding the task"
			});
			return { message: "Failed to create task", error: true };
		}
	}

	async function addSubmission(newSubmission: {
		note: string;
		taskId: string;
	}) {
		dispatch({ type: "changeLoading" });
		try {
			const res = await fetch("/api/submissions", {
				method: "POST",
				body: JSON.stringify(newSubmission),
				headers: {
					"content-type": "application/json",
					"Accept": "application/json"
				}
			});
			if (res.status !== 201)
				throw new Error("Failed to create submission");
			const data = await res.json();
			dispatch({ type: "submission/added", payload: data });
			return { message: "Submission created successfully", error: false };
		} catch {
			dispatch({
				type: "rejected",
				payload: "There was an error adding the submission"
			});
			return { message: "Failed to create submission", error: true };
		}
	}

	async function updateTask(taskData: Task) {
		dispatch({ type: "changeLoading" });
		try {
			const res = await fetch("/api/tasks", {
				method: "PATCH",
				body: JSON.stringify(taskData),
				headers: {
					"content-type": "application/json",
					"Accept": "application/json"
				}
			});
			if (res.status !== 200) throw new Error("Failed to update task");
			const data = await res.json();
			dispatch({ type: "task/update", payload: data });
			return { message: "Task updated successfully", error: false };
		} catch {
			dispatch({
				type: "rejected",
				payload: "There was an error adding the task"
			});
			return { message: "Failed to update task", error: true };
		}
	}

	async function updateSubmission(submissionData: {
		id: string;
		taskId: string;
		status: string;
		remarks: string;
	}) {
		try {
			const res = await fetch("/api/submissions", {
				method: "PATCH",
				body: JSON.stringify(submissionData),
				headers: {
					"content-type": "application/json",
					"Accept": "application/json"
				}
			});
			const data = await res.json();
			dispatch({ type: "submission/update", payload: data });
		} catch {
			console.log("There was an error updating the submission");
		}
	}

	async function removeTask(taskId: string) {
		dispatch({ type: "taskLoading" });
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
			dispatch({ type: "task/removed", payload: data.id });
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
				isChangeLoading,
				isTaskLoading,
				error,
				addTask,
				removeTask,
				updateTask,
				addSubmission,
				updateSubmission
			}}
		>
			{children}
		</tasksContext.Provider>
	);
}

function useTasks() {
	const context = useContext(tasksContext);
	if (context === undefined) {
		throw new Error("useTasks must be used within a tasksProvider");
	}
	return context;
}

export { TasksProvider, useTasks };
