import { createTRPCReact } from "@trpc/react-query";
import type { inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "@/server/index";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type getTaskOutput = RouterOutput["getTasks"];
export type getLeaveOutput = RouterOutput["getLeaves"];

export const trpc = createTRPCReact<AppRouter>({});
