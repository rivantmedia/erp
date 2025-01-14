import { getLeaveOutput, trpc } from "@/app/_trpc/client";
import { Notification, Select, Textarea } from "@mantine/core";
import { Box, Button, Group, LoadingOverlay } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const referenceData = [
	{ label: "Via Call" },
	{ label: "Via Email" },
	{ label: "Via Whatsapp" },
	{ label: "Via Custom Text" }
];

function UpdateLeaveForm({ leave }: { leave: getLeaveOutput[0] }) {
	const [notification, setNotification] = useState<{
		message: string;
		error: boolean;
	} | null>(null);
	const { data: session } = useSession();
	const [date, setDate] = useState<[Date | null, Date | null]>([null, null]);
	const [isChangeLoading, setIsChangeLoading] = useState(false);
	const getEmployees = trpc.getEmployees.useQuery();
	const getLeaves = trpc.getLeaves.useQuery();
	const updateLeave = trpc.updateLeave.useMutation({
		onSuccess: () => {
			getLeaves.refetch();
			setNotification({
				message: "Leave Updated Successfully",
				error: false
			});
		},
		onSettled: () => setIsChangeLoading(false),
		onError: (error) => {
			setNotification({ message: error.message, error: true });
		}
	});

	const form = useForm({
		mode: "uncontrolled",
		initialValues: {
			employeeId: leave.employeeId || "",
			leaveReason: leave.leaveReason || "",
			reference: leave.reference || ""
		},
		validate: {
			employeeId: isNotEmpty("Employee is required"),
			leaveReason: hasLength(
				{ min: 2 },
				"Reason for leave must be more than 2 characters long"
			),
			reference: isNotEmpty("Reference is required")
		}
	});

	useEffect(() => {
		if (leave) {
			setDate([new Date(leave.fromDate), new Date(leave.toDate)]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function handleForm(values: typeof form.values) {
		setIsChangeLoading(true);
		const [start, end] = date;
		if (start === null || end === null) {
			form.setErrors({ start: "Leave Duration Empty" });
			return;
		}
		const leaveData = {
			...values,
			id: leave.id,
			fromDate: start,
			toDate: end,
			modifiedBy: session?.user.id as string
		};
		if (form.isValid()) {
			updateLeave.mutate(leaveData);
		}
	}

	return (
		<>
			{notification && (
				<Notification
					title="Notification"
					color={notification.error ? "red" : "green"}
					onClose={() => setNotification(null)}
				>
					{notification.message}
				</Notification>
			)}
			<Box pos="relative">
				<LoadingOverlay
					visible={isChangeLoading}
					zIndex={1000}
					overlayProps={{ radius: "sm", blur: 2 }}
					loaderProps={{ type: "bars" }}
				/>
				<form onSubmit={form.onSubmit(handleForm)}>
					<Select
						withAsterisk
						label="Select Employee:"
						mt="md"
						data={getEmployees.data?.map((e) => ({
							label: `${e.fname} ${e.lname}`,
							value: e.id as string
						}))}
						key={form.key("employeeId")}
						{...form.getInputProps("employeeId")}
					/>
					<Textarea
						withAsterisk
						label="Reason for Leave"
						mt="md"
						key={form.key("leaveReason")}
						{...form.getInputProps("leaveReason")}
					/>
					<DatePickerInput
						withAsterisk
						type="range"
						mt="md"
						allowSingleDateInRange
						label="Pick Leave Duration"
						placeholder="Pick Leave Duration"
						value={date}
						onChange={setDate}
						error={form.errors.start}
					/>
					<Select
						withAsterisk
						label="Select Reference:"
						mt="md"
						data={referenceData.map((r) => ({
							label: r.label,
							value: r.label
						}))}
						key={form.key("reference")}
						{...form.getInputProps("reference")}
					/>
					<Group
						justify="center"
						mt="md"
					>
						<Button type="submit">Submit</Button>
					</Group>
				</form>
			</Box>
		</>
	);
}

export default UpdateLeaveForm;
