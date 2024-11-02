"use client";

import ModalContainer from "@/components/ModalContainer";
import { Group, Text } from "@mantine/core";
import RolesTable from "@/components/RolesTable";
import CreateRoleForm from "@/components/CreateRoleForm";
import { useRoles } from "@/context/RolesContext";
import { PermissionsResolvable } from "@/lib/UserPermissions";

export default function Main() {
	const { accessCheckError } = useRoles() as {
		accessCheckError: (
			permissionRequired: PermissionsResolvable
		) => boolean;
	};
	const createRolePermission = accessCheckError(["ROLES_CREATE"]);
	const readRolePermission = accessCheckError(["ROLES_READ"]);

	return (
		<div>
			{createRolePermission && (
				<Group justify="flex-end">
					<ModalContainer title="Add Role">
						<CreateRoleForm />
					</ModalContainer>
				</Group>
			)}
			{readRolePermission ? (
				<RolesTable />
			) : (
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
