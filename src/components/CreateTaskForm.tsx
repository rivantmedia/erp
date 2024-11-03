import { Employee, useEmployees } from "@/context/EmployeesContext";
import { Task, useTasks } from "@/context/TasksContext";
import { Notification, Select, Textarea } from "@mantine/core";
import { Box, Button, Group, LoadingOverlay, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface TaskFormValues {
	name: string;
	project: string;
	summary: string;
	description: string;
	assigneeId: string;
}

function CreateTaskForm() {
	const [notification, setNotification] = useState<{
		message: string;
		error: boolean;
	} | null>(null);
	const { data: session } = useSession();
	const [date, setDate] = useState<[Date | null, Date | null]>([null, null]);
	const { employees } = useEmployees() as {
		employees: Employee[];
	};
	const { addTask, isChangeLoading } = useTasks() as {
		addTask: (newTask: Task) => {
			message: string;
			error: boolean;
		};
		isChangeLoading: boolean;
	};

	const form = useForm({
		mode: "uncontrolled",
		initialValues: {
			name: "",
			project: "",
			summary: "",
			description: "",
			assigneeId: ""
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
			assigneeId: isNotEmpty("Assignee is required")
		}
	});

	async function handleForm(values: TaskFormValues) {
		const assignedEmail = employees.find(
			(e) => values.assigneeId === e.id
		)?.email;
		const [start, end] = date;
		if (start === null || end === null) {
			form.setErrors({ start: "Task Duration Empty" });
			return;
		}
		const newTask = {
			...values,
			assignedEmail,
			start: start,
			end: end,
			creatorId: session?.user.id as string
		};
		if (form.isValid()) {
			const res = await addTask(newTask);
			if (!res.error) {
				form.reset();
			}
			setNotification(res);
		}
	}

	return (
		<>
			{notification && (
				<Notification
					title="Notification"
					color={notification.error ? "red" : "green"}
					onClose={() => setNotification(null)}
				>
					{notification.message}
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
						error={form.errors.start}
					/>
					<Select
						withAsterisk
						label="Assign Task To:"
						mt="md"
						data={employees.map((e) => ({
							label: `${e.fname} ${e.lname}`,
							value: e.id as string
						}))}
						key={form.key("assigneeId")}
						{...form.getInputProps("assigneeId")}
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

export default CreateTaskForm;
