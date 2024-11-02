import { NextRequest } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import * as yup from "yup";
import { accessCheckError } from "@/lib/routeProtection";

const prisma = new PrismaClient();

const POSTSchema = yup.object({
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

const PATCHSchema = yup.object({
	id: yup.string().required(),
	fname: yup.string().required(),
	lname: yup.string().required(),
	email: yup.string().required(),
	department: yup.string().required(),
	title: yup.string().required(),
	contact: yup.number().required(),
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

const DELETESchema = yup.object({
	id: yup.string().required()
});

export async function POST(req: NextRequest) {
	const accessError = await accessCheckError(["EMPLOYEES_CREATE"]);

	if (accessError) {
		return Response.json(
			{ message: accessError.message },
			{ status: accessError.status }
		);
	}

	try {
		const data = await POSTSchema.validate(await req.json());

		const employee = await prisma.employee.create({
			data: data
		});
		return Response.json(employee, { status: 201 });
	} catch (e: unknown | Prisma.PrismaClientKnownRequestError) {
		if (
			e instanceof Prisma.PrismaClientKnownRequestError &&
			e.code == "P2002"
		) {
			return Response.json(
				{ message: "Employee already exist." },
				{ status: 400 }
			);
		}
		console.log("Failed to create employee", e);
		return Response.json(
			{ message: "Failed to create employee" },
			{ status: 500 }
		);
	}
}

export async function PATCH(req: NextRequest) {
	const accessError = await accessCheckError(["EMPLOYEES_UPDATE"]);

	if (accessError) {
		return Response.json(
			{ message: accessError.message },
			{ status: accessError.status }
		);
	}

	try {
		const data = await PATCHSchema.validate(await req.json());

		const employee = await prisma.employee.update({
			where: { id: data.id },
			data: {
				fname: data.fname,
				lname: data.lname,
				email: data.email,
				department: data.department,
				title: data.title,
				contact: data.contact,
				roleId: data.roleId,
				type: data.type,
				status: data.status,
				location: data.location,
				appliedOn: data.appliedOn,
				cvFile: data.cvFile,
				doj: data.doj,
				contractEndDate: data.contractEndDate,
				dateOfLeaving: data.dateOfLeaving,
				contract: data.contract,
				personalMail: data.personalMail,
				personalPhone: data.personalPhone,
				whatsapp: data.whatsapp,
				photo: data.photo,
				upiId: data.upiId,
				dob: data.dob,
				aadhar: data.aadhar,
				PAN: data.PAN,
				bank: data.bank,
				bankingName: data.bankingName,
				accountNo: data.accountNo,
				ifsc: data.ifsc,
				avgScore: data.avgScore,
				retainChoice: data.retainChoice,
				extEligible: data.extEligible
			}
		});
		return Response.json(employee, { status: 200 });
	} catch (error) {
		console.log("Failed to update employee", error);
		return Response.json(
			{ message: "Failed to update employee" },
			{ status: 500 }
		);
	}
}

export async function GET() {
	const accessError = await accessCheckError(["EMPLOYEES_READ"]);

	if (accessError) {
		return Response.json(
			{ message: accessError.message },
			{ status: accessError.status }
		);
	}

	try {
		const employees = await prisma.employee.findMany({
			orderBy: { employeeId: "asc" }
		});
		return Response.json(employees, { status: 200 });
	} catch (error) {
		console.log("Failed to get employees", error);
		return Response.json(
			{ message: "Failed to get employees" },
			{ status: 500 }
		);
	}
}

export async function DELETE(req: NextRequest) {
	const accessError = await accessCheckError(["EMPLOYEES_DELETE"]);

	if (accessError) {
		return Response.json(
			{ message: accessError.message },
			{ status: accessError.status }
		);
	}

	try {
		const data = await DELETESchema.validate(await req.json());
		const employee = await prisma.employee.delete({
			where: { id: data.id }
		});
		return Response.json(employee, { status: 200 });
	} catch (error) {
		console.log("Failed to delete employee", error);
		return Response.json(
			{ message: "Failed to delete employee" },
			{ status: 500 }
		);
	}
}
