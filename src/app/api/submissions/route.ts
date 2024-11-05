import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as yup from "yup";
import { accessCheckError } from "@/lib/routeProtection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { sendEmail } from "@/lib/sendEmail";

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

const submissionStatus = {
	pending: "Pending Review",
	accepted: "Accepted",
	rejected: "Revision Required"
};

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
			where: { id: data.taskId },
			include: {
				assignee: true
			}
		});

		if (!task || task?.assigneeId !== session?.user.id)
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

		if (!submission) throw new Error("Failed to create submission");

		const emailData = {
			name: task.name,
			submissionDate: submission.submissionDate.toLocaleDateString(),
			note: submission.note,
			status: submissionStatus[
				submission.status as keyof typeof submissionStatus
			]
		};

		const emailResponse = await sendEmail(
			`A Submission has been made for the task ${task?.name}`,
			emailData,
			task.assignee.email as string
		);

		if (emailResponse.status !== 200)
			throw new Error("Failed to send email");

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
			where: { id: data.taskId },
			include: {
				assignee: true
			}
		});

		if (!task || task?.creatorId !== session?.user.id)
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

		if (!submission) throw new Error("Failed to create submission");

		const emailData = {
			name: task.name,
			submissionDate: submission.submissionDate.toLocaleDateString(),
			remarks: submission.remarks,
			status: submissionStatus[
				submission.status as keyof typeof submissionStatus
			]
		};

		const emailResponse = await sendEmail(
			`Your Submission for the task ${task?.name} has been Reviewed`,
			emailData,
			task.assignee.email as string
		);

		if (emailResponse.status !== 200)
			throw new Error("Failed to send email");

		return Response.json(submission, { status: 201 });
	} catch (e) {
		console.log("Failed to create submission", e);
		return Response.json(
			{ message: "Failed to create submission" },
			{ status: 500 }
		);
	}
}
