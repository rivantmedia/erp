import { accessCheckError } from "@/lib/routeProtection";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import * as yup from "yup";

const prisma = new PrismaClient();

export const DeleteRoleSchema = yup.string().required();

type RoleInput = yup.InferType<typeof DeleteRoleSchema>;

export async function deleteRole(opts: { input: RoleInput }) {
	const accessError = await accessCheckError(["ROLES_READ", "ROLES_DELETE"]);

	if (accessError) {
		throw new TRPCError({
			code: accessError.status as TRPCError["code"],
			message: accessError.message
		});
	}

	try {
		await prisma.role.delete({
			where: { id: opts.input }
		});
		return true;
	} catch (error) {
		console.log("Failed to delete role", error);
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to delete role"
		});
	}
}
