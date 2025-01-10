import { accessCheckError } from "@/lib/routeProtection";
import { PrismaClient } from "@prisma/client";
import * as yup from "yup";

const prisma = new PrismaClient();

export const AddRoleSchema = yup.object({
	name: yup.string().uppercase().required(),
	permissions: yup.number().required(),
	index: yup.number().required()
});

type RoleInput = yup.InferType<typeof AddRoleSchema>;

export async function addRole(opts: { input: RoleInput }) {
	const accessError = await accessCheckError(["ROLES_READ", "ROLES_CREATE"]);

	if (accessError) {
		return { message: accessError.message, status: accessError.status };
	}

	try {
		const role = await prisma.role.create({
			data: opts.input
		});
		return { role, status: 201 };
	} catch (e) {
		console.log("Failed to create role", e);
		return { message: "Failed to create role", status: 500 };
	}
}
