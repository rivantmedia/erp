import { PrismaClient } from "@prisma/client";
import * as yup from "yup";
import { accessCheckError } from "@/lib/routeProtection";
import { sendEmail } from "@/lib/sendEmail";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();

export const AddSubmissionSchema = yup.object({
	note: yup.string().required(),
	taskId: yup.string().required()
});

type SubmissionInput = yup.InferType<typeof AddSubmissionSchema>;

const submissionStatus = {
	pending: "Pending Review",
	accepted: "Accepted",
	rejected: "Revision Required"
};

export async function addSubmission(opts: { input: SubmissionInput }) {
	const session = await getServerSession(authOptions);
	const accessError = await accessCheckError(["TASKS_VIEW"]);

	if (accessError) {
		throw new TRPCError({
			code: accessError.status as TRPCError["code"],
			message: accessError.message
		});
	}

	try {
		const task = await prisma.task.findUnique({
			where: { id: opts.input.taskId },
			include: {
				assignee: true
			}
		});

		if (!task || task?.assigneeId !== session?.user.id)
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "You are not allowed to submit this task"
			});

		const submission = await prisma.submission.create({
			data: {
				submissionDate: new Date(),
				note: opts.input.note,
				status: "pending",
				taskId: opts.input.taskId
			}
		});

		if (!submission) throw new Error("Failed to create submission");

		const emailData = {
			name: task.name,
			submissionDate: new Date(
				submission.submissionDate
			).toLocaleDateString(),
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

		return true;
	} catch (e) {
		console.log("Failed to create submission", e);
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to create submission"
		});
	}
}
