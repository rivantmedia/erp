"use client";

import ModalContainer from "@/components/ModalContainer";
import { useSession } from "next-auth/react";
import { Group } from "@mantine/core";
import RolesTable from "@/components/RolesTable";
import CreateRoleForm from "@/components/CreateRoleForm";
import { RolesProvider } from "@/context/RolesContext";

export default function Main() {
	const { data: session } = useSession();

	return (
		<RolesProvider>
			<div>
				{session?.user.sAdmin && (
					<Group justify="flex-end">
						<ModalContainer title="Add Role">
							<CreateRoleForm />
						</ModalContainer>
					</Group>
				)}
				<RolesTable />
			</div>
		</RolesProvider>
	);
}
