import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
		})
	],
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async session({ session }) {
			const userFromDB = await prisma.employee.findUnique({
				where: { email: session.user?.email as string },
				include: { role: true }
			});
			if (userFromDB) {
				session.user = {
					...session.user,
					...userFromDB,
					roleId: userFromDB.roleId ?? undefined,
					role: userFromDB.role ?? undefined
				};
			}
			return session;
		}
	}
};
