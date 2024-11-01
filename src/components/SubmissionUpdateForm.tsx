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
import { useEffect, useMemo, useState } from "react";

const SubmissionStatus: {
	[key in "pending" | "accepted" | "rejected"]: string;
} = {
	pending: "Pending Review",
	accepted: "Accepted",
	rejected: "Revision Required"
};

const SubmissionSelectStatus = [
	{
		label: "Pending Review",
		value: "pending"
	},
	{
		label: "Accepted",
		value: "accepted"
	},
	{
		label: "Revision Required",
		value: "rejected"
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
	const submissionStatus = useMemo(
		() =>
			SubmissionStatus[
				submission.status as keyof typeof SubmissionStatus
			],
		[submission.status]
	);
	const editPermission = submissionEditPermission && !submission.remarks;

	const form = useForm({
		mode: "controlled",
		initialValues: {
			id: "",
			taskId: "",
			status: "",
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

	useEffect(() => {
		form.setValues({
			id: submission.id,
			taskId: submission.taskId,
			status: submission.status
		});
	}, []);

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
						<Badge variant="light">{submissionStatus}</Badge>
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
