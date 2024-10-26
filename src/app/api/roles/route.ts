import { NextRequest } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import * as yup from "yup";
import { accessCheckError } from "@/lib/routeProtection";

const prisma = new PrismaClient();

const POSTSchema = yup.object({
	name: yup.string().uppercase().required(),
	permissions: yup.number().required(),
	index: yup.number().required()
});

const DELETESchema = yup.object({
	roleId: yup.string().required()
});

export async function POST(req: NextRequest) {
	const accessError = await accessCheckError(["ROLES_READ", "ROLES_CREATE"]);

	if (accessError) {
		return Response.json(
			{ message: accessError.message },
			{ status: accessError.status }
		);
	}

	try {
		const data = await POSTSchema.validate(await req.json());

		const role = await prisma.role.create({
			data: data
		});
		return Response.json(role, { status: 201 });
	} catch (e: unknown | Prisma.PrismaClientKnownRequestError) {
		if (
			e instanceof Prisma.PrismaClientKnownRequestError &&
			e.code == "P2002"
		) {
			return Response.json(
				{ message: "Role already exists." },
				{ status: 400 }
			);
		}
		console.log("Failed to create role", e);
		return Response.json(
			{ message: "Failed to create role" },
			{ status: 500 }
		);
	}
}

export async function GET() {
	const accessError = await accessCheckError("ROLES_READ");

	if (accessError) {
		return Response.json(
			{ message: accessError.message },
			{ status: accessError.status }
		);
	}

	try {
		const roles = await prisma.role.findMany({
			orderBy: { index: "asc" }
		});
		return Response.json(roles, { status: 200 });
	} catch (error) {
		console.log("Failed to get roles", error);
		return Response.json(
			{ message: "Failed to get roles" },
			{ status: 500 }
		);
	}
}

export async function DELETE(req: NextRequest) {
	const accessError = await accessCheckError(["ROLES_READ", "ROLES_DELETE"]);

	if (accessError) {
		return Response.json(
			{ message: accessError.message },
			{ status: accessError.status }
		);
	}

	const data = await DELETESchema.validate(await req.json());

	try {
		const role = await prisma.role.delete({
			where: { id: data.roleId }
		});
		return Response.json(role, { status: 200 });
	} catch (error) {
		console.log("Failed to delete role", error);
		return Response.json(
			{ message: "Failed to delete role" },
			{ status: 500 }
		);
	}
}
