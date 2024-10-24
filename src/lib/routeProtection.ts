import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./authOptions";

const prisma = new PrismaClient();

export async function accessCheckError(permissionsRequired: number) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return { message: "Login Required", status: 401 };
	}

	if (session.user.sAdmin) return null;

	//Check if user has enough permissions in case permissions are required to perform action
	if (!session.user.roleId && permissionsRequired)
		return { message: "Missing Permissions", status: 401 };

	const fetchedRole = await prisma.role.findUnique({
		where: { id: session.user.roleId! }
	});

	if (!fetchedRole || !(fetchedRole.permissions & permissionsRequired)) {
		return { message: "Missing Permissions", status: 401 };
	}

	return null;
}
