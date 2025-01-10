import { PrismaClient } from "@prisma/client";
import * as yup from "yup";
import { accessCheckError } from "@/lib/routeProtection";
import { sendEmail } from "@/lib/sendEmail";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

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
		return { message: accessError.message, status: accessError.status };
	}

	try {
		const task = await prisma.task.findUnique({
			where: { id: opts.input.taskId },
			include: {
				assignee: true
			}
		});

		if (!task || task?.assigneeId !== session?.user.id)
			return {
				message: "You are not assigned to this task",
				status: 403
			};

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

		return { submission, status: 201 };
	} catch (e) {
		console.log("Failed to create submission", e);
		return { message: "Failed to create submission", status: 500 };
	}
}
