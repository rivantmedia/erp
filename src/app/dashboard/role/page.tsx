"use client";

import ModalContainer from "@/components/ModalContainer";
import { useSession } from "next-auth/react";
import { Group } from "@mantine/core";
import RolesTable from "@/components/RolesTable";
import { RolesProvider } from "@/context/RolesContext";
import CreateRoleForm from "@/components/CreateRoleForm";

export default function Main() {
	const { data: session } = useSession();
	return (
		<div>
			<RolesProvider>
				{session?.user.sAdmin && (
					<Group justify="flex-end">
						<ModalContainer title="Add Role">
							<CreateRoleForm />
						</ModalContainer>
					</Group>
				)}
				<RolesTable />
			</RolesProvider>
		</div>
	);
}
