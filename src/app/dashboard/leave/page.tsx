"use client";

import ModalContainer from "@/components/ModalContainer";
import { Button, Group, Text } from "@mantine/core";
import { useRoles } from "@/context/RolesContext";
import { PermissionsResolvable } from "@/lib/UserPermissions";
import CreateLeaveForm from "@/components/CreateLeaveForm";
import { useToggle } from "@mantine/hooks";
import LeaveTable from "@/components/LeaveTable";
import LeaveGanttDashboard from "@/components/LeaveDashboard/LeaveGanttDashboard";

export default function Main() {
	const [value, toggle] = useToggle([false, true]);
	const { accessCheckError } = useRoles() as {
		accessCheckError: (
			permissionRequired: PermissionsResolvable
		) => boolean;
	};
	const createLeavePermission = accessCheckError(["LEAVES_CREATE"]);
	const readLeavePermission = accessCheckError(["LEAVES_READ"]);

	const displayUI = value ? <LeaveGanttDashboard /> : <LeaveTable />;

	return (
		<div>
			{createLeavePermission && (
				<Group justify="flex-end">
					<Button onClick={() => toggle()}>
						{value ? "Show Leave Table" : "Show Leave Dashboard"}
					</Button>
					<ModalContainer title="Add Leave">
						<CreateLeaveForm />
					</ModalContainer>
				</Group>
			)}
			{readLeavePermission ? (
				displayUI
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
