import { useRoles } from "@/context/RolesContext";
import { PermissionsResolvable } from "@/lib/UserPermissions";
import {
	ActionIcon,
	Anchor,
	Badge,
	Group,
	Loader,
	Stack,
	Text
} from "@mantine/core";
import ModalContainer from "./ModalContainer";
import UpdateEmployeeForm from "./UpdateEmployeeForm";
import { IconTrash } from "@tabler/icons-react";
import { trpc } from "@/app/_trpc/client";
import { Employee } from "@prisma/client";
import { useState } from "react";

function EmployeeDetail({ employee }: { employee: Employee }) {
	const [loading, setLoading] = useState(false);
	const getEmployees = trpc.getEmployees.useQuery();
	const deleteEmployee = trpc.deleteEmployee.useMutation({
		onSuccess: () => {
			getEmployees.refetch();
		},
		onSettled: () => {
			setLoading(false);
		}
	});
	const { accessCheckError } = useRoles() as {
		accessCheckError: (
			permissionRequired: PermissionsResolvable
		) => boolean;
	};
	const employeeEditPermission = accessCheckError([
		"EMPLOYEES_UPDATE",
		"EMPLOYEES_READ_SENSITIVE_INFO",
		"ROLES_READ"
	]);
	const employeeDeletePermission = accessCheckError(["EMPLOYEES_DELETE"]);
	const employeeViewSensitiveDetailsPermission = accessCheckError([
		"EMPLOYEES_READ_SENSITIVE_INFO"
	]);

	return (
		<Stack
			align="stretch"
			justify="center"
			gap="md"
		>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					First Name:
				</Text>
				<Text>{employee.fname}</Text>
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Last Name:
				</Text>
				<Text>{employee.lname}</Text>
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Job Title
				</Text>
				<Badge variant="light">{employee.title}</Badge>
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Work Email:
				</Text>
				<Anchor
					href={`mailto:${employee.email}`}
					size="sm"
				>
					{employee.email}
				</Anchor>
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Department:
				</Text>
				<Text>{employee.department}</Text>
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Work Phone:
				</Text>
				<Text>{employee.contact}</Text>
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Employee ID:
				</Text>
				<Text>{employee.employeeId}</Text>
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Type:
				</Text>
				<Text>{employee.type ? employee.type : "N/A"}</Text>
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Status:
				</Text>
				<Text>{employee.status ? employee.status : "N/A"}</Text>
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Location:
				</Text>
				<Text>{employee.location ? employee.location : "N/A"}</Text>
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Applied On:
				</Text>
				<Badge variant="light">
					{employee.appliedOn
						? new Date(employee.appliedOn).toLocaleDateString()
						: "N/A"}
				</Badge>
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					CV File:
				</Text>
				{employee.cvFile ? (
					<Anchor
						href={employee.cvFile}
						target="_blank"
					>
						{employee.cvFile}
					</Anchor>
				) : (
					<Text>N/A</Text>
				)}
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Date of Joining:
				</Text>
				<Badge variant="light">
					{employee.doj
						? new Date(employee.doj).toLocaleDateString()
						: "N/A"}
				</Badge>
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Internship/Contract End Date:
				</Text>
				<Badge variant="light">
					{employee.contractEndDate
						? new Date(
								employee.contractEndDate
						  ).toLocaleDateString()
						: "N/A"}
				</Badge>
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Resignation/Date of Leaving:
				</Text>
				<Badge variant="light">
					{employee.dateOfLeaving
						? new Date(employee.dateOfLeaving).toLocaleDateString()
						: "N/A"}
				</Badge>
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Signed LOA/Contract:
				</Text>
				{employee.contract ? (
					<Anchor
						href={employee.contract}
						target="_blank"
					>
						{employee.contract}
					</Anchor>
				) : (
					<Text>N/A</Text>
				)}
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Personal Mail:
				</Text>
				{employee.personalMail ? (
					<Anchor href={`mailto:${employee.personalMail}`}>
						{employee.personalMail}
					</Anchor>
				) : (
					<Text>N/A</Text>
				)}
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Personal Phone:
				</Text>
				<Text>
					{employee.personalPhone ? employee.personalPhone : "N/A"}
				</Text>
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Whatsapp Number:
				</Text>
				<Text>{employee.whatsapp ? employee.whatsapp : "N/A"}</Text>
			</Group>
			{employeeViewSensitiveDetailsPermission && (
				<>
					<Group>
						<Text
							fw={700}
							c="blue"
						>
							Passport Size Photo:
						</Text>
						{employee.photo ? (
							<Anchor
								href={employee.photo}
								target="_blank"
							>
								{employee.photo}
							</Anchor>
						) : (
							<Text>N/A</Text>
						)}
					</Group>
					<Group>
						<Text
							fw={700}
							c="blue"
						>
							UPI ID:
						</Text>
						<Text>{employee.upiId ? employee.upiId : "N/A"}</Text>
					</Group>
					<Group>
						<Text
							fw={700}
							c="blue"
						>
							Date of Birth:
						</Text>
						<Badge variant="light">
							{employee.dob
								? new Date(employee.dob).toLocaleDateString()
								: "N/A"}
						</Badge>
					</Group>
					<Group>
						<Text
							fw={700}
							c="blue"
						>
							Aadhar Number:
						</Text>
						<Text>{employee.aadhar ? employee.aadhar : "N/A"}</Text>
					</Group>
					<Group>
						<Text
							fw={700}
							c="blue"
						>
							PAN Number:
						</Text>
						<Text>{employee.PAN ? employee.PAN : "N/A"}</Text>
					</Group>
					<Group>
						<Text
							fw={700}
							c="blue"
						>
							Bank:
						</Text>
						<Text>{employee.bank ? employee.bank : "N/A"}</Text>
					</Group>
					<Group>
						<Text
							fw={700}
							c="blue"
						>
							Banking Name:
						</Text>
						<Text>
							{employee.bankingName
								? employee.bankingName
								: "N/A"}
						</Text>
					</Group>
					<Group>
						<Text
							fw={700}
							c="blue"
						>
							Account Number:
						</Text>
						<Text>
							{employee.accountNo ? employee.accountNo : "N/A"}
						</Text>
					</Group>
					<Group>
						<Text
							fw={700}
							c="blue"
						>
							IFSC:
						</Text>
						<Text>{employee.ifsc ? employee.ifsc : "N/A"}</Text>
					</Group>
				</>
			)}
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Average Performance Score:
				</Text>
				<Text>{employee.avgScore ? employee.avgScore : "N/A"}</Text>
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Retain Choice:
				</Text>
				<Text>
					{employee.retainChoice ? employee.retainChoice : "N/A"}
				</Text>
			</Group>
			<Group>
				<Text
					fw={700}
					c="blue"
				>
					Is elegible for extension:
				</Text>
				<Text>
					{employee.extEligible === null ||
					employee.extEligible === undefined
						? "N/A"
						: employee.extEligible
						? "Eligible"
						: "Not Eligible"}
				</Text>
			</Group>
			<Group
				gap={0}
				justify="flex-end"
			>
				{employeeEditPermission && (
					<ModalContainer
						title="Edit Employee"
						type="edit"
					>
						<UpdateEmployeeForm id={employee.id as string} />
					</ModalContainer>
				)}
				{employeeDeletePermission && (
					<ActionIcon
						variant="subtle"
						color="red"
						size="xl"
						onClick={() => {
							setLoading(true);
							deleteEmployee.mutate(employee.id as string);
						}}
					>
						{loading ? (
							<Loader color="red" />
						) : (
							<IconTrash
								style={{ width: "70%", height: "70%" }}
								stroke={1.5}
							/>
						)}
					</ActionIcon>
				)}
			</Group>
		</Stack>
	);
}

export default EmployeeDetail;
