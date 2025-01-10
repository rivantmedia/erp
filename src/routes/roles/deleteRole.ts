import { accessCheckError } from "@/lib/routeProtection";
import { PrismaClient } from "@prisma/client";
import * as yup from "yup";

const prisma = new PrismaClient();

export const DeleteRoleSchema = yup.object({
	roleId: yup.string().required()
});

type RoleInput = yup.InferType<typeof DeleteRoleSchema>;

export async function deleteRole(opts: { input: RoleInput }) {
	const accessError = await accessCheckError(["ROLES_READ", "ROLES_DELETE"]);

	if (accessError) {
		return { message: accessError.message, status: accessError.status };
	}

	try {
		const role = await prisma.role.delete({
			where: { id: opts.input.roleId }
		});
		return { role, status: 200 };
	} catch (error) {
		console.log("Failed to delete role", error);
		return { message: "Failed to delete role", status: 500 };
	}
}
