import { PrismaClient } from "@prisma/client";
import { accessCheckError } from "@/lib/routeProtection";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();

export async function getLeaves() {
	const accessError = await accessCheckError(["LEAVES_READ"]);

	if (accessError) {
		throw new TRPCError({
			code: accessError.status as TRPCError["code"],
			message: accessError.message
		});
	}

	try {
		const leaves = await prisma.leave.findMany({
			include: {
				employee: {
					select: { id: true, fname: true, lname: true }
				},
				creator: {
					select: { id: true, fname: true, lname: true }
				},
				modifier: {
					select: { id: true, fname: true, lname: true }
				}
			},
			orderBy: {
				id: "asc"
			}
		});

		return leaves;
	} catch (e) {
		console.log("Failed to get task", e);
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to get task"
		});
	}
}
