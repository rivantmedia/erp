import { trpc } from "@/app/_trpc/client";
import { Notification, Select, Textarea } from "@mantine/core";
import { Box, Button, Group, LoadingOverlay, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { useEffect, useState } from "react";

function UpdateTaskForm({ id }: { id: string }) {
	const [notification, setNotification] = useState<{
		message: string;
		error: boolean;
	} | null>(null);
	const [date, setDate] = useState<[Date | null, Date | null]>([null, null]);
	const [isChangeLoading, setIsChangeLoading] = useState(false);
	const getEmployees = trpc.getEmployees.useQuery();
	const getTasks = trpc.getTasks.useQuery();
	const updateTask = trpc.updateTask.useMutation({
		onSuccess: () => {
			getTasks.refetch();
			setNotification({
				message: "Task Updated Successfully",
				error: false
			});
		},
		onSettled: () => setIsChangeLoading(false),
		onError: (error) => {
			setNotification({ message: error.message, error: true });
		}
	});

	const task = getTasks.data?.find((t) => t.id === id);

	const form = useForm({
		mode: "uncontrolled",
		initialValues: {
			name: task?.name || "",
			project: task?.project || "",
			summary: task?.summary || "",
			description: task?.description || "",
			assigneeId: task?.assigneeId || "",
			creatorId: task?.creatorId || "",
			calendarEventId: task?.calendarEventId || ""
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
		if (task) {
			setDate([new Date(task.start), new Date(task.end)]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function handleForm(values: typeof form.values) {
		setIsChangeLoading(true);
		const assignedEmail = getEmployees.data?.find(
			(e) => values.assigneeId === e.id
		)?.email as string;
		const [start, end] = date;
		if (start === null || end === null) {
			form.setErrors({ start: "Task Duration Empty" });
			return;
		}
		const taskData = { ...values, id, assignedEmail, start, end };
		if (form.isValid()) {
			updateTask.mutate(taskData);
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
						data={getEmployees.data
							?.filter((e) => e.id !== undefined)
							.map((e) => ({
								label: `${e.fname} ${e.lname}`,
								value: e.id as string
							}))}
						key={form.key("assigneeId")}
						{...form.getInputProps("assigneeId")}
					/>
					<Select
						withAsterisk
						label="Task Assigned By:"
						mt="md"
						disabled
						data={getEmployees.data
							?.filter((e) => e.id !== undefined)
							.map((e) => ({
								label: `${e.fname} ${e.lname}`,
								value: e.id as string
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
