"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

declare module "next-auth" {
	interface Session {
		user: {
			name?: string | null;
			email?: string | null;
			image?: string | null;
			role?: string | null;
			sAdmin?: boolean | null;
		};
	}
}

const SessionWrapper = ({ children }: { children: React.ReactNode }) => {
	return <SessionProvider>{children}</SessionProvider>;
};

export default SessionWrapper;
