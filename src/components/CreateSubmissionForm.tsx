import { trpc } from "@/app/_trpc/client";
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

function CreateSubmissionForm({ taskId }: { taskId: string }) {
	const [notification, setNotification] = useState<{
		message: string;
		error: boolean;
	} | null>(null);
	const [isChangeLoading, setIsChangeLoading] = useState(false);
	const getTask = trpc.getTasks.useQuery();
	const addSubmission = trpc.addSubmission.useMutation({
		onSuccess: () => {
			getTask.refetch();
			setNotification({
				message: "Submission added successfully",
				error: false
			});
		},
		onSettled: () => setIsChangeLoading(false),
		onError: (error) => {
			setNotification({
				message: error.message,
				error: true
			});
		}
	});
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

	async function handleForm(values: typeof form.values) {
		if (form.isValid()) {
			setIsChangeLoading(true);
			addSubmission.mutate(values);
			form.reset();
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
