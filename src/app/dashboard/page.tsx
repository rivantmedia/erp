"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

function Home() {
	useEffect(() => {
		redirect("/dashboard/tasks");
	});

	return null;
}

export default Home;
