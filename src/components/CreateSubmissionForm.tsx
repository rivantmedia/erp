import { useTasks } from "@/context/TasksContext";
import {
	Box,
	Button,
	Group,
	LoadingOverlay,
	Notification,
	Textarea
} from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { useState } from "react";

interface SubmissionFormValues {
	note: string;
	taskId: string;
}

function CreateSubmissionForm({ taskId }: { taskId: string }) {
	const [notification, setNotification] = useState<{
		message: string;
		error: boolean;
	} | null>(null);
	const { addSubmission, isChangeLoading } = useTasks() as {
		addSubmission: (submission: SubmissionFormValues) => {
			message: string;
			error: boolean;
		};
		isChangeLoading: boolean;
	};
	const form = useForm({
		mode: "uncontrolled",
		initialValues: {
			note: "",
			taskId: taskId
		},
		validate: {
			note: hasLength(
				{ min: 2 },
				"Submission Note must be more than 2 characters long"
			)
		}
	});

	async function handleForm(values: SubmissionFormValues) {
		if (form.isValid()) {
			const res = await addSubmission(values);
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
					<Textarea
						withAsterisk
						label="Submission Note"
						mt="md"
						key={form.key("note")}
						{...form.getInputProps("note")}
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

export default CreateSubmissionForm;
