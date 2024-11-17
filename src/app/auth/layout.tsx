import { Card } from "@mantine/core";
import Image from "next/image";
import styles from "./layout.module.css";
import Link from "next/link";

export default function AuthLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className={styles.authpage}>
			<Link href="/">
				<Image
					src="/icons/erp-logo.svg"
					width={180}
					height={140}
					alt="ERP Logo"
				/>
			</Link>
			<Card className={styles.authcard}>{children}</Card>
		</div>
	);
}
