import { useDisclosure } from "@mantine/hooks";
import { Drawer, Button } from "@mantine/core";

function DrawerContainer({
	children,
	title
}: {
	children: React.ReactNode;
	title: string;
}) {
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<>
			<Drawer
				opened={opened}
				onClose={close}
				title={title}
			>
				{children}
			</Drawer>

			<Button onClick={open}>{title}</Button>
		</>
	);
}

export default DrawerContainer;
