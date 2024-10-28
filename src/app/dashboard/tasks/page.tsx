"use client";

import ModalContainer from "@/components/ModalContainer";
import { useSession } from "next-auth/react";
import { Group, Text } from "@mantine/core";
import TaskTable from "@/components/TaskTable";
import CreateTaskForm from "@/components/CreateTaskForm";
import { Task, useTasks } from "@/context/TasksContext";
import { Roles } from "@/lib/permissions";
import { useRoles } from "@/context/RolesContext";

export default function Main() {
	const { data: session } = useSession();
	const { tasks } = useTasks() as {
		tasks: Task[];
	};
	const { accessCheckError } = useRoles() as {
		accessCheckError: (permissionRequired: number) => boolean;
	};

	const taskViewAllPermission = accessCheckError(Roles.TASKS_VIEW_ALL);
	const taskViewPermission = accessCheckError(Roles.TASKS_VIEW);
	const taskCreatePermission = accessCheckError(Roles.TASKS_CREATE);
	const taskEditAllPermission = accessCheckError(Roles.TASKS_EDIT);

	const tasksAssignedToYou = tasks.filter(
		(task) => task.assigneeId === session?.user.id
	);
	const tasksAssignedByYou = tasks.filter(
		(task) => task.creatorId === session?.user.id
	);

	const tasksAssignedByOther = taskViewAllPermission
		? tasks.filter(
				(task) =>
					task.assigneeId !== session?.user.id &&
					task.creatorId !== session?.user.id
		  )
		: null;

	return (
		<div>
			{taskCreatePermission && (
				<Group justify="flex-end">
					<ModalContainer title="Create Task">
						<CreateTaskForm />
					</ModalContainer>
				</Group>
			)}
			{taskViewAllPermission && (
				<>
					<Text
						mt="xl"
						fz="xl"
						ta="center"
						td="underline"
						fw={700}
					>
						Task Assigned By/To Others
					</Text>
					<TaskTable
						tasks={tasksAssignedByOther as Task[]}
						taskEditPermission={taskEditAllPermission}
					/>
				</>
			)}
			{taskViewPermission && (
				<>
					<Text
						mt="xl"
						fz="xl"
						ta="center"
						td="underline"
						fw={700}
					>
						Task Assigned To You
					</Text>
					<TaskTable
						tasks={tasksAssignedToYou}
						taskEditPermission={false}
					/>
					<Text
						mt="xl"
						fz="xl"
						ta="center"
						td="underline"
						fw={700}
					>
						Task Assigned By You
					</Text>
					<TaskTable
						tasks={tasksAssignedByYou}
						taskEditPermission={true}
					/>
				</>
			)}
		</div>
	);
}
