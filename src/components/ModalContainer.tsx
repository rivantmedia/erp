import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";

function ModalContainer({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title={title} size="xl" centered>
        {children}
      </Modal>

      <Button onClick={open}>{title}</Button>
    </>
  );
}

export default ModalContainer;
