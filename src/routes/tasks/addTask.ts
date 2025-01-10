import { PrismaClient } from "@prisma/client";
import * as yup from "yup";
import { accessCheckError } from "@/lib/routeProtection";
import { google } from "googleapis";
import { sendEmail } from "@/lib/sendEmail";

const prisma = new PrismaClient();

export const AddTaskSchema = yup.object({
	project: yup.string().required(),
	name: yup.string().required(),
	description: yup.string().required(),
	summary: yup.string().required(),
	assigneeId: yup.string().required(),
	assignedEmail: yup.string().required(),
	creatorId: yup.string().required(),
	start: yup.date().required(),
	end: yup.date().required()
});

type TaskInput = yup.InferType<typeof AddTaskSchema>;

export async function addTask(opts: { input: TaskInput }) {
	const accessError = await accessCheckError([
		"EMPLOYEES_READ",
		"TASKS_CREATE"
	]);

	if (accessError) {
		return { message: accessError.message, status: accessError.status };
	}

	try {
		const oAuth2Client = new google.auth.OAuth2(
			process.env.GOOGLE_CLIENT_ID,
			process.env.GOOGLE_CLIENT_SECRET,
			process.env.NEXTAUTH_URL
		);
		oAuth2Client.setCredentials({
			refresh_token: process.env.GOOGLE_REFRESH_TOKEN
		});

		const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

		const taskEvent = await calendar.events.insert({
			calendarId: "primary",
			requestBody: {
				summary: opts.input.name,
				description: opts.input.description,
				start: {
					dateTime: opts.input.start.toISOString(),
					timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
				},
				end: {
					dateTime: opts.input.end.toISOString(),
					timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
				},
				attendees: [{ email: opts.input.assignedEmail }]
			}
		});

		if (taskEvent.status !== 200)
			throw new Error("Failed to create calendar event");

		const task = await prisma.task.create({
			data: {
				project: opts.input.project,
				name: opts.input.name,
				description: opts.input.description,
				summary: opts.input.summary,
				assigneeId: opts.input.assigneeId,
				creatorId: opts.input.creatorId,
				start: opts.input.start,
				end: opts.input.end,
				calendarEventId: taskEvent.data.id ?? ""
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
			"New Task Has Been Assigned",
			emailData,
			task.assignee.email
		);

		if (emailResponse.status !== 200) console.log("Failed to send email");

		return { task, status: 201 };
	} catch (e) {
		console.log("Failed to create task", e);
		return { message: "Failed to create task", status: 500 };
	}
}
