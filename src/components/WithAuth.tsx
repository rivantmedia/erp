"use client";

import React, { useEffect } from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export const withAuth = <P extends object>(
	WrappedComponent: React.ComponentType<P>
) => {
	return function WithAuth(
		props: React.ComponentProps<typeof WrappedComponent>
	) {
		const { data: session } = useSession();
		useEffect(() => {
			if (!session) {
				redirect("/");
			}
		}, [session]);

		if (!session) {
			return null;
		}
		return <WrappedComponent {...props} />;
	};
};
