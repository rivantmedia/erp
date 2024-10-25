import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as yup from "yup";
import { accessCheckError } from "@/lib/routeProtection";
import { Roles } from "@/lib/permissions";
import { google } from "googleapis";

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

const PUTSchema = yup.object({
	fname: yup.string().required(),
	lname: yup.string().required(),
	email: yup.string().required(),
	department: yup.string().required(),
	title: yup.string().required(),
	employeeId: yup.number().required(),
	contact: yup.number().required(),
	roleId: yup.string().required()
});

const DELETESchema = yup.object({
	employeeId: yup.number().required()
});

export async function POST(req: NextRequest) {
	const accessError = await accessCheckError(
		Roles.EMPLOYEES_READ & Roles.TASKS_CREATE
	);

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
			}
		});
		return Response.json(task, { status: 201 });
	} catch (e) {
		console.log("Failed to create task", e);
		return Response.json(
			{ message: "Failed to create task" },
			{ status: 500 }
		);
	}
}

export async function PUT(req: NextRequest) {
	const accessError = await accessCheckError(
		Roles.EMPLOYEES_READ_SENSITIVE_INFO & Roles.EMPLOYEES_UPDATE
	);

	if (accessError) {
		return Response.json(
			{ message: accessError.message },
			{ status: accessError.status }
		);
	}

	try {
		const data = await PUTSchema.validate(await req.json());

		const employee = await prisma.employee.update({
			where: { employeeId: data.employeeId },
			data: {
				fname: data.fname,
				lname: data.lname,
				email: data.email,
				department: data.department,
				title: data.title,
				contact: data.contact,
				roleId: data.roleId
			}
		});
		return Response.json(employee, { status: 200 });
	} catch (error) {
		console.log("Failed to update employee", error);
		return Response.json(
			{ message: "Failed to update employee" },
			{ status: 500 }
		);
	}
}

export async function GET() {
	const accessError = await accessCheckError(Roles.EMPLOYEES_READ);

	if (accessError) {
		return Response.json(
			{ message: accessError.message },
			{ status: accessError.status }
		);
	}

	try {
		const employees = await prisma.employee.findMany({
			orderBy: { employeeId: "asc" }
		});
		return Response.json(employees, { status: 200 });
	} catch (error) {
		console.log("Failed to get employees", error);
		return Response.json(
			{ message: "Failed to get employees" },
			{ status: 500 }
		);
	}
}

export async function DELETE(req: NextRequest) {
	const accessError = await accessCheckError(
		Roles.EMPLOYEES_READ_SENSITIVE_INFO & Roles.EMPLOYEES_DELETE
	);

	if (accessError) {
		return Response.json(
			{ message: accessError.message },
			{ status: accessError.status }
		);
	}

	try {
		const data = await DELETESchema.validate(await req.json());
		const employee = await prisma.employee.delete({
			where: { employeeId: data.employeeId }
		});
		return Response.json(employee, { status: 200 });
	} catch (error) {
		console.log("Failed to delete employee", error);
		return Response.json(
			{ message: "Failed to delete employee" },
			{ status: 500 }
		);
	}
}
