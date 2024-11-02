import { Submission, useTasks } from "@/context/TasksContext";
import {
	Badge,
	Button,
	Fieldset,
	Group,
	Select,
	Text,
	Textarea
} from "@mantine/core";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { useMemo, useState } from "react";

const SubmissionSelectStatus = [
	{
		label: "Pending Review",
		value: "pending",
		color: "blue"
	},
	{
		label: "Accepted",
		value: "accepted",
		color: "green"
	},
	{
		label: "Revision Required",
		value: "rejected",
		color: "red"
	}
];

interface SubmissionFormValues {
	id: string;
	taskId: string;
	status: string;
	remarks: string;
}

function SubmissionUpdateForm({
	submission,
	submissionEditPermission,
	i
}: {
	submission: Submission;
	submissionEditPermission: boolean;
	i: number;
}) {
	const [loading, setLoading] = useState(false);
	const { updateSubmission } = useTasks() as {
		updateSubmission: (data: SubmissionFormValues) => void;
	};

	const submissionDate = useMemo(
		() => new Date(submission.submissionDate).toLocaleDateString(),
		[submission.submissionDate]
	);
	const editPermission = submissionEditPermission && !submission.remarks;
	const submissionStatus = SubmissionSelectStatus.find(
		(s) => s.value === submission.status
	);

	const form = useForm({
		mode: "controlled",
		initialValues: {
			id: submission.id,
			taskId: submission.taskId,
			status: submission.status,
			remarks: ""
		},
		validate: {
			status: isNotEmpty("Submission Status is required"),
			remarks: hasLength(
				{ min: 2 },
				"Submission Remarks must be more than 2 characters long"
			)
		}
	});

	async function handleForm(values: SubmissionFormValues) {
		if (form.isValid()) {
			setLoading(true);
			await updateSubmission(values);
			setLoading(false);
		}
	}

	return (
		<Fieldset legend={`Submission ${i + 1}`}>
			<form onSubmit={form.onSubmit(handleForm)}>
				<Group>
					<Text
						fw={700}
						c="blue"
					>
						Submission Date:
					</Text>
					<Text>{submissionDate}</Text>
				</Group>
				<Group>
					<Text
						fw={700}
						c="blue"
					>
						Submission Note:
					</Text>
					<Text>{submission.note}</Text>
				</Group>
				<Group>
					<Text
						fw={700}
						c="blue"
					>
						Submission Status:
					</Text>
					{editPermission ? (
						<Select
							radius="xl"
							mb="md"
							data={SubmissionSelectStatus}
							key={form.key("status")}
							{...form.getInputProps("status")}
						/>
					) : (
						<Badge
							variant="light"
							color={submissionStatus?.color}
						>
							{submissionStatus?.label}
						</Badge>
					)}
				</Group>
				<Group>
					<Text
						fw={700}
						c="blue"
					>
						Submission Remarks:
					</Text>
					{editPermission ? (
						<Textarea
							withAsterisk
							autosize
							minRows={2}
							key={form.key("remarks")}
							{...form.getInputProps("remarks")}
						/>
					) : (
						<Text>
							{submission.remarks
								? submission.remarks
								: "No Remarks Given"}
						</Text>
					)}
				</Group>
				{editPermission && (
					<Group
						justify="flex-end"
						mt="md"
					>
						<Button
							type="submit"
							loading={loading}
						>
							Update
						</Button>
					</Group>
				)}
			</form>
		</Fieldset>
	);
}

export default SubmissionUpdateForm;
