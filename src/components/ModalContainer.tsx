import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, ActionIcon } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";

function ModalContainer({
	children,
	title,
	type
}: {
	children: React.ReactNode;
	title: string;
	type?: string;
}) {
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<>
			<Modal
				opened={opened}
				onClose={close}
				title={title}
				size="xl"
				centered
			>
				{children}
			</Modal>

			{type == "edit" ? (
				<ActionIcon
					onClick={open}
					variant="subtle"
					size="xl"
					color="gray"
				>
					<IconPencil
						style={{ width: "70%", height: "70%" }}
						stroke={1.5}
					/>
				</ActionIcon>
			) : (
				<Button onClick={open}>{title}</Button>
			)}
		</>
	);
}

export default ModalContainer;
