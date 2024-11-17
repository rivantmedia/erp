import { signOut } from "@/auth";
import { Button, Container, Text } from "@mantine/core";
import Image from "next/image";

export default function Logout() {
	return (
		<>
			<Image
				src="/icons/userauth.svg"
				width={64}
				height={64}
				alt="User Auth Icon"
			/>
			<Text
				size="16px"
				fw={600}
				mt={12}
				mb={24}
			>
				Are you sure you want to sign out?
			</Text>
			<form
				action={async () => {
					"use server";
					await signOut({
						redirectTo: "/auth/login",
						redirect: true
					});
				}}
			>
				<Button
					type="submit"
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "10px",
						padding: "8px 16px",
						height: "auto",
						backgroundColor: "#424242",
						borderRadius: "8px"
					}}
				>
					<Text
						size="16px"
						fw={600}
					>
						Sign Out
					</Text>
				</Button>
			</form>
		</>
	);
}
