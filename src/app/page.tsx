import { Center } from "@mantine/core";
// import styles from "./page.module.css";
import { AuthenticationForm } from "@/components/AuthenticationForm";

export default function Home() {
  return (
    <Center h="100vh">
      <AuthenticationForm />
    </Center>
  );
}
