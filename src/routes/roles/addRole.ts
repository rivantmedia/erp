import { accessCheckError } from "@/lib/routeProtection";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
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
		throw new TRPCError({
			code: accessError.status as TRPCError["code"],
			message: accessError.message
		});
	}

	try {
		await prisma.role.create({
			data: opts.input
		});
		return true;
	} catch (e) {
		console.log("Failed to create role", e);
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to create role"
		});
	}
}
