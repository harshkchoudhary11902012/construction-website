"use client";

import { type FC, useMemo } from "react";
import Link from "next/link";
import { type SliceComponentProps } from "@prismicio/react";
import { Box, Card, Container, Group, Image, SimpleGrid, Text, Title } from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";
import classes from "./ProjectsCatalog.module.css";

type ProjectsCatalogPrimary = {
	hero_title?: unknown;
	hero_breadcrumb?: unknown;
	hero_background?: unknown;
	projects_per_page?: number | null;
	projects?: Array<{
		title?: string | null;
		category?: string | null;
		image?: unknown;
		link?: unknown;
	}> | null;
};

type ProjectsCatalogProps = SliceComponentProps;

type ProjectItem = {
	title: string;
	category: string;
	image: string;
	link: string;
};

const PROJECTS_PER_PAGE = 6;

const hasImageUrl = (value: unknown): value is { url: string } =>
	typeof value === "object" &&
	value !== null &&
	"url" in value &&
	typeof (value as { url?: unknown }).url === "string";

const getLinkUrl = (value: unknown): string | undefined =>
{
	if (typeof value !== "object" || value === null) return undefined;

	const maybeDoc = value as { uid?: unknown; url?: unknown };
	if (typeof maybeDoc.uid === "string" && maybeDoc.uid.trim()) {
		return `/projects/${maybeDoc.uid.trim()}`;
	}

	if (typeof maybeDoc.url === "string" && maybeDoc.url.trim()) {
		return maybeDoc.url;
	}

	return undefined;
};

const readRichTextAsString = (value: unknown, fallback: string) => {
	if (!Array.isArray(value)) return fallback;
	const text = value
		.map((node) => {
			if (typeof node !== "object" || node === null || !("content" in node)) return "";
			const content = (node as { content?: unknown }).content;
			if (typeof content === "object" && content !== null && "text" in content) {
				const t = (content as { text?: unknown }).text;
				return typeof t === "string" ? t : "";
			}
			return "";
		})
		.join(" ")
		.trim();
	return text || fallback;
};

const ProjectsCatalog: FC<ProjectsCatalogProps> = ({ slice, context }) => {
	const p = ((slice as { primary?: ProjectsCatalogPrimary }).primary ?? {}) as ProjectsCatalogPrimary;
	const currentPage = (context as { currentPage?: number } | undefined)?.currentPage ?? 1;

	const projects = useMemo<ProjectItem[]>(() => {
		const rows = p.projects ?? [];
		return rows
			.filter((row) => hasImageUrl(row.image))
			.map((row) => ({
				title: typeof row.title === "string" ? row.title : "",
				category: typeof row.category === "string" ? row.category : "",
				image: (row.image as { url: string }).url,
				link: getLinkUrl(row.link) || "",
			}));
	}, [p.projects]);

	const perPage = PROJECTS_PER_PAGE;
	const totalPages = Math.max(1, Math.ceil(projects.length / perPage));
	const safePage = Math.min(Math.max(currentPage, 1), totalPages);
	const startIndex = (safePage - 1) * perPage;
	const visibleProjects = projects.slice(startIndex, startIndex + perPage);

	const heroTitle = readRichTextAsString(p.hero_title, "");
	const heroCrumb = readRichTextAsString(p.hero_breadcrumb, "");

	const heroBg = hasImageUrl(p.hero_background) ? p.hero_background.url : "";

	return (
		<>
			<Box className={classes.hero} h={{ base: 210, sm: 250, md: 280 }} style={{ backgroundImage: `url("${heroBg}")` }}>
				<Box className={classes.heroOverlay} />
				<Container
					size="xl"
					h="100%"
					style={{
						position: "relative",
						zIndex: 1,
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
					}}
				>
					<Title order={1} c="white" mb={8}>
						{heroTitle}
					</Title>
					<Text c="gray.3" fw={500}>
						{heroCrumb}
					</Text>
				</Container>
			</Box>

			<Box py={{ base: 56, md: 80 }}>
				<Container size="xl">
					<SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={24}>
						{visibleProjects.map((project, idx) => {
							return (
								<Card key={`${project.title}-${idx}`} padding={0} radius="md" bg="transparent" withBorder={false}>
									<Box className={classes.projectImageWrap}>
										<Image src={project.image} alt={project.title} className={classes.projectImage} />
									</Box>
									<Group justify="space-between" align="flex-start" mt="md" wrap="nowrap" gap="sm">
										<Box>
											<Text fw={700} size="lg" c="dark.8">
												{project.title}
											</Text>
											<Text size="sm" c="orange.7">
												{project.category}
											</Text>
										</Box>
										{project.link ? (
											<Link href={project.link} className={classes.visitProjectBtn}>
												<Text size="sm" fw={700}>
													Visit Project
												</Text>
												<Box className={classes.arrowCircle}>
													<IconArrowUpRight size={18} stroke={1.8} />
												</Box>
											</Link>
										) : null}
									</Group>
								</Card>
							);
						})}
					</SimpleGrid>

					{totalPages > 1 && (
						<Group justify="center" mt={36} gap={10}>
							{safePage > 1 && (
								<Link href={safePage - 1 === 1 ? "/projects" : `/projects?page=${safePage - 1}`} className={classes.pageLink}>
									&lt; Prev
								</Link>
							)}

							{Array.from({ length: totalPages }, (_, index) => {
								const page = index + 1;
								const href = page === 1 ? "/projects" : `/projects?page=${page}`;
								return (
									<Link
										key={page}
										href={href}
										className={`${classes.pageLink} ${page === safePage ? classes.pageLinkActive : ""}`}
									>
										{page}
									</Link>
								);
							})}

							{safePage < totalPages && (
								<Link href={`/projects?page=${safePage + 1}`} className={classes.pageLink}>
									Next &gt;
								</Link>
							)}
						</Group>
					)}
				</Container>
			</Box>
		</>
	);
};

export default ProjectsCatalog;
