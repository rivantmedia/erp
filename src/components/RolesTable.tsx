"use client";

import { useRoles } from "@/context/RolesContext";
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
import { getPermissionStrings } from "@/lib/UserPermissions";

export default function RolesTable() {
	const { data: session } = useSession();
	const { roles, removeRole } = useRoles();

	const rows = roles.map((role) => (
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
					getPermissionStrings(role.permissions).map((s) => (
						<Badge
							variant="light"
							key={s}
						>
							{s}
						</Badge>
					))
				) : (
					<Badge variant="light">"No Permissions"</Badge>
				)}
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
							HAAA
						</ModalContainer>
						<ActionIcon
							variant="subtle"
							color="red"
							onClick={() => removeRole(role.id)}
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
						<Table.Th>Name</Table.Th>
						<Table.Th>Permissions</Table.Th>
						<Table.Th />
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>
		</Table.ScrollContainer>
	);
}
