import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";

type ProjectsPageProps = {
	searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
	const params = searchParams ? await searchParams : {};
	const pageRaw = params.page;
	const pageNumber = typeof pageRaw === "string" ? Number.parseInt(pageRaw, 10) : Number.NaN;
	const currentPage = Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1;

	const client = createClient();
	const page = await client.getByUID("page", "projects").catch(() => notFound());

	return (
		<SliceZone
			slices={page.data.slices}
			components={components}
			context={{ currentPage }}
		/>
	);
}
