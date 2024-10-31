import { useEmployees } from "@/context/EmployeesContext";
import { Task, useTasks } from "@/context/TasksContext";
import { ActionIcon, Group, Stack, Text } from "@mantine/core";
import ModalContainer from "./ModalContainer";
import UpdateTaskForm from "./UpdateTaskForm";
import { IconTrash } from "@tabler/icons-react";

function TaskDetails({
	taskEditPermission,
	taskDeletePermission,
	task
}: {
	taskEditPermission: boolean;
	taskDeletePermission: boolean;
	task: Task;
}) {
	const { removeTask } = useTasks() as {
		removeTask: (id: string) => void;
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
					{employees.find((e) => e.id === task.assigneeId)?.fname}{" "}
					{employees.find((e) => e.id === task.assigneeId)?.lname}
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
					{employees.find((e) => e.id === task.creatorId)?.fname}{" "}
					{employees.find((e) => e.id === task.creatorId)?.lname}
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
						onClick={() => removeTask(task.id as string)}
					>
						<IconTrash
							style={{ width: "70%", height: "70%" }}
							stroke={1.5}
						/>
					</ActionIcon>
				)}
			</Group>
		</Stack>
	);
}

export default TaskDetails;
