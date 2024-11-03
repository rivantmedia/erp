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
		async signIn({ user }) {
			const userFromDB = await prisma.employee.findUnique({
				where: { email: user.email as string },
				select: {
					id: true
				}
			});

			if (!userFromDB) return false;

			return true;
		},
		async session({ session }) {
			const userFromDB = await prisma.employee.findUnique({
				where: { email: session.user?.email as string },
				select: {
					id: true,
					employeeId: true,
					fname: true,
					lname: true,
					contact: true,
					department: true,
					title: true,
					roleId: true,
					sAdmin: true,
					role: {
						select: {
							id: true,
							index: true,
							name: true,
							permissions: true
						}
					}
				}
			});
			if (userFromDB) {
				session.user = {
					...session.user,
					...userFromDB
				};
			}
			return session;
		}
	}
};
