import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as yup from "yup";
import { accessCheckError } from "@/lib/routeProtection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

const POSTSchema = yup.object({
	note: yup.string().required(),
	taskId: yup.string().required()
});

const PATCHSchema = yup.object({
	id: yup.string().required(),
	taskId: yup.string().required(),
	status: yup.string().required(),
	remarks: yup.string().required()
});

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions);
	const accessError = await accessCheckError(["TASKS_VIEW"]);

	if (accessError) {
		return Response.json(
			{ message: accessError.message },
			{ status: accessError.status }
		);
	}

	try {
		const data = await POSTSchema.validate(await req.json());

		const task = await prisma.task.findUnique({
			where: { id: data.taskId }
		});

		if (task?.assigneeId !== session?.user.id)
			return Response.json(
				{ message: "You are not assigned to this task" },
				{ status: 403 }
			);

		const submission = await prisma.submission.create({
			data: {
				submissionDate: new Date(),
				note: data.note,
				status: "pending",
				taskId: data.taskId
			}
		});
		return Response.json(submission, { status: 201 });
	} catch (e) {
		console.log("Failed to create submission", e);
		return Response.json(
			{ message: "Failed to create submission" },
			{ status: 500 }
		);
	}
}

export async function PATCH(req: NextRequest) {
	const session = await getServerSession(authOptions);
	const accessError = await accessCheckError(["TASKS_VIEW"]);

	if (accessError) {
		return Response.json(
			{ message: accessError.message },
			{ status: accessError.status }
		);
	}

	try {
		const data = await PATCHSchema.validate(await req.json());

		const task = await prisma.task.findUnique({
			where: { id: data.taskId }
		});

		if (task?.creatorId !== session?.user.id)
			return Response.json(
				{ message: "You are not the creator of this task" },
				{ status: 403 }
			);

		const submission = await prisma.submission.update({
			where: { id: data.id },
			data: {
				status: data.status,
				remarks: data.remarks
			}
		});
		return Response.json(submission, { status: 201 });
	} catch (e) {
		console.log("Failed to create submission", e);
		return Response.json(
			{ message: "Failed to create submission" },
			{ status: 500 }
		);
	}
}
