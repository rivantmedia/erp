"use client";

import { useEmployees } from "@/context/EmployeesContext";
import {
	Badge,
	Table,
	Group,
	Text,
	ActionIcon,
	Anchor,
	rem
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import ModalContainer from "./ModalContainer";
import UpdateEmployeeForm from "@/components/UpdateEmployeeForm";

export default function EmployeeTable() {
	const { data: session } = useSession();
	const { employees, removeEmployee } = useEmployees() as {
		employees: {
			fname: string;
			lname: string;
			title: string;
			email: string;
			contact: number;
			employeeId: number;
			sAdmin: boolean;
		}[];
		removeEmployee: (employeeId: number) => void;
	};
	const rows = employees.map((employee) => (
		<Table.Tr key={employee.employeeId}>
			<Table.Td>
				<Group gap="sm">
					<Text
						fz="sm"
						fw={500}
					>
						{employee.fname} {employee.lname}
					</Text>
				</Group>
			</Table.Td>

			<Table.Td>
				<Badge variant="light">{employee.title}</Badge>
			</Table.Td>
			<Table.Td>
				<Anchor
					component="button"
					size="sm"
				>
					{employee.email}
				</Anchor>
			</Table.Td>
			<Table.Td>
				<Text fz="sm">{employee.contact}</Text>
			</Table.Td>
			<Table.Td>
				{session?.user.sAdmin && (
					<Group
						gap={0}
						justify="flex-end"
					>
						<ModalContainer
							title="Edit Employee"
							type="edit"
						>
							<UpdateEmployeeForm
								employeeId={employee.employeeId}
							/>
						</ModalContainer>
						<ActionIcon
							variant="subtle"
							color="red"
							onClick={() => removeEmployee(employee.employeeId)}
						>
							<IconTrash
								style={{ width: rem(16), height: rem(16) }}
								stroke={1.5}
							/>
						</ActionIcon>
					</Group>
				)}
			</Table.Td>
		</Table.Tr>
	));

	return (
		<Table.ScrollContainer minWidth={800}>
			<Table verticalSpacing="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Employee</Table.Th>
						<Table.Th>Job title</Table.Th>
						<Table.Th>Email</Table.Th>
						<Table.Th>Phone</Table.Th>
						<Table.Th />
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>
		</Table.ScrollContainer>
	);
}
