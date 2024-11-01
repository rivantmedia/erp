import { Employee, useEmployees } from "@/context/EmployeesContext";
import { Task, useTasks } from "@/context/TasksContext";
import { Notification, Select, Textarea } from "@mantine/core";
import { Box, Button, Group, LoadingOverlay, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { useEffect, useState } from "react";

interface TaskFormValues {
	name: string;
	project: string;
	summary: string;
	description: string;
	assigneeId: string;
	creatorId: string;
	calendarEventId: string;
}

function UpdateTaskForm({ id }: { id: string }) {
	const [notification, setNotification] = useState<string | null>(null);
	const [date, setDate] = useState<[Date | null, Date | null]>([null, null]);
	const { employees } = useEmployees() as {
		employees: Employee[];
	};
	const { tasks, updateTask, error, isChangeLoading } = useTasks() as {
		tasks: Task[];
		updateTask: (newTask: Task) => void;
		error: string;
		isChangeLoading: boolean;
	};

	const form = useForm({
		mode: "uncontrolled",
		initialValues: {
			name: "",
			project: "",
			summary: "",
			description: "",
			assigneeId: "",
			creatorId: "",
			calendarEventId: ""
		},
		validate: {
			name: hasLength(
				{ min: 2 },
				"Name must be more than 2 characters long"
			),
			project: hasLength(
				{ min: 2 },
				"Project name must be more than 2 characters long"
			),
			summary: hasLength(
				{ min: 2 },
				"Summary must be more than 2 characters long"
			),
			description: hasLength(
				{ min: 2 },
				"Description must be more than 2 characters long"
			),
			assigneeId: isNotEmpty("Assignee is required"),
			creatorId: isNotEmpty("Assignee is required")
		}
	});

	useEffect(() => {
		if (id) {
			const task = tasks.find((t) => t.id === id);
			if (task) {
				form.setInitialValues({
					...task,
					calendarEventId: task.calendarEventId || ""
				});
				form.setValues(task);
				setDate([new Date(task.start), new Date(task.end)]);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, tasks]);

	async function handleForm(values: TaskFormValues) {
		const assignedEmail = employees.find(
			(e) => values.assigneeId === e.id
		)?.email;
		const [start, end] = date;
		if (start === null || end === null) {
			setNotification("error");
			return;
		}
		const taskData = { ...values, id, assignedEmail, start, end };
		if (form.isValid()) {
			console.log(values);
			await updateTask(taskData);
			if (!error) {
				setNotification("Updated");
			}
		}
	}

	return (
		<>
			{notification && (
				<Notification
					title={
						notification === "error"
							? "Task Duration Empty"
							: "Task Updated"
					}
					color={notification === "error" ? "red" : "green"}
					onClose={() => setNotification(null)}
				>
					{notification === "error"
						? "Please Pick Task Duration"
						: "Task has been updated successfully"}
				</Notification>
			)}
			<Box pos="relative">
				<LoadingOverlay
					visible={isChangeLoading}
					zIndex={1000}
					overlayProps={{ radius: "sm", blur: 2 }}
					loaderProps={{ type: "bars" }}
				/>
				<form onSubmit={form.onSubmit(handleForm)}>
					<TextInput
						withAsterisk
						label="Project Name"
						key={form.key("project")}
						{...form.getInputProps("project")}
					/>
					<TextInput
						withAsterisk
						label="Task Name"
						mt="md"
						key={form.key("name")}
						{...form.getInputProps("name")}
					/>
					<Textarea
						withAsterisk
						label="Task Description"
						mt="md"
						key={form.key("description")}
						{...form.getInputProps("description")}
					/>
					<Textarea
						withAsterisk
						label="Task Summary"
						mt="md"
						key={form.key("summary")}
						{...form.getInputProps("summary")}
					/>
					<DatePickerInput
						withAsterisk
						type="range"
						mt="md"
						allowSingleDateInRange
						label="Pick Task Duration"
						placeholder="Pick Task Duration"
						value={date}
						onChange={setDate}
					/>
					<Select
						withAsterisk
						label="Assign Task To:"
						mt="md"
						data={employees.map((e) => ({
							label: `${e.fname} ${e.lname}`,
							value: e.id
						}))}
						key={form.key("assigneeId")}
						{...form.getInputProps("assigneeId")}
					/>
					<Select
						withAsterisk
						label="Task Assigned By:"
						mt="md"
						disabled
						data={employees.map((e) => ({
							label: `${e.fname} ${e.lname}`,
							value: e.id
						}))}
						key={form.key("creatorId")}
						{...form.getInputProps("creatorId")}
					/>
					<Group
						justify="center"
						mt="md"
					>
						<Button type="submit">Submit</Button>
					</Group>
				</form>
			</Box>
		</>
	);
}

export default UpdateTaskForm;
