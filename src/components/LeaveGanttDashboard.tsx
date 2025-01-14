import { Gantt, Task, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { trpc } from "@/app/_trpc/client";
import { Container } from "@mantine/core";

function LeaveGanttDashboard() {
	const getLeaves = trpc.getLeaves.useQuery();
	const leaves: Task[] =
		getLeaves.data?.map((leave) => ({
			id: leave.id,
			name: leave.employee.fname + " " + leave.employee.lname,
			start: new Date(leave.fromDate),
			end: new Date(new Date(leave.toDate).setHours(23, 59, 59)),
			progress: 100,
			type: "task",
			styles: {
				progressColor: "#1971c2",
				progressSelectedColor: "#1971c2"
			}
		})) || [];

	return (
		<Container
			mt="lg"
			fluid
		>
			<Gantt
				tasks={leaves}
				viewMode={ViewMode.Day}
				listCellWidth=""
			/>
		</Container>
	);
}

export default LeaveGanttDashboard;
