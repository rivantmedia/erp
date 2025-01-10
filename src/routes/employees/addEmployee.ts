import { accessCheckError } from "@/lib/routeProtection";
import { Prisma, PrismaClient } from "@prisma/client";
import * as yup from "yup";

const prisma = new PrismaClient();

export const AddEmployeeSchema = yup.object({
	fname: yup.string().required(),
	lname: yup.string().required(),
	email: yup.string().email().required(),
	department: yup.string().required(),
	title: yup.string().required(),
	employeeId: yup.number().required().positive().integer(),
	contact: yup.number().required(),
	sAdmin: yup.boolean().required(),
	roleId: yup.string().required(),
	type: yup.string().notRequired(),
	status: yup.string().notRequired(),
	location: yup.string().notRequired(),
	appliedOn: yup.date().notRequired(),
	cvFile: yup.string().notRequired(),
	doj: yup.date().notRequired(),
	contractEndDate: yup.date().notRequired(),
	dateOfLeaving: yup.date().notRequired(),
	contract: yup.string().notRequired(),
	personalMail: yup.string().notRequired(),
	personalPhone: yup.number().notRequired(),
	whatsapp: yup.number().notRequired(),
	photo: yup.string().notRequired(),
	upiId: yup.string().notRequired(),
	dob: yup.date().notRequired(),
	aadhar: yup.number().notRequired(),
	PAN: yup.string().notRequired(),
	bank: yup.string().notRequired(),
	bankingName: yup.string().notRequired(),
	accountNo: yup.number().notRequired(),
	ifsc: yup.string().notRequired(),
	avgScore: yup.number().notRequired(),
	retainChoice: yup.string().notRequired(),
	extEligible: yup.boolean().notRequired()
});

type EmployeeInput = yup.InferType<typeof POSTSchema>;

export async function addEmployee(opts: { input: EmployeeInput }) {
	const accessError = await accessCheckError(["EMPLOYEES_CREATE"]);

	if (accessError) {
		return { message: accessError.message, status: accessError.status };
	}

	try {
		const employee = await prisma.employee.create({
			data: opts.input
		});
		return { employee, status: 201 };
	} catch (e: unknown | Prisma.PrismaClientKnownRequestError) {
		if (
			e instanceof Prisma.PrismaClientKnownRequestError &&
			e.code == "P2002"
		) {
			return { message: "Employee already exist.", status: 400 };
		}
		console.log("Failed to create employee", e);
		return { message: "Failed to create employee", status: 500 };
	}
}
