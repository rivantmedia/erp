"use client";

import ModalContainer from "@/components/ModalContainer";
import { useSession } from "next-auth/react";
import { Group, Text } from "@mantine/core";
import TaskTable from "@/components/TaskTable";
import CreateTaskForm from "@/components/CreateTaskForm";
import { Task, useTasks } from "@/context/TasksContext";
import { useRoles } from "@/context/RolesContext";
import { PermissionsResolvable } from "@/lib/UserPermissions";

export default function Main() {
	const { data: session } = useSession();
	const { tasks } = useTasks() as {
		tasks: Task[];
	};
	const { accessCheckError } = useRoles() as {
		accessCheckError: (
			permissionRequired: PermissionsResolvable
		) => boolean;
	};

	const taskViewAllPermission = accessCheckError(["TASKS_VIEW_ALL"]);
	const taskViewPermission = accessCheckError(["TASKS_VIEW"]);
	const taskCreatePermission = accessCheckError(["TASKS_CREATE"]);
	const taskEditAllPermission = accessCheckError(["TASKS_EDIT"]);
	const taskDeleteAllPermission = accessCheckError(["TASKS_DELETE"]);

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
						taskDeletePermission={taskDeleteAllPermission}
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
						taskDeletePermission={false}
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
						taskDeletePermission={true}
					/>
				</>
			)}
		</div>
	);
}
