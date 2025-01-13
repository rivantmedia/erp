"use client";

import { useRoles } from "@/context/RolesContext";
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
import { useSession } from "next-auth/react";
import ModalContainer from "./ModalContainer";
import UserPermissions, { PermissionsResolvable } from "@/lib/UserPermissions";
import UpdateRoleForm from "./UpdateRoleForm";
import { trpc } from "@/app/_trpc/client";
import { useState } from "react";

export default function RolesTable() {
	const { data: session } = useSession();
	const [loading, setLoading] = useState(false);
	const getRoles = trpc.getRoles.useQuery();
	const deleteRole = trpc.deleteRole.useMutation({
		onSuccess: () => {
			getRoles.refetch();
		},
		onSettled: () => {
			setLoading(false);
		}
	});
	const { accessCheckError } = useRoles() as {
		accessCheckError: (
			permissionRequired: PermissionsResolvable
		) => boolean;
	};
	const editRolePermission = accessCheckError(["ROLES_UPDATE"]);
	const deleteRolePermission = accessCheckError(["ROLES_DELETE"]);

	const rows = getRoles.data?.map((role) => (
		<Table.Tr key={role.id}>
			<Table.Td>
				<Group gap="sm">
					<Text
						fz="sm"
						fw={500}
					>
						{role.name}
					</Text>
				</Group>
			</Table.Td>

			<Table.Td>
				{role.permissions ? (
					new UserPermissions(role.permissions).toArray().map((s) => (
						<Badge
							variant="light"
							key={s}
							ms="xs"
						>
							{s}
						</Badge>
					))
				) : (
					<Badge variant="light">No Permissions</Badge>
				)}
			</Table.Td>
			<Table.Td>
				{session?.user.sAdmin && (
					<Group
						gap={0}
						justify="flex-end"
					>
						{editRolePermission && (
							<ModalContainer
								title="Edit Role"
								type="edit"
								size="md"
							>
								<UpdateRoleForm role={role} />
							</ModalContainer>
						)}
						{deleteRolePermission && (
							<ActionIcon
								variant="subtle"
								color="red"
								onClick={() => {
									setLoading(true);
									deleteRole.mutate(role.id);
								}}
							>
								{loading ? (
									<Loader color="red" />
								) : (
									<IconTrash
										style={{
											width: rem(16),
											height: rem(16)
										}}
										stroke={1.5}
									/>
								)}
							</ActionIcon>
						)}
					</Group>
				)}
			</Table.Td>
		</Table.Tr>
	));

	return (
		<>
			{!getRoles.data ? (
				<Center h="100%">
					<Loader />
				</Center>
			) : (
				<Table.ScrollContainer minWidth={800}>
					<Table verticalSpacing="sm">
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Name</Table.Th>
								<Table.Th>Permissions</Table.Th>
								<Table.Th />
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>{rows}</Table.Tbody>
					</Table>
				</Table.ScrollContainer>
			)}
		</>
	);
}
