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
import { useEffect, useState } from "react";

interface SubmissionFormValues {
	note: string;
	taskId: string;
}

function CreateSubmissionForm({ taskId }: { taskId: string }) {
	const [notification, setNotification] = useState(false);
	const { addSubmission, error, isChangeLoading } = useTasks() as {
		addSubmission: (submission: SubmissionFormValues) => void;
		error: string;
		isChangeLoading: boolean;
	};
	const form = useForm({
		mode: "uncontrolled",
		initialValues: {
			note: "",
			taskId: ""
		},
		validate: {
			note: hasLength(
				{ min: 2 },
				"Submission Note must be more than 2 characters long"
			)
		}
	});

	useEffect(() => {
		form.setFieldValue("taskId", taskId);
	}, [form, taskId]);

	async function handleForm(values: SubmissionFormValues) {
		if (form.isValid()) {
			await addSubmission(values);
			if (!error) {
				setNotification(true);
				form.reset();
			}
		}
	}

	return (
		<>
			{notification && (
				<Notification
					title="Submission Added"
					color="green"
					onClose={() => setNotification(false)}
				>
					Employee has been added successfully
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
