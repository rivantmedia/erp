"use client";

import { Badge, Table, Group, Text, Loader, Center } from "@mantine/core";
import { Task, useTasks } from "@/context/TasksContext";
import { useEmployees } from "@/context/EmployeesContext";
import DrawerContainer from "./DrawerContainer";
import TaskDetails from "./TaskDetails";
import SubmissionDetails from "./SubmissionDetails";

export default function TaskTable({
	tasks,
	taskEditPermission,
	taskDeletePermission
}: {
	tasks: Task[];
	taskEditPermission: boolean;
	taskDeletePermission: boolean;
}) {
	const { isTaskLoading } = useTasks() as {
		isTaskLoading: boolean;
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
					<DrawerContainer title="Task Details">
						<TaskDetails
							taskEditPermission={taskEditPermission}
							taskDeletePermission={taskDeletePermission}
							task={task}
						/>
					</DrawerContainer>
				</Group>
			</Table.Td>
			<Table.Td>
				<Group
					gap={0}
					justify="start"
				>
					<DrawerContainer title="Task Submissions">
						<SubmissionDetails task={task} />
					</DrawerContainer>
				</Group>
			</Table.Td>
		</Table.Tr>
	));

	return (
		<>
			{isTaskLoading ? (
				<Center
					h="100%"
					mt="lg"
				>
					<Loader />
				</Center>
			) : tasks.length !== 0 ? (
				<Table.ScrollContainer minWidth={800}>
					<Table verticalSpacing="sm">
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Project Name</Table.Th>
								<Table.Th>Task Name</Table.Th>
								<Table.Th>Due Date</Table.Th>
								<Table.Th>Assigned To</Table.Th>
								<Table.Th>Creator</Table.Th>
								<Table.Th>Details</Table.Th>
								<Table.Th>Submissions</Table.Th>
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
