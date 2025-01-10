import { PrismaClient } from "@prisma/client";
import * as yup from "yup";
import { accessCheckError } from "@/lib/routeProtection";
import { google } from "googleapis";
import { sendEmail } from "@/lib/sendEmail";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

export const UpdateTaskSchema = yup.object({
	id: yup.string().required(),
	project: yup.string().required(),
	name: yup.string().required(),
	description: yup.string().required(),
	summary: yup.string().required(),
	assigneeId: yup.string().required(),
	assignedEmail: yup.string().required(),
	creatorId: yup.string().required(),
	start: yup.date().required(),
	end: yup.date().required(),
	calendarEventId: yup.string().required()
});

type TaskInput = yup.InferType<typeof UpdateTaskSchema>;

export async function updateTask(opts: { input: TaskInput }) {
	const session = await getServerSession(authOptions);
	const accessError1 = await accessCheckError(["TASKS_EDIT"]);

	try {
		const accessError2 = session?.user.id === opts.input.creatorId;

		if (accessError1 === null || accessError2) {
			const oAuth2Client = new google.auth.OAuth2(
				process.env.GOOGLE_CLIENT_ID,
				process.env.GOOGLE_CLIENT_SECRET,
				process.env.NEXTAUTH_URL
			);
			oAuth2Client.setCredentials({
				refresh_token: process.env.GOOGLE_REFRESH_TOKEN
			});

			const calendar = google.calendar({
				version: "v3",
				auth: oAuth2Client
			});

			const taskEvent = await calendar.events.update({
				calendarId: "primary",
				eventId: opts.input.calendarEventId,
				requestBody: {
					summary: opts.input.name,
					description: opts.input.description,
					start: {
						dateTime: opts.input.start.toISOString(),
						timeZone:
							Intl.DateTimeFormat().resolvedOptions().timeZone
					},
					end: {
						dateTime: opts.input.end.toISOString(),
						timeZone:
							Intl.DateTimeFormat().resolvedOptions().timeZone
					},
					attendees: [{ email: opts.input.assignedEmail }]
				}
			});

			const task = await prisma.task.update({
				where: { id: opts.input.id },
				data: {
					project: opts.input.project,
					name: opts.input.name,
					description: opts.input.description,
					summary: opts.input.summary,
					assigneeId: opts.input.assigneeId,
					start: opts.input.start,
					end: opts.input.end,
					calendarEventId:
						taskEvent.data.id ?? opts.input.calendarEventId
				},
				include: { assignee: true, creator: true }
			});

			if (!task) throw new Error("Failed to create task");

			const emailData = {
				project: task.project,
				name: task.name,
				description: task.description,
				summary: task.summary,
				assignee: `${task.assignee.fname} ${task.assignee.lname}`,
				creator: `${task.creator.fname} ${task.creator.lname}`,
				start: new Date(task.start).toLocaleDateString(),
				end: new Date(task.end).toLocaleDateString()
			};

			const emailResponse = await sendEmail(
				"Task Details Have Been Updated",
				emailData,
				task.assignee.email
			);

			if (emailResponse.status !== 200)
				console.log("Failed to send email");

			return { task, status: 200 };
		}

		return { message: accessError1?.message, status: accessError1?.status };
	} catch (error) {
		console.log("Failed to update employee", error);
		return { message: "Failed to update employee", status: 500 };
	}
}
