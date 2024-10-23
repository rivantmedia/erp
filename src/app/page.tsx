"use client";

import { Center } from "@mantine/core";
import AuthenticationForm from "@/components/AuthenticationForm";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
	const { data: session } = useSession();

	useEffect(() => {
		if (session) {
			redirect("/dashboard");
		}
	}, [session]);

	if (session) {
		return null;
	}
	return (
		<Center h="100vh">
			<AuthenticationForm />
		</Center>
	);
}
