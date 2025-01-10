import { accessCheckError } from "@/lib/routeProtection";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getRoles() {
	const accessError = await accessCheckError("ROLES_READ");

	if (accessError) {
		return { message: accessError.message, status: accessError.status };
	}

	try {
		const roles = await prisma.role.findMany({
			orderBy: { index: "asc" }
		});
		return { roles, status: 200 };
	} catch (error) {
		console.log("Failed to get roles", error);
		return { message: "Failed to get roles", status: 500 };
	}
}
