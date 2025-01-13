import { PrismaClient } from "@prisma/client";
import * as yup from "yup";
import { accessCheckError } from "@/lib/routeProtection";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();

export const UpdateLeaveSchema = yup.object({
	id: yup.string().required(),
	employeeId: yup.string().required(),
	leaveReason: yup.string().required(),
	fromDate: yup.date().required(),
	toDate: yup.date().required(),
	reference: yup.string().required(),
	modifiedBy: yup.string().required()
});

type LeaveInput = yup.InferType<typeof UpdateLeaveSchema>;

export async function updateLeave(opts: { input: LeaveInput }) {
	const accessError = await accessCheckError([
		"LEAVES_READ",
		"LEAVES_UPDATE"
	]);

	if (accessError) {
		throw new TRPCError({
			code: accessError.status as TRPCError["code"],
			message: accessError.message
		});
	}

	try {
		await prisma.leave.update({
			where: {
				id: opts.input.id
			},
			data: {
				employeeId: opts.input.employeeId,
				leaveReason: opts.input.leaveReason,
				fromDate: opts.input.fromDate,
				toDate: opts.input.toDate,
				reference: opts.input.reference,
				modifiedBy: opts.input.modifiedBy
			}
		});

		return true;
	} catch (e) {
		console.log("Failed to update task", e);
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to update task"
		});
	}
}
