import { trpc } from "@/app/_trpc/client";
import { Notification, Select, Textarea } from "@mantine/core";
import { Box, Button, Group, LoadingOverlay } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { useSession } from "next-auth/react";
import { useState } from "react";

const referenceData = [
	{ label: "Via Call", value: "call" },
	{ label: "Via Email", value: "email" },
	{ label: "Via Whatsapp", value: "whatsapp" },
	{ label: "Via Custom Text", value: "text" }
];

function CreateLeaveForm() {
	const [notification, setNotification] = useState<{
		message: string;
		error: boolean;
	} | null>(null);
	const { data: session } = useSession();
	const [date, setDate] = useState<[Date | null, Date | null]>([null, null]);
	const [isChangeLoading, setIsChangeLoading] = useState(false);
	const getEmployees = trpc.getEmployees.useQuery();
	const getLeaves = trpc.getLeaves.useQuery();
	const addLeave = trpc.addLeave.useMutation({
		onSuccess: () => {
			getLeaves.refetch();
			setNotification({
				message: "Leave Added Successfully",
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
			employeeId: "",
			leaveReason: "",
			reference: ""
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

	async function handleForm(values: typeof form.values) {
		const [start, end] = date;
		if (start === null || end === null) {
			form.setErrors({ start: "Leave Duration Empty" });
			return;
		}
		const newLeave = {
			...values,
			fromDate: start,
			toDate: end,
			createdBy: session?.user.id as string
		};
		if (form.isValid()) {
			setIsChangeLoading(true);
			addLeave.mutate(newLeave);
			form.reset();
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
							value: r.value
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

export default CreateLeaveForm;
