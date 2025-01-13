import { PrismaClient } from "@prisma/client";
import * as yup from "yup";
import { accessCheckError } from "@/lib/routeProtection";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();

export const AddLeaveSchema = yup.object({
	employeeId: yup.string().required(),
	leaveReason: yup.string().required(),
	fromDate: yup.date().required(),
	toDate: yup.date().required(),
	reference: yup.string().required(),
	createdBy: yup.string().required(),
	modifiedBy: yup.string().notRequired()
});

type LeaveInput = yup.InferType<typeof AddLeaveSchema>;

export async function addLeave(opts: { input: LeaveInput }) {
	const accessError = await accessCheckError([
		"EMPLOYEES_READ",
		"LEAVES_CREATE"
	]);

	if (accessError) {
		throw new TRPCError({
			code: accessError.status as TRPCError["code"],
			message: accessError.message
		});
	}

	try {
		await prisma.leave.create({
			data: opts.input
		});

		return true;
	} catch (e) {
		console.log("Failed to create task", e);
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to create task"
		});
	}
}
