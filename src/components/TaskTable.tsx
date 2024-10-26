"use client";

import {
	Badge,
	Table,
	Group,
	Text,
	ActionIcon,
	rem,
	Loader,
	Center
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import ModalContainer from "./ModalContainer";
import UpdateEmployeeForm from "@/components/UpdateEmployeeForm";
import { Task, useTasks } from "@/context/TasksContext";
import { useEmployees } from "@/context/EmployeesContext";

export default function TaskTable() {
	const { tasks, isLoading, removeTask } = useTasks() as {
		tasks: Task[];
		isLoading: boolean;
		removeTask: (taskId: string) => void;
	};
	const { employees } = useEmployees() as {
		employees: {
			id: string;
			fname: string;
			lname: string;
			title: string;
			email: string;
			contact: number;
			employeeId: number;
			sAdmin: boolean;
		}[];
	};

	const rows = tasks.map((task: Task) => (
		<Table.Tr key={task.id}>
			<Table.Td>
				<Group gap="sm">
					<Text
						fz="sm"
						fw={500}
					>
						{task.project}
					</Text>
				</Group>
			</Table.Td>

			<Table.Td>
				<Badge variant="light">{task.name}</Badge>
			</Table.Td>
			<Table.Td>
				<Group gap="sm">
					<Text
						fz="sm"
						fw={500}
					>
						{task.description}
					</Text>
				</Group>
			</Table.Td>
			<Table.Td>
				<Text fz="sm">{task.summary}</Text>
			</Table.Td>
			<Table.Td>
				<Badge variant="light">
					{new Date(task.start).toLocaleDateString()}
				</Badge>
			</Table.Td>
			<Table.Td>
				<Badge variant="light">
					{new Date(task.end).toLocaleDateString()}
				</Badge>
			</Table.Td>
			<Table.Td>
				<Badge variant="light">
					{employees.find((e) => e.id === task.assigneeId)?.fname}{" "}
					{employees.find((e) => e.id === task.assigneeId)?.lname}
				</Badge>
			</Table.Td>
			<Table.Td>
				<Badge variant="light">
					{employees.find((e) => e.id === task.creatorId)?.fname}{" "}
					{employees.find((e) => e.id === task.creatorId)?.lname}
				</Badge>
			</Table.Td>
			<Table.Td>
				<Group
					gap={0}
					justify="start"
				>
					<ModalContainer title="Submit">
						Task Submission
					</ModalContainer>
				</Group>
			</Table.Td>
			<Table.Td>
				<Group
					gap={0}
					justify="flex-end"
				>
					<ModalContainer
						title="Edit Employee"
						type="edit"
					>
						<UpdateEmployeeForm taskId={task.id} />
					</ModalContainer>
					<ActionIcon
						variant="subtle"
						color="red"
						onClick={() => removeTask(task.id as string)}
					>
						<IconTrash
							style={{ width: rem(16), height: rem(16) }}
							stroke={1.5}
						/>
					</ActionIcon>
				</Group>
			</Table.Td>
		</Table.Tr>
	));

	return (
		<>
			{isLoading ? (
				<Center h="100%">
					<Loader />
				</Center>
			) : tasks.length !== 0 ? (
				<Table.ScrollContainer minWidth={800}>
					<Table verticalSpacing="sm">
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Project Name</Table.Th>
								<Table.Th>Task Name</Table.Th>
								<Table.Th>Task Description</Table.Th>
								<Table.Th>Task Summary</Table.Th>
								<Table.Th>Start Date</Table.Th>
								<Table.Th>Due Date</Table.Th>
								<Table.Th>Assignee</Table.Th>
								<Table.Th>Creator</Table.Th>
								<Table.Th>Submissions</Table.Th>
								<Table.Th />
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>{rows}</Table.Tbody>
					</Table>
				</Table.ScrollContainer>
			) : (
				<Text ta="center">No Task Present</Text>
			)}
		</>
	);
}
