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
import ModalContainer from "./ModalContainer";
import UpdateEmployeeForm from "@/components/UpdateEmployeeForm";
import { useRoles } from "@/context/RolesContext";
import { PermissionsResolvable } from "@/lib/UserPermissions";

export default function EmployeeTable() {
	const { accessCheckError } = useRoles() as {
		accessCheckError: (
			permissionRequired: PermissionsResolvable
		) => boolean;
	};
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

	const employeeEditPermission = accessCheckError(["EMPLOYEES_UPDATE"]);
	const employeeDeletePermission = accessCheckError(["EMPLOYEES_DELETE"]);

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
				<Group
					gap={0}
					justify="flex-end"
				>
					{employeeEditPermission && (
						<ModalContainer
							title="Edit Employee"
							type="edit"
						>
							<UpdateEmployeeForm
								employeeId={employee.employeeId}
							/>
						</ModalContainer>
					)}
					{employeeDeletePermission && (
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
					)}
				</Group>
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
