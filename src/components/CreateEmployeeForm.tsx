import { useEmployees } from "@/context/EmployeesContext";
import { Notification } from "@mantine/core";
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
import { useState } from "react";

interface EmployeeFormValues {
	fname: string;
	lname: string;
	email: string;
	employeeId: number;
	department: string;
	role: string;
	contact: number | string;
}

function CreateEmployeeForm() {
	const [notification, setNotification] = useState(false);
	const { employees, isLoading, error, addEmployee } = useEmployees() as {
		employees: EmployeeFormValues[];
		isLoading: boolean;
		error: string;
		addEmployee: (employee: EmployeeFormValues) => void;
	};
	const form = useForm({
		mode: "uncontrolled",
		initialValues: {
			fname: "",
			lname: "",
			email: "",
			employeeId: 0,
			department: "",
			role: "",
			contact: 0
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
			role: isNotEmpty("Role is required"),
			contact: isInRange(
				{ min: 1000000000 },
				"Contact number should have 10 digits"
			)
		}
	});

	async function handleForm(values: EmployeeFormValues) {
		const employee = employees.find((e) => e.email === values.email);
		if (employee) {
			form.setFieldError("email", "Email already exist.");
		}
		const id = employees.find((e) => e.employeeId === values.employeeId);
		if (id) {
			form.setFieldError("employeeId", "Employee ID already exist.");
		}
		console.log(form.validate().hasErrors);
		if (!employee && !id) {
			values = { ...values, contact: String(values.contact) };
			await addEmployee(values);
			if (!error) {
				setNotification(true);
				form.reset();
			}
		}
	}

	return (
		<>
			{notification && (
				<Notification
					title="Employee Added"
					color="green"
					onClose={() => setNotification(false)}
				>
					Employee has been added successfully
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
						{...form.getInputProps("role")}
					/>
					<NumberInput
						withAsterisk
						label="Employee Contact Number"
						mt="md"
						key={form.key("contact")}
						{...form.getInputProps("contact")}
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

export default CreateEmployeeForm;
