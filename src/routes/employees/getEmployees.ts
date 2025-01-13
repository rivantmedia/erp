import { accessCheckError } from "@/lib/routeProtection";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();

export async function getEmployees() {
	const accessErrorSensitive = await accessCheckError([
		"EMPLOYEES_READ_SENSITIVE_INFO"
	]);

	if (accessErrorSensitive === null) {
		try {
			const employees = await prisma.employee.findMany({
				orderBy: { employeeId: "asc" }
			});
			return employees;
		} catch (error) {
			console.log("Failed to get employees", error);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to get employees"
			});
		}
	}

	const accessErrorBasic = await accessCheckError([
		"EMPLOYEES_READ_BASIC_INFO"
	]);

	if (accessErrorBasic === null) {
		try {
			const employees = await prisma.employee.findMany({
				select: {
					id: true,
					fname: true,
					lname: true,
					title: true,
					email: true,
					contact: true,
					department: true,
					employeeId: true,
					roleId: true,
					type: true,
					status: true,
					location: true,
					appliedOn: true,
					cvFile: true,
					doj: true,
					contractEndDate: true,
					dateOfLeaving: true,
					contract: true,
					personalMail: true,
					personalPhone: true,
					whatsapp: true,
					avgScore: true,
					retainChoice: true,
					extEligible: true
				},
				orderBy: { employeeId: "asc" }
			});
			return employees;
		} catch (error) {
			console.log("Failed to get employees", error);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to get employees"
			});
		}
	}

	const accessError = await accessCheckError(["EMPLOYEES_READ"]);

	if (accessError === null) {
		try {
			const employees = await prisma.employee.findMany({
				select: {
					id: true,
					fname: true,
					lname: true,
					title: true,
					email: true,
					contact: true,
					department: true,
					employeeId: true
				},
				orderBy: { employeeId: "asc" }
			});
			return employees;
		} catch (error) {
			console.log("Failed to get employees", error);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to get employees"
			});
		}
	}

	throw new TRPCError({
		code: accessError.status as TRPCError["code"],
		message: accessError.message
	});
}
