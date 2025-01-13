import { accessCheckError } from "@/lib/routeProtection";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import * as yup from "yup";

const prisma = new PrismaClient();

export const UpdateRoleSchema = yup.object({
	id: yup.string().required(),
	name: yup.string().uppercase().required(),
	permissions: yup.number().required(),
	index: yup.number().required()
});

type RoleInput = yup.InferType<typeof UpdateRoleSchema>;

export async function updateRole(opts: { input: RoleInput }) {
	const accessError = await accessCheckError(["ROLES_READ", "ROLES_UPDATE"]);

	if (accessError) {
		throw new TRPCError({
			code: accessError.status as TRPCError["code"],
			message: accessError.message
		});
	}

	try {
		await prisma.role.update({
			where: { id: opts.input.id },
			data: {
				name: opts.input.name,
				index: opts.input.index,
				permissions: opts.input.permissions
			}
		});
		return true;
	} catch (error) {
		console.log("Failed to update role", error);
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to update role"
		});
	}
}
