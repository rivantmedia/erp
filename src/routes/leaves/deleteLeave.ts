import { PrismaClient } from "@prisma/client";
import * as yup from "yup";
import { accessCheckError } from "@/lib/routeProtection";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();

export const DeleteLeaveSchema = yup.string().required();

type LeaveInput = yup.InferType<typeof DeleteLeaveSchema>;

export async function deleteLeave(opts: { input: LeaveInput }) {
	const accessError = await accessCheckError(["LEAVES_DELETE"]);

	if (accessError) {
		throw new TRPCError({
			code: accessError.status as TRPCError["code"],
			message: accessError.message
		});
	}

	try {
		await prisma.leave.delete({
			where: { id: opts.input }
		});

		return true;
	} catch (error) {
		console.log("Failed to delete leave", error);
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to delete leave"
		});
	}
}
