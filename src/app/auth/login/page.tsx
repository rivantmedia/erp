import { signIn } from "@/auth";
import { Button, Text } from "@mantine/core";
import Image from "next/image";

export default function Login() {
	return (
		<>
			<Image
				src="/icons/userauth.svg"
				width={64}
				height={64}
				alt="User Auth Icon"
			/>
			<Text
				size="24px"
				fw={600}
				mt={12}
				mb={24}
			>
				Login Required
			</Text>
			<form
				action={async () => {
					"use server";
					await signIn("google");
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
					<Image
						src="/icons/google.svg"
						width={32}
						height={32}
						alt="User Auth Icon"
					/>
					<Text
						size="16px"
						fw={600}
					>
						Sign in with Google Workspace
					</Text>
				</Button>
			</form>
		</>
	);
}
