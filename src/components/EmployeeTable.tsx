"use client";

import {
	Badge,
	Table,
	Group,
	Text,
	Anchor,
	Center,
	Loader
} from "@mantine/core";
import DrawerContainer from "./DrawerContainer";
import { useRoles } from "@/context/RolesContext";
import { PermissionsResolvable } from "@/lib/UserPermissions";
import EmployeeDetail from "./EmployeeDetail";
import { trpc } from "@/app/_trpc/client";
import { Employee } from "@prisma/client";

export default function EmployeeTable() {
	const { accessCheckError } = useRoles() as {
		accessCheckError: (
			permissionRequired: PermissionsResolvable
		) => boolean;
	};
	const getEmployees = trpc.getEmployees.useQuery();

	const employeeViewDetailsPermission = accessCheckError([
		"EMPLOYEES_READ_BASIC_INFO"
	]);
	const employeeViewSensitiveDetailsPermission = accessCheckError([
		"EMPLOYEES_READ_SENSITIVE_INFO"
	]);

	const rows = getEmployees.data?.map((employee) => (
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
					href={`mailto:${employee.email}`}
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
					{(employeeViewDetailsPermission ||
						employeeViewSensitiveDetailsPermission) && (
						<DrawerContainer title="View Details">
							<EmployeeDetail employee={employee as Employee} />
						</DrawerContainer>
					)}
				</Group>
			</Table.Td>
		</Table.Tr>
	));

	return (
		<>
			{!getEmployees.data ? (
				<Center
					h="100%"
					mt="lg"
				>
					<Loader />
				</Center>
			) : getEmployees.data.length !== 0 ? (
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
			) : (
				<Text ta="center">No Employees Present</Text>
			)}
		</>
	);
}
