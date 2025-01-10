import { procedure, router } from "./trpc";
import { getEmployees } from "@/routes/employees/getEmployees";
import { addEmployee, AddEmployeeSchema } from "@/routes/employees/addEmployee";
import {
	UpdateEmployeeSchema,
	updateEmployee
} from "@/routes/employees/updateEmployee";
import {
	deleteEmployee,
	DeleteEmployeeSchema
} from "@/routes/employees/deleteEmployee";
import { getRoles } from "@/routes/roles/getRoles";
import { addRole, AddRoleSchema } from "@/routes/roles/addRole";
import { updateRole, UpdateRoleSchema } from "@/routes/roles/updateRole";
import { deleteRole, DeleteRoleSchema } from "@/routes/roles/deleteRole";
import { addTask, AddTaskSchema } from "@/routes/tasks/addTask";
import { updateTask, UpdateTaskSchema } from "@/routes/tasks/updateTask";
import { deleteTask, DeleteTaskSchema } from "@/routes/tasks/deleteTask";
import { getTasks } from "@/routes/tasks/getTasks";
import {
	addSubmission,
	AddSubmissionSchema
} from "@/routes/submission/addSubmission";
import {
	updateSubmission,
	UpdateSubmissionSchema
} from "@/routes/submission/updateSubmission";

export const appRouter = router({
	getEmployees: procedure.query(getEmployees),
	addEmployee: procedure.input(AddEmployeeSchema).mutation(addEmployee),
	updateEmployee: procedure
		.input(UpdateEmployeeSchema)
		.mutation(updateEmployee),
	deleteEmployee: procedure
		.input(DeleteEmployeeSchema)
		.mutation(deleteEmployee),
	getRoles: procedure.query(getRoles),
	addRole: procedure.input(AddRoleSchema).mutation(addRole),
	updateRole: procedure.input(UpdateRoleSchema).mutation(updateRole),
	deleteRole: procedure.input(DeleteRoleSchema).mutation(deleteRole),
	addTask: procedure.input(AddTaskSchema).mutation(addTask),
	updateTask: procedure.input(UpdateTaskSchema).mutation(updateTask),
	deleteTask: procedure.input(DeleteTaskSchema).mutation(deleteTask),
	getTasks: procedure.query(getTasks),
	addSubmission: procedure.input(AddSubmissionSchema).mutation(addSubmission),
	updateSubmission: procedure
		.input(UpdateSubmissionSchema)
		.mutation(updateSubmission)
});

export type AppRouter = typeof appRouter;
