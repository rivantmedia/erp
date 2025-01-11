import { ActionIcon, Group, Loader, Stack, Text } from "@mantine/core";
import ModalContainer from "./ModalContainer";
import UpdateTaskForm from "./UpdateTaskForm";
import { IconTrash } from "@tabler/icons-react";
import { getTaskOutput, trpc } from "@/app/_trpc/client";
import { useState } from "react";

function TaskDetails({
	taskEditPermission,
	taskDeletePermission,
	task
}: {
	taskEditPermission: boolean;
	taskDeletePermission: boolean;
	task: getTaskOutput[0];
}) {
	const [loading, setLoading] = useState(false);
	const getTasks = trpc.getTasks.useQuery();
	const deleteTask = trpc.deleteTask.useMutation({
		onSuccess: () => getTasks.refetch(),
		onSettled: () => setLoading(false)
	});

	return (
		<Stack
			align="stretch"
			justify="center"
			gap="md"
		>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Project Name:
				</Text>
				<Text>{task.project}</Text>
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Task Name:
				</Text>
				<Text>{task.name}</Text>
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Task Description:
				</Text>
				<Text>{task.description}</Text>
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Task Summary:
				</Text>
				<Text>{task.summary}</Text>
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Task Assignment Date:
				</Text>
				<Text>{new Date(task.start).toLocaleDateString()}</Text>
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Task Due Date:
				</Text>
				<Text>{new Date(task.end).toLocaleDateString()}</Text>
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Task Assigned To:
				</Text>
				<Text>
					{task.assignee?.fname} {task.assignee?.lname}
				</Text>
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Task Assigned By:
				</Text>
				<Text>
					{task.creator?.fname} {task.creator?.lname}
				</Text>
			</Group>
			<Group
				gap={0}
				justify="flex-end"
			>
				{taskEditPermission && (
					<ModalContainer
						title="Edit Employee"
						type="edit"
					>
						<UpdateTaskForm id={task.id as string} />
					</ModalContainer>
				)}
				{taskDeletePermission && (
					<ActionIcon
						variant="subtle"
						color="red"
						size="xl"
						onClick={() => {
							setLoading(true);
							deleteTask.mutate({
								id: task.id,
								creatorId: task.creatorId
							});
						}}
					>
						{loading ? (
							<Loader color="red" />
						) : (
							<IconTrash
								style={{ width: "70%", height: "70%" }}
								stroke={1.5}
							/>
						)}
					</ActionIcon>
				)}
			</Group>
		</Stack>
	);
}

export default TaskDetails;
