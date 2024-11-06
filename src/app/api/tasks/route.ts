import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as yup from "yup";
import { accessCheckError } from "@/lib/routeProtection";
import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { sendEmail } from "@/lib/sendEmail";

const prisma = new PrismaClient();

const POSTSchema = yup.object({
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

const PATCHSchema = yup.object({
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

const DELETESchema = yup.object({
	id: yup.string().required(),
	creatorId: yup.string().required()
});

export async function POST(req: NextRequest) {
	const accessError = await accessCheckError([
		"EMPLOYEES_READ",
		"TASKS_CREATE"
	]);

	if (accessError) {
		return Response.json(
			{ message: accessError.message },
			{ status: accessError.status }
		);
	}

	try {
		const data = await POSTSchema.validate(await req.json());

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
				summary: data.name,
				description: data.description,
				start: {
					dateTime: data.start.toISOString(),
					timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
				},
				end: {
					dateTime: data.end.toISOString(),
					timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
				},
				attendees: [{ email: data.assignedEmail }]
			}
		});

		if (taskEvent.status !== 200)
			throw new Error("Failed to create calendar event");

		const task = await prisma.task.create({
			data: {
				project: data.project,
				name: data.name,
				description: data.description,
				summary: data.summary,
				assigneeId: data.assigneeId,
				creatorId: data.creatorId,
				start: data.start,
				end: data.end,
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
			start: task.start.toLocaleDateString("en-GB"),
			end: task.end.toLocaleDateString("en-GB")
		};

		const emailResponse = await sendEmail(
			"New Task Has Been Assigned",
			emailData,
			task.assignee.email
		);

		if (emailResponse.status !== 200)
			throw new Error("Failed to send email");

		return Response.json(task, { status: 201 });
	} catch (e) {
		console.log("Failed to create task", e);
		return Response.json(
			{ message: "Failed to create task" },
			{ status: 500 }
		);
	}
}

export async function PATCH(req: NextRequest) {
	const session = await getServerSession(authOptions);
	const accessError1 = await accessCheckError(["TASKS_EDIT"]);

	try {
		const data = await PATCHSchema.validate(await req.json());
		const accessError2 = session?.user.id === data.creatorId;

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
				eventId: data.calendarEventId,
				requestBody: {
					summary: data.name,
					description: data.description,
					start: {
						dateTime: data.start.toISOString(),
						timeZone:
							Intl.DateTimeFormat().resolvedOptions().timeZone
					},
					end: {
						dateTime: data.end.toISOString(),
						timeZone:
							Intl.DateTimeFormat().resolvedOptions().timeZone
					},
					attendees: [{ email: data.assignedEmail }]
				}
			});

			const task = await prisma.task.update({
				where: { id: data.id },
				data: {
					project: data.project,
					name: data.name,
					description: data.description,
					summary: data.summary,
					assigneeId: data.assigneeId,
					start: data.start,
					end: data.end,
					calendarEventId: taskEvent.data.id ?? data.calendarEventId
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
				start: task.start.toLocaleDateString("en-GB"),
				end: task.end.toLocaleDateString("en-GB")
			};

			const emailResponse = await sendEmail(
				"Task Details Have Been Updated",
				emailData,
				task.assignee.email
			);

			if (emailResponse.status !== 200)
				throw new Error("Failed to send email");

			return Response.json(task, { status: 200 });
		}

		return Response.json(
			{ message: accessError1?.message },
			{ status: accessError1?.status }
		);
	} catch (error) {
		console.log("Failed to update employee", error);
		return Response.json(
			{ message: "Failed to update employee" },
			{ status: 500 }
		);
	}
}

export async function GET() {
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
			return Response.json(tasks, { status: 200 });
		} catch (error) {
			console.log("Failed to get employees", error);
			return Response.json(
				{ message: "Failed to get employees" },
				{ status: 500 }
			);
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
			return Response.json(tasks, { status: 200 });
		} catch (error) {
			console.log("Failed to get employees", error);
			return Response.json(
				{ message: "Failed to get employees" },
				{ status: 500 }
			);
		}
	}

	return Response.json(
		{ message: accessError2.message },
		{ status: accessError2.status }
	);
}

export async function DELETE(req: NextRequest) {
	const session = await getServerSession(authOptions);
	const accessError1 = await accessCheckError(["TASKS_DELETE"]);

	try {
		const data = await DELETESchema.validate(await req.json());
		const accessError2 = session?.user.id === data.creatorId;

		if (accessError1 === null || accessError2) {
			const task = await prisma.task.delete({
				where: { id: data.id }
			});
			return Response.json(task, { status: 200 });
		}

		return Response.json(
			{ message: accessError1.message },
			{ status: accessError1.status }
		);
	} catch (error) {
		console.log("Failed to delete employee", error);
		return Response.json(
			{ message: "Failed to delete employee" },
			{ status: 500 }
		);
	}
}
