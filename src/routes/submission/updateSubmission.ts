import { PrismaClient } from "@prisma/client";
import * as yup from "yup";
import { accessCheckError } from "@/lib/routeProtection";
import { sendEmail } from "@/lib/sendEmail";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();

export const UpdateSubmissionSchema = yup.object({
	id: yup.string().required(),
	taskId: yup.string().required(),
	status: yup.string().required(),
	remarks: yup.string().required()
});

type SubmissionInput = yup.InferType<typeof UpdateSubmissionSchema>;

const submissionStatus = {
	pending: "Pending Review",
	accepted: "Accepted",
	rejected: "Revision Required"
};

export async function updateSubmission(opts: { input: SubmissionInput }) {
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

		if (!task || task?.creatorId !== session?.user.id)
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "You are not authorized to perform this action"
			});

		const submission = await prisma.submission.update({
			where: { id: opts.input.id },
			data: {
				status: opts.input.status,
				remarks: opts.input.remarks
			}
		});

		if (!submission) throw new Error("Failed to create submission");

		const emailData = {
			name: task.name,
			submissionDate: new Date(
				submission.submissionDate
			).toLocaleDateString(),
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

		if (emailResponse.status !== 200) console.log("Failed to send email");

		return true;
	} catch (e) {
		console.log("Failed to create submission", e);
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to create submission"
		});
	}
}
