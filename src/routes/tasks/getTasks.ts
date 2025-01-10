import { PrismaClient } from "@prisma/client";
import { accessCheckError } from "@/lib/routeProtection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();

export async function getTasks() {
	const accessError = await accessCheckError(["TASKS_VIEW_ALL"]);
	const session = await getServerSession(authOptions);

	if (accessError === null) {
		try {
			const tasks = await prisma.task.findMany({
				include: {
					Submissions: true,
					assignee: {
						select: { id: true, fname: true, lname: true }
					},
					creator: { select: { id: true, fname: true, lname: true } }
				}
			});
			return tasks;
		} catch (error) {
			console.log("Failed to get tasks", error);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to get tasks"
			});
		}
	}

	const accessError2 = await accessCheckError(["TASKS_VIEW"]);

	if (accessError2 === null) {
		try {
			const tasks = await prisma.task.findMany({
				where: {
					OR: [
						{ assigneeId: session?.user.id as string },
						{ creatorId: session?.user.id as string }
					]
				},
				include: { Submissions: true }
			});
			return tasks;
		} catch (error) {
			console.log("Failed to get tasks", error);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to get tasks"
			});
		}
	}

	throw new TRPCError({
		code: accessError.status as TRPCError["code"],
		message: accessError.message
	});
}
