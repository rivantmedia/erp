import { accessCheckError } from "@/lib/routeProtection";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import * as yup from "yup";

const prisma = new PrismaClient();

export const UpdateEmployeeSchema = yup.object({
	id: yup.string().required(),
	fname: yup.string().required(),
	lname: yup.string().required(),
	email: yup.string().required(),
	department: yup.string().required(),
	title: yup.string().required(),
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

type EmployeeInput = yup.InferType<typeof UpdateEmployeeSchema>;

export async function updateEmployee(opts: { input: EmployeeInput }) {
	const accessError = await accessCheckError([
		"EMPLOYEES_UPDATE",
		"EMPLOYEES_READ_SENSITIVE_INFO"
	]);

	if (accessError) {
		throw new TRPCError({
			code: accessError.status as TRPCError["code"],
			message: accessError.message
		});
	}

	try {
		await prisma.employee.update({
			where: { id: opts.input.id },
			data: {
				fname: opts.input.fname,
				lname: opts.input.lname,
				email: opts.input.email,
				department: opts.input.department,
				title: opts.input.title,
				contact: opts.input.contact,
				roleId: opts.input.roleId,
				type: opts.input.type,
				status: opts.input.status,
				location: opts.input.location,
				appliedOn: opts.input.appliedOn,
				cvFile: opts.input.cvFile,
				doj: opts.input.doj,
				contractEndDate: opts.input.contractEndDate,
				dateOfLeaving: opts.input.dateOfLeaving,
				contract: opts.input.contract,
				personalMail: opts.input.personalMail,
				personalPhone: opts.input.personalPhone,
				whatsapp: opts.input.whatsapp,
				photo: opts.input.photo,
				upiId: opts.input.upiId,
				dob: opts.input.dob,
				aadhar: opts.input.aadhar,
				PAN: opts.input.PAN,
				bank: opts.input.bank,
				bankingName: opts.input.bankingName,
				accountNo: opts.input.accountNo,
				ifsc: opts.input.ifsc,
				avgScore: opts.input.avgScore,
				retainChoice: opts.input.retainChoice,
				extEligible: opts.input.extEligible
			}
		});
		return true;
	} catch (error) {
		console.log("Failed to update employee", error);
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to update employee"
		});
	}
}
