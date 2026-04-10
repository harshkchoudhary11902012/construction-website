"use client";

import { type FC, useMemo } from "react";
import Link from "next/link";
import type { RichTextField } from "@prismicio/client";
import { type SliceComponentProps } from "@prismicio/react";
import { Box, Card, Container, Group, Image, SimpleGrid, Text } from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";
import { CustomPrismicRichText } from "@/components/custom-components/CustomPrismicRichText";
import classes from "./ProjectsCatalog.module.css";

type ProjectRow = {
	title?: string | null;
	category?: string | null;
	image: unknown;
	link?: unknown;
};

type ProjectsCatalogPrimary = {
	hero_title: RichTextField;
	hero_breadcrumb: RichTextField;
	hero_background?: unknown;
	projects?: ProjectRow[] | null;
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

const ProjectsCatalog: FC<ProjectsCatalogProps> = ({ slice, context }) => {
	const { hero_title, hero_breadcrumb, hero_background, projects: projectRows } =
		(slice as unknown as { primary: ProjectsCatalogPrimary }).primary;
	const currentPage = (context as { currentPage?: number } | undefined)?.currentPage ?? 1;

	const projects = useMemo<ProjectItem[]>(() => {
		const rows = projectRows ?? [];
		return rows
			.filter((row) => hasImageUrl(row.image))
			.map((row) => {
				const image = row.image as { url: string };
				return {
					title: typeof row.title === "string" ? row.title : "",
					category: typeof row.category === "string" ? row.category : "",
					image: image.url,
					link: getLinkUrl(row.link) || "",
				};
			});
	}, [projectRows]);

	const perPage = PROJECTS_PER_PAGE;
	const totalPages = Math.max(1, Math.ceil(projects.length / perPage));
	const safePage = Math.min(Math.max(currentPage, 1), totalPages);
	const startIndex = (safePage - 1) * perPage;
	const visibleProjects = projects.slice(startIndex, startIndex + perPage);

	const heroBg = hasImageUrl(hero_background) ? hero_background.url : "";

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
					<CustomPrismicRichText field={hero_title} c="white" mb={8} />
					<CustomPrismicRichText
						field={hero_breadcrumb}
						body="body1"
						c="gray.3"
						fw={500}
					/>
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
