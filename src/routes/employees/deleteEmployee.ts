import { accessCheckError } from "@/lib/routeProtection";
import { PrismaClient } from "@prisma/client";
import * as yup from "yup";

const prisma = new PrismaClient();

export const DeleteEmployeeSchema = yup.object({
	id: yup.string().required()
});

type EmployeeInput = yup.InferType<typeof DeleteEmployeeSchema>;

export async function deleteEmployee(opts: { input: EmployeeInput }) {
	const accessError = await accessCheckError(["EMPLOYEES_DELETE"]);

	if (accessError) {
		return { message: accessError.message, status: accessError.status };
	}

	try {
		const employee = await prisma.employee.delete({
			where: { id: opts.input.id }
		});
		return { employee, status: 200 };
	} catch (error) {
		console.log("Failed to delete employee", error);
		return { message: "Failed to delete employee", status: 500 };
	}
}
