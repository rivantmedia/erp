"use client";

import { Container, ScrollArea, Text } from "@mantine/core";
import { addDays, format, startOfMonth, endOfMonth } from "date-fns";
import styles from "./LeaveGanttDashboard.module.css";
import { trpc } from "@/app/_trpc/client";

export default function LeaveGanttDashboard() {
	const getEmployees = trpc.getEmployees.useQuery();
	const getLeaves = trpc.getLeaves.useQuery();
	const currentMonth = new Date();
	const firstDay = startOfMonth(currentMonth);
	const lastDay = endOfMonth(currentMonth);
	const daysInMonth: Date[] = [];
	let currentDate = firstDay;

	while (currentDate <= lastDay) {
		daysInMonth.push(currentDate);
		currentDate = addDays(currentDate, 1);
	}

	const isDateInRange = (date: Date, start: string, end: string) => {
		const startDate = new Date(start);
		const endDate = new Date(end);
		return date >= startDate && date <= endDate;
	};

	const isLeave = (employeeId: string, date: Date) => {
		const leave = getLeaves.data?.find(
			(l) =>
				l.employeeId === employeeId &&
				isDateInRange(date, l.fromDate, l.toDate)
		);
		return leave;
	};

	return (
		<Container fluid>
			<div>
				<Text
					fw={700}
					my="xl"
					size="40px"
					ta="center"
				>
					Leave Schedule - {format(currentMonth, "MMMM yyyy")}
				</Text>
			</div>
			<div>
				<ScrollArea.Autosize
					className={styles.ganttContainer}
					mah={600}
				>
					<div className="relative">
						<div className={styles.ganttHeader}>
							<div className={styles.ganttGrid}>
								<div className={styles.dayCell}>Employee</div>
								<div className={styles.daysGrid}>
									{daysInMonth.map((date) => (
										<div
											key={date.toISOString()}
											className={styles.dayCell}
										>
											{format(date, "d")}
										</div>
									))}
								</div>
							</div>
						</div>

						<div className={styles.employeeRows}>
							{getEmployees.data?.map((employee) => (
								<div
									key={employee.id}
									className={styles.employeeRow}
								>
									<div className={styles.employeeInfo}>
										<div className={styles.employeeName}>
											{employee.fname} {employee.lname}
										</div>
										<div className={styles.employeeRole}>
											{employee.title}
										</div>
									</div>
									<div className={styles.daysGrid}>
										{daysInMonth.map((date) => {
											const leave = isLeave(
												employee.id,
												date
											);
											return (
												<div
													key={date.toISOString()}
													className={`${
														styles.leaveCell
													} ${
														leave
															? styles.leave
															: ""
													}`}
												/>
											);
										})}
									</div>
								</div>
							))}
						</div>
					</div>
				</ScrollArea.Autosize>
			</div>
		</Container>
	);
}
