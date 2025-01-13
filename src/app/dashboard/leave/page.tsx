"use client";

import ModalContainer from "@/components/ModalContainer";
import { Group, Text } from "@mantine/core";
import CreateRoleForm from "@/components/CreateRoleForm";
import { useRoles } from "@/context/RolesContext";
import { PermissionsResolvable } from "@/lib/UserPermissions";

export default function Main() {
	const { accessCheckError } = useRoles() as {
		accessCheckError: (
			permissionRequired: PermissionsResolvable
		) => boolean;
	};
	const createLeavePermission = accessCheckError(["LEAVES_CREATE"]);
	const readLeavePermission = accessCheckError(["LEAVES_READ"]);

	return (
		<div>
			{createLeavePermission && (
				<Group justify="flex-end">
					<ModalContainer title="Add Leave">
						<CreateRoleForm />
					</ModalContainer>
				</Group>
			)}
			{readLeavePermission ? (
				"Leaves Table"
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
