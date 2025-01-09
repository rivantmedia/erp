import { procedure, router } from "./trpc";

export const appRouter = router({
	getNumbers: procedure.query(async () => [1, 2, 3])
});

export type AppRouter = typeof appRouter;
