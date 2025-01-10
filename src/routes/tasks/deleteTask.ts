import { PrismaClient } from "@prisma/client";
import * as yup from "yup";
import { accessCheckError } from "@/lib/routeProtection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

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
			const task = await prisma.task.delete({
				where: { id: opts.input.id }
			});
			return { task, status: 200 };
		}

		return { message: accessError1.message, status: accessError1.status };
	} catch (error) {
		console.log("Failed to delete employee", error);
		return { message: "Failed to delete employee", status: 500 };
	}
}
