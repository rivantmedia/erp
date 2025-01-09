import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/index";

const handler = (req: Request) =>
	fetchRequestHandler({
		router: appRouter,
		endpoint: "/api/trpc",
		req,
		createContext: () => ({})
	});

export { handler as GET, handler as POST };
