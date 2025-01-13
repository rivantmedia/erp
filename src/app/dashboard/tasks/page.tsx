"use client";

import ModalContainer from "@/components/ModalContainer";
import { useSession } from "next-auth/react";
import { Group, Text } from "@mantine/core";
import TaskTable from "@/components/TaskTable";
import CreateTaskForm from "@/components/CreateTaskForm";
import { PermissionsResolvable } from "@/lib/UserPermissions";
import { getTaskOutput, trpc } from "@/app/_trpc/client";
import { useRoles } from "@/context/RolesContext";

export default function Main() {
	const { data: session } = useSession();
	const getTasks = trpc.getTasks.useQuery();
	const { accessCheckError } = useRoles() as {
		accessCheckError: (
			permissionRequired: PermissionsResolvable
		) => boolean;
	};

	const taskViewAllPermission = accessCheckError(["TASKS_VIEW_ALL"]);
	const taskViewPermission = accessCheckError(["TASKS_VIEW"]);
	const taskCreatePermission =
		accessCheckError(["TASKS_CREATE", "EMPLOYEES_READ_SENSITIVE_INFO"]) ||
		accessCheckError(["TASKS_CREATE", "EMPLOYEES_READ_BASIC_INFO"]) ||
		accessCheckError(["TASKS_CREATE", "EMPLOYEES_READ"]);
	const taskEditAllPermission =
		accessCheckError(["TASKS_EDIT", "EMPLOYEES_READ_SENSITIVE_INFO"]) ||
		accessCheckError(["TASKS_EDIT", "EMPLOYEES_READ_BASIC_INFO"]) ||
		accessCheckError(["TASKS_EDIT", "EMPLOYEES_READ"]);
	const taskDeleteAllPermission = accessCheckError(["TASKS_DELETE"]);

	const tasksAssignedToYou =
		getTasks.data?.filter((task) => task.assigneeId === session?.user.id) ??
		[];
	const tasksAssignedByYou =
		getTasks.data?.filter((task) => task.creatorId === session?.user.id) ??
		[];

	const tasksAssignedByOther = taskViewAllPermission
		? getTasks.data?.filter(
				(task) =>
					task.assigneeId !== session?.user.id &&
					task.creatorId !== session?.user.id
		  ) ?? []
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
						mb="xl"
						fw={700}
					>
						Task Assigned By/To Others
					</Text>
					<TaskTable
						tasks={tasksAssignedByOther as getTaskOutput}
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
						mb="xl"
						fw={700}
					>
						Task Assigned To You
					</Text>
					<TaskTable
						tasks={tasksAssignedToYou as getTaskOutput}
						taskEditPermission={false}
						taskDeletePermission={false}
					/>
					<Text
						mt="xl"
						fz="xl"
						ta="center"
						td="underline"
						mb="xl"
						fw={700}
					>
						Task Assigned By You
					</Text>
					<TaskTable
						tasks={tasksAssignedByYou as getTaskOutput}
						taskEditPermission={true}
						taskDeletePermission={true}
					/>
				</>
			)}
			{!taskViewAllPermission && !taskViewPermission && (
				<Text
					size="xl"
					fw={700}
					ta="center"
					color="red"
				>
					Access Denied
				</Text>
			)}
		</div>
	);
}
