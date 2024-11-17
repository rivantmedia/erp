import { Text, Button } from "@mantine/core";
import Image from "next/image";
import styles from "./styles.module.css";
import NotificationIcon from "@/components/icons/notificationIcon";
import { auth } from "@/auth";

async function Header() {
	const session = await auth();

	return (
		<div className={styles.header}>
			<div className={styles.greeting}>
				<Text
					fw={500}
					size="24px"
					style={{
						fontFamily: "var(--font-inter)"
					}}
				>
					Hello{" "}
					<span style={{ fontWeight: 600 }}>
						{session?.user?.name?.split(" ")[0]}
					</span>
				</Text>{" "}
				<Image
					src="/icons/wave.svg"
					height={32}
					width={32}
					alt="Wave"
				></Image>{" "}
			</div>
			<Button
				style={{
					height: 50,
					width: 50,
					display: "flex",
					padding: 0,
					alignItems: "center",
					justifyContent: "center",
					borderRadius: 25
				}}
			>
				<NotificationIcon size={24} />
			</Button>
		</div>
	);
}

export default Header;
