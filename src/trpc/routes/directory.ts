import { publicProcedure } from "@/trpc";

export default {
	list: publicProcedure.query(async () => {
		return [
			{ id: 1, text: "Buy milk" },
			{ id: 2, text: "Buy eggs" }
		];
	})
};
