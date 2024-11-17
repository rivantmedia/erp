import { publicProcedure } from "@/trpc";

const directory = {
	list: publicProcedure.query(async () => {
		return [
			{ id: 1, text: "Buy milk" },
			{ id: 2, text: "Buy eggs" }
		];
	})
};

export default directory;
