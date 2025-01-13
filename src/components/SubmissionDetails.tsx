import { Stack, Text } from "@mantine/core";
import { useSession } from "next-auth/react";
import ModalContainer from "./ModalContainer";
import CreateSubmissionForm from "./CreateSubmissionForm";
import SubmissionUpdateForm from "./SubmissionUpdateForm";
import { getTaskOutput } from "@/app/_trpc/client";

function SubmissionDetails({ task }: { task: getTaskOutput[0] }) {
	const { data: session } = useSession();
	const { Submissions } = task;
	const submissionCreatePermission = task.assigneeId === session?.user.id;
	const submissionEditPermission = task.creatorId === session?.user.id;

	return (
		<Stack
			align="stretch"
			justify="center"
			gap="md"
		>
			{Submissions?.length === 0 ? (
				<Text ta="center">No Submissions Present!</Text>
			) : (
				Submissions?.map((submission, i) => (
					<SubmissionUpdateForm
						key={i + 1}
						submission={submission}
						submissionEditPermission={submissionEditPermission}
						i={i}
					/>
				))
			)}
			{submissionCreatePermission && (
				<ModalContainer title="Add Submission">
					<CreateSubmissionForm taskId={task.id as string} />
				</ModalContainer>
			)}
		</Stack>
	);
}

export default SubmissionDetails;
