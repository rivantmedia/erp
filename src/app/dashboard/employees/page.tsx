"use client";

import EmployeeTable from "@/components/EmployeeTable";
import ModalContainer from "@/components/ModalContainer";
import { useSession } from "next-auth/react";
import CreateEmployeeForm from "@/components/CreateEmployeeForm";
import { Group } from "@mantine/core";

export default function Main() {
	const { data: session } = useSession();
	return (
		<div>
			{session?.user.sAdmin && (
				<Group justify="flex-end">
					<ModalContainer title="Add Employee">
						<CreateEmployeeForm />
					</ModalContainer>
				</Group>
			)}
			<EmployeeTable />
		</div>
	);
}
