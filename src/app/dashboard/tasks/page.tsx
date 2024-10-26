"use client";

import ModalContainer from "@/components/ModalContainer";
import { useSession } from "next-auth/react";
import { Group } from "@mantine/core";
import TaskTable from "@/components/TaskTable";
import CreateTaskForm from "@/components/CreateTaskForm";

export default function Main() {
	const { data: session } = useSession();
	return (
		<div>
			{session?.user.sAdmin && (
				<Group justify="flex-end">
					<ModalContainer title="Create Task">
						<CreateTaskForm />
					</ModalContainer>
				</Group>
			)}
			<TaskTable />
		</div>
	);
}
