"use client";

import {
	Table,
	Group,
	Text,
	Center,
	Loader,
	Select,
	ActionIcon,
	rem
} from "@mantine/core";
import { getLeaveOutput, trpc } from "@/app/_trpc/client";
import { DatePickerInput } from "@mantine/dates";
import { useState } from "react";
import { PermissionsResolvable } from "@/lib/UserPermissions";
import { useRoles } from "@/context/RolesContext";
import ModalContainer from "./ModalContainer";
import { IconTrash } from "@tabler/icons-react";
import UpdateLeaveForm from "./UpdateLeaveForm";

const filterOptions = [
	{ label: "Today", value: "1" },
	{ label: "This Week", value: "2" },
	{ label: "This Month", value: "3" },
	{ label: "Custom Time", value: "4" }
];

const initialFilters = {
	employeeId: "",
	timeRange: ""
};

export default function LeaveTable() {
	const [loading, setLoading] = useState(false);
	const [customDate, setCustomDate] = useState<[Date | null, Date | null]>([
		null,
		null
	]);
	const [filters, setFilters] = useState(initialFilters);
	const { accessCheckError } = useRoles() as {
		accessCheckError: (
			permissionRequired: PermissionsResolvable
		) => boolean;
	};
	const getLeaves = trpc.getLeaves.useQuery();
	const deleteLeave = trpc.deleteLeave.useMutation({
		onSuccess: () => {
			getLeaves.refetch();
		},
		onSettled: () => {
			setLoading(false);
		}
	});
	const leaves = getLeaves.data?.filter((leave) => {
		if (filters.employeeId && filters.timeRange) {
			return (
				leave.employeeId === filters.employeeId &&
				CheckLeaveInTime(leave)
			);
		}

		if (filters.employeeId) {
			return leave.employeeId === filters.employeeId;
		}

		if (filters.timeRange) return CheckLeaveInTime(leave);

		return true;
	});
	const getEmployees = trpc.getEmployees.useQuery();

	const editLeavePermission = accessCheckError(["LEAVES_UPDATE"]);
	const deleteLeavePermission = accessCheckError(["LEAVES_DELETE"]);

	function CheckLeaveInTime(leave: getLeaveOutput[0]) {
		const today = new Date();
		const fromDate = new Date(leave.fromDate);
		const toDate = new Date(leave.toDate);

		if (filters.timeRange === "1") {
			return today >= fromDate && today <= toDate;
		}

		if (filters.timeRange === "2") {
			const weekStart = new Date(
				today.setDate(today.getDate() - today.getDay())
			);
			const weekEnd = new Date(today.setDate(weekStart.getDate() + 6));
			return fromDate <= weekEnd && toDate >= weekStart;
		}

		if (filters.timeRange === "3") {
			const monthStart = new Date(
				today.getFullYear(),
				today.getMonth(),
				1
			);
			const monthEnd = new Date(
				today.getFullYear(),
				today.getMonth() + 1,
				0
			);
			return fromDate <= monthEnd && toDate >= monthStart;
		}

		if (filters.timeRange === "4" && customDate[0] && customDate[1]) {
			return fromDate <= customDate[1] && toDate >= customDate[0];
		}
	}

	const rows = leaves?.map((leave) => (
		<Table.Tr key={leave.id}>
			<Table.Td>
				<Group gap="sm">
					<Text
						fz="sm"
						fw={500}
					>
						{leave.employee.fname} {leave.employee.lname}
					</Text>
				</Group>
			</Table.Td>

			<Table.Td>
				<Text
					fz="sm"
					fw={500}
				>
					{leave.leaveReason}
				</Text>
			</Table.Td>
			<Table.Td>
				<Text
					fz="sm"
					fw={500}
				>
					{new Date(leave.fromDate).toLocaleDateString()}
				</Text>
			</Table.Td>
			<Table.Td>
				<Text
					fz="sm"
					fw={500}
				>
					{new Date(leave.toDate).toLocaleDateString()}
				</Text>
			</Table.Td>
			<Table.Td>
				<Text
					fz="sm"
					fw={500}
				>
					{leave.reference}
				</Text>
			</Table.Td>
			<Table.Td>
				<Text
					fz="sm"
					fw={500}
				>
					{leave.creator.fname} {leave.creator.lname} on{" "}
					{new Date(leave.createdAt).toLocaleDateString()}
				</Text>
			</Table.Td>
			<Table.Td>
				{
					<Group
						gap={0}
						justify="flex-end"
					>
						{editLeavePermission && (
							<ModalContainer
								title="Edit Leave"
								type="edit"
								size="md"
							>
								<UpdateLeaveForm leave={leave} />
							</ModalContainer>
						)}
						{deleteLeavePermission && (
							<ActionIcon
								variant="subtle"
								color="red"
								onClick={() => {
									setLoading(true);
									deleteLeave.mutate(leave.id);
								}}
							>
								<IconTrash
									style={{
										width: rem(16),
										height: rem(16)
									}}
									stroke={1.5}
								/>
							</ActionIcon>
						)}
					</Group>
				}
			</Table.Td>
		</Table.Tr>
	));

	return (
		<>
			{getLeaves.isLoading || loading ? (
				<Center
					h="100%"
					mt="lg"
				>
					<Loader />
				</Center>
			) : getLeaves.isError ? (
				<Text
					ta="center"
					my="xl"
					color="red"
				>
					Something Went Wrong!!
				</Text>
			) : getLeaves.data?.length !== 0 ? (
				<>
					<Group
						justify="flex-start"
						mt="md"
					>
						<Select
							placeholder="Filter Using Employee"
							value={filters.employeeId}
							clearable
							onChange={(value) =>
								setFilters((prev) => ({
									...prev,
									employeeId: value as string
								}))
							}
							data={getEmployees.data?.map((e) => ({
								label: `${e.fname} ${e.lname}`,
								value: e.id as string
							}))}
						/>
						<Select
							placeholder="Filter Using Time"
							value={filters.timeRange}
							clearable
							onChange={(value) =>
								setFilters((prev) => ({
									...prev,
									timeRange: value as string
								}))
							}
							data={filterOptions.map((r) => ({
								label: r.label,
								value: r.value
							}))}
						/>
						{filters.timeRange === "4" && (
							<DatePickerInput
								type="range"
								allowSingleDateInRange
								placeholder="Pick Custom Time"
								clearable
								value={customDate}
								onChange={setCustomDate}
							/>
						)}
					</Group>
					<Table.ScrollContainer minWidth={800}>
						<Table verticalSpacing="sm">
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Employee</Table.Th>
									<Table.Th>Reason for Leave</Table.Th>
									<Table.Th>From</Table.Th>
									<Table.Th>To</Table.Th>
									<Table.Th>Reference</Table.Th>
									<Table.Th>Created By</Table.Th>
									<Table.Th />
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>{rows}</Table.Tbody>
						</Table>
					</Table.ScrollContainer>
				</>
			) : (
				<Text
					ta="center"
					my="xl"
				>
					No Leave Record Present
				</Text>
			)}
		</>
	);
}
