import { Metadata } from "next";
import { notFound } from "next/navigation";
import { asText } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";

type Params = { uid: string };

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
	const { uid } = await params;
	const client = createClient();
	const project = await (client as any).getByUID("project", uid).catch(() => notFound());

	return <SliceZone slices={project.data.slices} components={components} />;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
	const { uid } = await params;
	const client = createClient();
	const project = await (client as any).getByUID("project", uid).catch(() => notFound());

	return {
		title: project.data.meta_title || asText(project.data.title) || "Project",
		description: project.data.meta_description || undefined,
		openGraph: {
			title: project.data.meta_title || asText(project.data.title) || "Project",
			images: [{ url: project.data.meta_image?.url || "" }],
		},
	};
}

export async function generateStaticParams() {
	try {
		const client = createClient();
		const projects = await (client as any).getAllByType("project");
		return projects.map((project: { uid: string }) => ({ uid: project.uid }));
	} catch {
		return [];
	}
}
