import { NextRequest } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import * as yup from "yup";
import { accessCheckError } from "@/lib/routeProtection";
import { Roles } from "@/lib/permissions";

const prisma = new PrismaClient();

const POSTSchema = yup.object({
	fname: yup.string().required(),
	lname: yup.string().required(),
	email: yup.string().email().required(),
	department: yup.string().required(),
	title: yup.string().required(),
	employeeId: yup.number().required(),
	contact: yup.number().required(),
	sAdmin: yup.boolean().required(),
	roleId: yup.string().required()
});

const PUTSchema = yup.object({
	fname: yup.string().required(),
	lname: yup.string().required(),
	email: yup.string().required(),
	department: yup.string().required(),
	title: yup.string().required(),
	employeeId: yup.number().required(),
	contact: yup.number().required(),
	roleId: yup.string().required()
});

const DELETESchema = yup.object({
	employeeId: yup.number().required()
});

export async function POST(req: NextRequest) {
	const accessError = await accessCheckError(
		Roles.EMPLOYEES_READ_SENSITIVE_INFO & Roles.EMPLOYEES_CREATE
	);

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

export async function PUT(req: NextRequest) {
	const accessError = await accessCheckError(
		Roles.EMPLOYEES_READ_SENSITIVE_INFO & Roles.EMPLOYEES_UPDATE
	);

	if (accessError) {
		return Response.json(
			{ message: accessError.message },
			{ status: accessError.status }
		);
	}

	try {
		const data = await PUTSchema.validate(await req.json());

		const employee = await prisma.employee.update({
			where: { employeeId: data.employeeId },
			data: {
				fname: data.fname,
				lname: data.lname,
				email: data.email,
				department: data.department,
				title: data.title,
				contact: data.contact,
				roleId: data.roleId
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
	const accessError = await accessCheckError(Roles.EMPLOYEES_READ);

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
	const accessError = await accessCheckError(
		Roles.EMPLOYEES_READ_SENSITIVE_INFO & Roles.EMPLOYEES_DELETE
	);

	if (accessError) {
		return Response.json(
			{ message: accessError.message },
			{ status: accessError.status }
		);
	}

	try {
		const data = await DELETESchema.validate(await req.json());
		const employee = await prisma.employee.delete({
			where: { employeeId: data.employeeId }
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
