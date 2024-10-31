"use client";

import EmployeeTable from "@/components/EmployeeTable";
import ModalContainer from "@/components/ModalContainer";
import CreateEmployeeForm from "@/components/CreateEmployeeForm";
import { Group, Text } from "@mantine/core";
import { useRoles } from "@/context/RolesContext";
import { PermissionsResolvable } from "@/lib/UserPermissions";

export default function Main() {
	const { accessCheckError } = useRoles() as {
		accessCheckError: (
			permissionRequired: PermissionsResolvable
		) => boolean;
	};

	const employeeReadPermission = accessCheckError(["EMPLOYEES_READ"]);
	const employeeCreatePermission = accessCheckError(["EMPLOYEES_CREATE"]);

	return (
		<div>
			{employeeCreatePermission && (
				<Group justify="flex-end">
					<ModalContainer title="Add Employee">
						<CreateEmployeeForm />
					</ModalContainer>
				</Group>
			)}
			{employeeReadPermission ? (
				<EmployeeTable />
			) : (
				<Text ta="center">
					You do not have permission to view employees.
				</Text>
			)}
		</div>
	);
}
