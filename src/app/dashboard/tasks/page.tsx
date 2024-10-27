"use client";

import ModalContainer from "@/components/ModalContainer";
import { useSession } from "next-auth/react";
import { Group, Text } from "@mantine/core";
import TaskTable from "@/components/TaskTable";
import CreateTaskForm from "@/components/CreateTaskForm";
import { Task, useTasks } from "@/context/TasksContext";

export default function Main() {
	const { data: session } = useSession();
	const { tasks } = useTasks() as {
		tasks: Task[];
	};
	const tasksAssignedToYou = tasks.filter(
		(task) => task.assigneeId === session?.user.id
	);
	const tasksAssignedByYou = tasks.filter(
		(task) => task.creatorId === session?.user.id
	);
	return (
		<div>
			{session?.user.sAdmin && (
				<Group justify="flex-end">
					<ModalContainer title="Create Task">
						<CreateTaskForm />
					</ModalContainer>
				</Group>
			)}
			<Text
				mt="xl"
				fz="xl"
				ta="center"
				td="underline"
				fw={700}
			>
				Task Assigned To You
			</Text>
			<TaskTable tasks={tasksAssignedToYou} />
			<Text
				mt="xl"
				fz="xl"
				ta="center"
				td="underline"
				fw={700}
			>
				Task Assigned By You
			</Text>
			<TaskTable tasks={tasksAssignedByYou} />
		</div>
	);
}
