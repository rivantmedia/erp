import BitField, { BitFieldResolvable } from "./BitField";

// TASKS
/**
 * TASKS_CREATE - Create & Assign tasks to any other user
 *              - These tasks can only be edited by this user and users with the tasks_edit permission
 *
 * TASKS_VIEW - View tasks assigned to them, and tasks assigned by them, THIS RESTRICTS ACCESS TO THE ENTIRE PANEL
 *
 * TASKS_VIEW_ALL - View all tasks in the company not just the ones assigned to them or by them
 *
 * TASKS_EDIT - Edit task information for tasks not assigned by them
 *
 * TASKS_DELETE - Delete tasks not assigned by them
 */

// ASSETS
/**
 * ASSETS_CREATE - Create assets
 *
 * ASSETS_READ - View assets, THIS RESTRICTS ACCESS TO THE ENTIRE PANEL
 *
 * ASSETS_UPDATE - Edit existing assets
 *
 * ASSETS_DELETE - Delete existing assets
 */

// EMPLOYEES
/**
 * EMPLOYEES_CREATE - Create employees
 *
 * EMPLOYEES_READ - View employee contact info only, THIS RESTRICTS ACCESS TO THE ENTIRE PANEL
 *
 * EMPLOYEES_READ_BASIC_INFO - View non sensitive info
 *
 * EMPLOYEES_READ_SENSITIVE_INFO - View sensitive info
 *
 * EMPLOYEES_UPDATE - Edit employee info
 *
 * EMPLOYEES_DELETE - Delete employees
 */

// ROLES
/**
 * ROLES_CREATE - Create roles only below their role heirarchy, each role will have an index
 *
 * ROLES_READ - View roles, THIS RESTRICTS ACCESS TO THE ENTIRE PANEL
 *
 * ROLES_UPDATE - Edit and move roles only below their role heirarchy
 *
 * ROLES_DELETE - Delete roles only below their role heirarchy
 */

/**
 * Data structure that makes it easy to interact with a bitfield.
 */
export class UserPermissions extends BitField<
	keyof typeof UserPermissions.Flags
> {
	public static Flags = {
		//TASKS
		TASKS_CREATE: 1 << 0, //Create & Assign tasks to any other user
		TASKS_VIEW: 1 << 1, //View tasks assigned to them, and tasks assigned by them
		TASKS_VIEW_ALL: 1 << 2, //View all tasks in the company
		TASKS_EDIT: 1 << 3, //Edit task information for tasks not assigned by them
		TASKS_DELETE: 1 << 4, //Delete tasks not assigned by them
		//ASSETS
		ASSETS_CREATE: 1 << 5,
		ASSETS_READ: 1 << 6,
		ASSETS_UPDATE: 1 << 7,
		ASSETS_DELETE: 1 << 8,
		//EMPLOYEES
		EMPLOYEES_CREATE: 1 << 9,
		EMPLOYEES_READ: 1 << 10,
		EMPLOYEES_READ_BASIC_INFO: 1 << 11,
		EMPLOYEES_READ_SENSITIVE_INFO: 1 << 12,
		EMPLOYEES_UPDATE: 1 << 13,
		EMPLOYEES_DELETE: 1 << 14,
		//ROLES
		ROLES_CREATE: 1 << 15,
		ROLES_READ: 1 << 16,
		ROLES_UPDATE: 1 << 17,
		ROLES_DELETE: 1 << 18,
		//PROJECTS
		PROJECTS_CREATE: 1 << 19,
		PROJECTS_READ: 1 << 20,
		PROJECTS_READ_ALL: 1 << 21,
		PROJECTS_UPDATE: 1 << 22,
		PROJECTS_DELETE: 1 << 23
		//DOCUMENTS [NOT IMPLEMENTED]
	} as const;

	public readonly DefaultBit = 0;
}

export type PermissionsResolvable = BitFieldResolvable<
	keyof typeof UserPermissions.Flags
>;

export default UserPermissions;
