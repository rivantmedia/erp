import { PrismaClient } from "@prisma/client";
import * as yup from "yup";
import { accessCheckError } from "@/lib/routeProtection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();

export const DeleteTaskSchema = yup.object({
	id: yup.string().required(),
	creatorId: yup.string().required()
});

type TaskInput = yup.InferType<typeof DeleteTaskSchema>;

export async function deleteTask(opts: { input: TaskInput }) {
	const session = await getServerSession(authOptions);
	const accessError1 = await accessCheckError(["TASKS_DELETE"]);

	try {
		const accessError2 = session?.user.id === opts.input.creatorId;

		if (accessError1 === null || accessError2) {
			await prisma.task.delete({
				where: { id: opts.input.id }
			});
			return true;
		}

		throw new TRPCError({
			code: accessError1.status as TRPCError["code"],
			message: accessError1.message
		});
	} catch (error) {
		console.log("Failed to delete employee", error);
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to delete task"
		});
	}
}
