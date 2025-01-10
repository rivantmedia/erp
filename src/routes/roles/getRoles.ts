import { accessCheckError } from "@/lib/routeProtection";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();

export async function getRoles() {
	const accessError = await accessCheckError("ROLES_READ");

	if (accessError) {
		throw new TRPCError({
			code: accessError.status as TRPCError["code"],
			message: accessError.message
		});
	}

	try {
		const roles = await prisma.role.findMany({
			orderBy: { index: "asc" }
		});
		return roles;
	} catch (error) {
		console.log("Failed to get roles", error);
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to get roles"
		});
	}
}
