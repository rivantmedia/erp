import { trpcSSR } from "@/trpc/trpcSSR";

async function Test() {
	const todos = await trpcSSR.directory.list();

	return (
		<ul>
			{todos.map((t, i) => (
				<li key={i}>
					{t.id}: {t.text}
				</li>
			))}
		</ul>
	);
}

export default Test;
