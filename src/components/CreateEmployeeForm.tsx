import { Employee, useEmployees } from "@/context/EmployeesContext";
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
import { DatePickerInput } from "@mantine/dates";
import {
	hasLength,
	isEmail,
	isInRange,
	isNotEmpty,
	useForm
} from "@mantine/form";
import { useState } from "react";

function CreateEmployeeForm() {
	const [notification, setNotification] = useState<{
		message: string;
		error: boolean;
	} | null>(null);
	const { employees, isChangeLoading, addEmployee } = useEmployees() as {
		employees: Employee[];
		isChangeLoading: boolean;
		addEmployee: (employee: Employee) => {
			message: string;
			error: boolean;
		};
	};
	const { roles } = useRoles() as { roles: Role[] };
	const form = useForm({
		mode: "uncontrolled",
		initialValues: {
			sAdmin: false,
			fname: "",
			lname: "",
			email: "",
			employeeId: 0,
			department: "",
			title: "",
			contact: 0,
			roleId: "",
			type: "",
			status: "",
			location: "",
			appliedOn: undefined,
			cvFile: "",
			doj: undefined,
			contractEndDate: undefined,
			dateOfLeaving: undefined,
			contract: "",
			personalMail: "",
			personalPhone: undefined,
			whatsapp: undefined,
			photo: "",
			upiId: "",
			dob: undefined,
			aadhar: undefined,
			PAN: "",
			bank: "",
			bankingName: "",
			accountNo: undefined,
			ifsc: "",
			avgScore: undefined,
			retainChoice: "",
			extEligible: undefined
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
			email: isEmail("Invalid email") && checkEmail,
			employeeId:
				isInRange({ min: 1 }, "Employee ID must be more than 0") &&
				checkID,
			department: isNotEmpty("Department is required"),
			title: isNotEmpty("Role is required"),
			contact: isInRange(
				{ min: 1000000000 },
				"Contact number should have 10 digits"
			),
			roleId: isNotEmpty("Role is required")
		}
	});

	function checkEmail(value: string) {
		const employee = employees.find((e) => e.email === value);
		if (employee) {
			return "Email already exist.";
		}
	}

	function checkID(value: number) {
		const employee = employees.find((e) => e.employeeId === value);
		if (employee) {
			return "Employee ID already exist.";
		}
	}

	async function handleForm(values: Employee) {
		if (form.isValid()) {
			const res = await addEmployee(values);
			if (!res.error) {
				form.reset();
			}
			setNotification(res);
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
						key={form.key("title")}
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
					<TextInput
						label="Type"
						mt="md"
						key={form.key("type")}
						{...form.getInputProps("type")}
					/>
					<TextInput
						label="Status"
						mt="md"
						key={form.key("status")}
						{...form.getInputProps("status")}
					/>
					<TextInput
						label="Location"
						mt="md"
						key={form.key("location")}
						{...form.getInputProps("location")}
					/>
					<DatePickerInput
						label="Applied On"
						mt="md"
						key={form.key("appliedOn")}
						{...form.getInputProps("appliedOn")}
					/>
					<TextInput
						label="CV File"
						mt="md"
						key={form.key("cvFile")}
						{...form.getInputProps("cvFile")}
					/>
					<DatePickerInput
						label="Date of Joining"
						mt="md"
						key={form.key("doj")}
						{...form.getInputProps("doj")}
					/>
					<DatePickerInput
						label="Internship/Contract End Date"
						mt="md"
						key={form.key("contractEndDate")}
						{...form.getInputProps("contractEndDate")}
					/>
					<DatePickerInput
						label="Resignation/Date of Leaving"
						mt="md"
						key={form.key("dateOfLeaving")}
						{...form.getInputProps("dateOfLeaving")}
					/>
					<TextInput
						label="Contract"
						mt="md"
						key={form.key("contract")}
						{...form.getInputProps("contract")}
					/>
					<TextInput
						label="Personal Mail"
						mt="md"
						key={form.key("personalMail")}
						{...form.getInputProps("personalMail")}
					/>
					<NumberInput
						label="Personal Contact Number"
						mt="md"
						key={form.key("personalPhone")}
						{...form.getInputProps("personalPhone")}
					/>
					<NumberInput
						label="Whatsapp Number"
						mt="md"
						key={form.key("whatsapp")}
						{...form.getInputProps("whatsapp")}
					/>
					<TextInput
						label="Passport Size Photo"
						mt="md"
						key={form.key("photo")}
						{...form.getInputProps("photo")}
					/>
					<TextInput
						label="UPI ID"
						mt="md"
						key={form.key("upiId")}
						{...form.getInputProps("upiId")}
					/>
					<DatePickerInput
						label="Date of Birth"
						mt="md"
						key={form.key("dob")}
						{...form.getInputProps("dob")}
					/>
					<NumberInput
						label="Aadhar Number"
						mt="md"
						key={form.key("aadhar")}
						{...form.getInputProps("aadhar")}
					/>
					<TextInput
						label="PAN Number"
						mt="md"
						key={form.key("PAN")}
						{...form.getInputProps("PAN")}
					/>
					<TextInput
						label="Bank"
						mt="md"
						key={form.key("bank")}
						{...form.getInputProps("bank")}
					/>
					<TextInput
						label="Banking Name"
						mt="md"
						key={form.key("bankingName")}
						{...form.getInputProps("bankingName")}
					/>
					<NumberInput
						label="Account Number"
						mt="md"
						key={form.key("accountNo")}
						{...form.getInputProps("accountNo")}
					/>
					<TextInput
						label="IFSC Code"
						mt="md"
						key={form.key("ifsc")}
						{...form.getInputProps("ifsc")}
					/>
					<NumberInput
						label="Average Performance Score"
						mt="md"
						key={form.key("avgScore")}
						{...form.getInputProps("avgScore")}
					/>
					<TextInput
						label="Retain Choice"
						mt="md"
						key={form.key("retainChoice")}
						{...form.getInputProps("retainChoice")}
					/>
					<Select
						label="Is eligible for extension"
						mt="md"
						data={[
							{ label: "Eligible", value: "true" },
							{ label: "Non Eligible", value: "false" }
						]}
						key={form.key("extEligible")}
						{...form.getInputProps("extEligible")}
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
