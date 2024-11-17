import { createCallerFactory, router } from "@/trpc";
import routerOptions from "@/trpc/routes";

export const appRouter = router(routerOptions);

//For fetching data server side
const createCaller = createCallerFactory(appRouter);
export const caller = createCaller({});

export type AppRouter = typeof appRouter;
