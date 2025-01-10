import { PrismaClient } from "@prisma/client";
import { accessCheckError } from "@/lib/routeProtection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

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
			return { tasks, status: 200 };
		} catch (error) {
			console.log("Failed to get tasks", error);
			return { message: "Failed to get tasks", status: 500 };
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
			return { tasks, status: 200 };
		} catch (error) {
			console.log("Failed to get employees", error);
			return { message: "Failed to get employees", status: 500 };
		}
	}

	return { message: accessError2.message, status: accessError2.status };
}
