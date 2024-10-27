import { useEmployees } from "@/context/EmployeesContext";
import { Role, useRoles } from "@/context/RolesContext";
import { Notification, Select } from "@mantine/core";
import {
	Box,
	Button,
	Group,
	LoadingOverlay,
	NumberInput,
	TextInput
} from "@mantine/core";
import {
	hasLength,
	isEmail,
	isInRange,
	isNotEmpty,
	useForm
} from "@mantine/form";
import { useEffect, useState } from "react";

interface EmployeeFormValues {
	fname: string;
	lname: string;
	email: string;
	employeeId: number;
	department: string;
	title: string;
	contact: number;
	sAdmin?: boolean;
	roleId: string;
}

function UpdateEmployeeForm({ employeeId }: { employeeId: number }) {
	const [notification, setNotification] = useState(false);
	const { employees, isLoading, error, updateEmployee } = useEmployees() as {
		employees: EmployeeFormValues[];
		isLoading: boolean;
		error: string;
		updateEmployee: (employee: EmployeeFormValues) => void;
	};
	const { roles } = useRoles() as { roles: Role[] };

	const form = useForm({
		mode: "uncontrolled",
		initialValues: {
			fname: "",
			lname: "",
			email: "",
			employeeId: 0,
			department: "",
			title: "",
			contact: 0,
			roleId: ""
		},
		validate: {
			fname: hasLength(
				{ min: 2 },
				"First name must be more than 2 characters long"
			),
			lname: hasLength(
				{ min: 2 },
				"Last name must be more than 2 characters long"
			),
			email: isEmail("Invalid email"),
			employeeId: isInRange(
				{ min: 1 },
				"Employee ID must be more than 0"
			),
			department: isNotEmpty("Department is required"),
			title: isNotEmpty("Role is required"),
			contact: isInRange(
				{ min: 1000000000 },
				"Contact number should have 10 digits"
			),
			roleId: isNotEmpty("Role is required")
		}
	});

	useEffect(() => {
		if (employeeId) {
			const employee = employees.find((e) => e.employeeId === employeeId);
			if (employee) {
				form.setInitialValues(employee);
				form.setValues(employee);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [employeeId, employees]);

	async function handleForm(values: EmployeeFormValues) {
		if (form.isValid()) {
			await updateEmployee(values);
			if (!error) {
				setNotification(true);
			}
		}
	}

	return (
		<>
			{notification && (
				<Notification
					title="Employee Updated"
					color="green"
					onClose={() => setNotification(false)}
				>
					Employee data updated successfully
				</Notification>
			)}
			<Box pos="relative">
				<LoadingOverlay
					visible={isLoading}
					zIndex={1000}
					overlayProps={{ radius: "sm", blur: 2 }}
					loaderProps={{ type: "bars" }}
				/>
				<form onSubmit={form.onSubmit(handleForm)}>
					<Group
						justify="center"
						grow
					>
						<TextInput
							withAsterisk
							label="First Name"
							key={form.key("fname")}
							{...form.getInputProps("fname")}
						/>
						<TextInput
							withAsterisk
							label="Last Name"
							key={form.key("lname")}
							{...form.getInputProps("lname")}
						/>
					</Group>
					<TextInput
						withAsterisk
						label="Employee Email"
						mt="md"
						key={form.key("email")}
						{...form.getInputProps("email")}
					/>
					<NumberInput
						withAsterisk
						disabled
						label="Employee ID Number"
						mt="md"
						key={form.key("employeeId")}
						{...form.getInputProps("employeeId")}
					/>
					<TextInput
						withAsterisk
						label="Employee Department"
						mt="md"
						key={form.key("department")}
						{...form.getInputProps("department")}
					/>
					<TextInput
						withAsterisk
						label="Employee Role"
						mt="md"
						key={form.key("role")}
						{...form.getInputProps("title")}
					/>
					<NumberInput
						withAsterisk
						label="Employee Contact Number"
						mt="md"
						key={form.key("contact")}
						{...form.getInputProps("contact")}
					/>
					<Select
						withAsterisk
						label="Role Access"
						mt="md"
						data={roles.map((role) => ({
							label: role.name,
							value: role.id
						}))}
						key={form.key("roleId")}
						{...form.getInputProps("roleId")}
					/>
					<Group
						justify="center"
						mt="md"
					>
						<Button type="submit">Update</Button>
					</Group>
				</form>
			</Box>
		</>
	);
}

export default UpdateEmployeeForm;
