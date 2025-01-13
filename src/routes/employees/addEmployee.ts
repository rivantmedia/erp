import { accessCheckError } from "@/lib/routeProtection";
import { Prisma, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
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

type EmployeeInput = yup.InferType<typeof AddEmployeeSchema>;

export async function addEmployee(opts: { input: EmployeeInput }) {
	const accessError = await accessCheckError(["EMPLOYEES_CREATE"]);

	if (accessError) {
		throw new TRPCError({
			code: accessError.status as TRPCError["code"],
			message: accessError.message
		});
	}

	try {
		await prisma.employee.create({
			data: opts.input
		});
		return true;
	} catch (e: unknown | Prisma.PrismaClientKnownRequestError) {
		if (
			e instanceof Prisma.PrismaClientKnownRequestError &&
			e.code == "P2002"
		) {
			throw new TRPCError({
				code: "CONFLICT",
				message: "Employee already exists"
			});
		}
		console.log("Failed to create employee", e);
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to create employee"
		});
	}
}
