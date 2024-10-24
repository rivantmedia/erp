import { useRoles } from "@/context/RolesContext";
import { Notification } from "@mantine/core";
import {
	Box,
	Button,
	Group,
	LoadingOverlay,
	NumberInput,
	TextInput
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";

interface RoleFormValues {
	name: string;
	index: number;
	permissions: number;
}

function CreateRoleForm() {
	const [notification, setNotification] = useState(false);
	const { roles, isLoading, error, addRole } = useRoles();
	const form = useForm({
		mode: "uncontrolled",
		initialValues: {
			name: "",
			index: 0,
			permissions: 0
		},
		validate: {}
	});

	async function handleForm(values: RoleFormValues) {
		if (form.isValid()) {
			values = { ...values };
			await addRole(values);
			if (!error) {
				setNotification(true);
				form.reset();
			}
		}
	}

	return (
		<>
			{notification && (
				<Notification
					title="Role Added"
					color="green"
					onClose={() => setNotification(false)}
				>
					Role has been added successfully
				</Notification>
			)}
			<Box pos="relative">
				<LoadingOverlay
					visible={isLoading}
					zIndex={1000}
					overlayProps={{ radius: "sm", blur: 2 }}
					loaderProps={{ type: "bars" }}
				/>
				<form onSubmit={form.onSubmit(handleForm)}>
					<TextInput
						withAsterisk
						label="Name"
						key={form.key("name")}
						{...form.getInputProps("name")}
					/>
					<NumberInput
						withAsterisk
						label="Index"
						mt="md"
						key={form.key("index")}
						{...form.getInputProps("index")}
					/>
					<NumberInput
						withAsterisk
						label="Permissions"
						mt="md"
						key={form.key("permissions")}
						{...form.getInputProps("permissions")}
					/>
					<Group
						justify="center"
						mt="md"
					>
						<Button type="submit">Submit</Button>
					</Group>
				</form>
			</Box>
		</>
	);
}

export default CreateRoleForm;
