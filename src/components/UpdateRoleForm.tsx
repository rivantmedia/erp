import { Role, useRoles } from "@/context/RolesContext";
import Roles from "@/lib/UserPermissions";
import { Checkbox, Notification, SimpleGrid } from "@mantine/core";
import {
	Box,
	Button,
	Group,
	LoadingOverlay,
	NumberInput,
	TextInput
} from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { useState } from "react";

interface RoleFormValues {
	id: string;
	name: string;
	index: number;
	permissions: number;
}

function UpdateRoleForm({ role }: { role: Role }) {
	const [notification, setNotification] = useState(false);
	const { isChangeLoading, error, editRole } = useRoles() as {
		isChangeLoading: boolean;
		error: string;
		editRole: (values: RoleFormValues) => Promise<void>;
	};
	const form = useForm({
		mode: "uncontrolled",
		initialValues: {
			id: role.id,
			name: role.name,
			index: role.index,
			permissions: role.permissions
		},
		validate: {
			name: hasLength(
				{ min: 2 },
				"Name must be more than 2 characters long"
			),
			index: (value: number) =>
				value < 0 ? "Index must be greater than 0" : undefined,
			permissions: (value: number) => {
				if (value === 0) {
					return "At least one permission must be selected";
				}
				return undefined;
			}
		}
	});

	async function handleForm(values: RoleFormValues) {
		if (form.isValid()) {
			await editRole(values);
			if (!error) {
				setNotification(true);
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
					visible={isChangeLoading}
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
						disabled
						key={form.key("permissions")}
						{...form.getInputProps("permissions")}
						onChange={(e) =>
							form.setFieldValue("permissionsbin", e.toString(2))
						}
					/>
					<Group
						justify="center"
						mt="md"
					>
						<Button type="submit">Submit</Button>
					</Group>
					<SimpleGrid
						cols={2}
						mt="md"
					>
						{Object.keys(Roles.Flags)
							.filter((v) => isNaN(Number(v)))
							.map((key) => (
								<Checkbox
									key={key}
									label={key}
									mt="xs"
									checked={
										(Roles.Flags[
											key as keyof typeof Roles.Flags
										] &
											form.getValues().permissions) ===
										Roles.Flags[
											key as keyof typeof Roles.Flags
										]
									}
									onChange={(e) => {
										const computedValue = e.target.checked
											? form.getValues().permissions |
											  Roles.Flags[
													key as keyof typeof Roles.Flags
											  ]
											: form.getValues().permissions &
											  ~Roles.Flags[
													key as keyof typeof Roles.Flags
											  ];
										form.setFieldValue(
											"permissions",
											computedValue
										);
									}}
								/>
							))}
					</SimpleGrid>
				</form>
			</Box>
		</>
	);
}

export default UpdateRoleForm;
