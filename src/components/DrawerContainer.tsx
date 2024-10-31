import { useDisclosure } from "@mantine/hooks";
import { Drawer, Button } from "@mantine/core";

function DrawerContainer({ children }: { children: React.ReactNode }) {
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<>
			<Drawer
				opened={opened}
				onClose={close}
				title="Authentication"
			>
				{children}
			</Drawer>

			<Button onClick={open}>Show Details</Button>
		</>
	);
}

export default DrawerContainer;
