import { accessCheckError } from "@/lib/routeProtection";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import * as yup from "yup";

const prisma = new PrismaClient();

export const DeleteEmployeeSchema = yup.string().required();

type EmployeeInput = yup.InferType<typeof DeleteEmployeeSchema>;

export async function deleteEmployee(opts: { input: EmployeeInput }) {
	const accessError = await accessCheckError(["EMPLOYEES_DELETE"]);

	if (accessError) {
		throw new TRPCError({
			code: accessError.status as TRPCError["code"],
			message: accessError.message
		});
	}

	try {
		await prisma.employee.delete({
			where: { id: opts.input }
		});
		return true;
	} catch (error) {
		console.log("Failed to delete employee", error);
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to delete employee"
		});
	}
}
