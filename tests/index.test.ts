import { UserPermissions } from "../src/lib/UserPermissions";

describe("Testing UserPermissions utility", () => {
	//Check the bitfield initialization with permissions
	test("initializing UserPermissions with permissions", () => {
		const userPermissions = new UserPermissions([
			"TASKS_CREATE",
			"TASKS_VIEW",
			"TASKS_VIEW_ALL"
		]);

		const userPermissions2 = new UserPermissions([
			UserPermissions.Flags.TASKS_CREATE,
			UserPermissions.Flags.TASKS_VIEW_ALL,
			UserPermissions.Flags.TASKS_VIEW
		]);

		const userPermissions3 = new UserPermissions(7);

		expect(
			userPermissions.has([
				UserPermissions.Flags.TASKS_CREATE,
				UserPermissions.Flags.TASKS_VIEW_ALL,
				UserPermissions.Flags.TASKS_VIEW
			]) &&
				userPermissions2.has([
					UserPermissions.Flags.TASKS_CREATE,
					UserPermissions.Flags.TASKS_VIEW_ALL,
					UserPermissions.Flags.TASKS_VIEW
				]) &&
				userPermissions3.has([
					UserPermissions.Flags.TASKS_CREATE,
					UserPermissions.Flags.TASKS_VIEW_ALL,
					UserPermissions.Flags.TASKS_VIEW
				])
		).toBe(true);
	});
	test("checking if user has one permission WHITE CASE with other permissions", () => {
		const userPermissions = new UserPermissions().add([
			UserPermissions.Flags.TASKS_CREATE,
			UserPermissions.Flags.TASKS_VIEW,
			UserPermissions.Flags.TASKS_VIEW_ALL
		]);
		expect(userPermissions.has(UserPermissions.Flags.TASKS_CREATE)).toBe(
			true
		);
	});

	test("checking if user has one permission WHITE CASE with only one permission", () => {
		const userPermissions = new UserPermissions().add([
			UserPermissions.Flags.TASKS_CREATE
		]);
		expect(userPermissions.has(UserPermissions.Flags.TASKS_CREATE)).toBe(
			true
		);
	});

	test("checking if user has one permission BLACK CASE with other permissions", () => {
		const userPermissions = new UserPermissions().add([
			UserPermissions.Flags.TASKS_VIEW,
			UserPermissions.Flags.TASKS_VIEW_ALL
		]);
		expect(userPermissions.has(UserPermissions.Flags.TASKS_CREATE)).toBe(
			false
		);
	});

	test("checking if user has one permission BLACK CASE with default permissions", () => {
		const userPermissions = new UserPermissions();
		expect(userPermissions.has(UserPermissions.Flags.TASKS_CREATE)).toBe(
			false
		);
	});

	test("checking if user has multiple permissions WHITE CASE", () => {
		const userPermissions = new UserPermissions().add([
			UserPermissions.Flags.TASKS_CREATE,
			UserPermissions.Flags.TASKS_VIEW,
			UserPermissions.Flags.TASKS_VIEW_ALL
		]);
		expect(
			userPermissions.has([
				UserPermissions.Flags.TASKS_CREATE,
				UserPermissions.Flags.TASKS_VIEW_ALL
			])
		).toBe(true);
	});

	test("checking if user has multiple permissions BLACK CASE one permission is missing out of two", () => {
		const userPermissions = new UserPermissions().add([
			UserPermissions.Flags.TASKS_CREATE,
			UserPermissions.Flags.TASKS_VIEW,
			UserPermissions.Flags.TASKS_VIEW_ALL
		]);
		expect(
			userPermissions.has([
				UserPermissions.Flags.TASKS_CREATE,
				UserPermissions.Flags.TASKS_EDIT
			])
		).toBe(false);
	});
});
