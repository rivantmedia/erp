"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

declare module "next-auth" {
	interface Session {
		user: {
			id?: string;
			name?: string;
			email?: string;
			image?: string;
			roleId?: string;
			title?: string;
			contact?: number;
			sAdmin?: boolean;
			role?: {
				id: string;
				index: number;
				name: string;
				permissions: number;
			};
		};
	}
}

const SessionWrapper = ({ children }: { children: React.ReactNode }) => {
	return <SessionProvider>{children}</SessionProvider>;
};

export default SessionWrapper;
