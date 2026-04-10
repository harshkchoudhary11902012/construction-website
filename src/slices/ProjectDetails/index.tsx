"use client";

import { type FC, useMemo } from "react";
import Link from "next/link";
import type { RichTextField } from "@prismicio/client";
import { type SliceComponentProps } from "@prismicio/react";
import {
	Box,
	Button,
	Container,
	Grid,
	Group,
	Image,
	SimpleGrid,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { IconArrowLeft, IconArrowRight, IconMapPin, IconTag, IconUser } from "@tabler/icons-react";
import { CustomPrismicRichText } from "@/components/custom-components/CustomPrismicRichText";
import classes from "./ProjectDetails.module.css";

type ProjectDetailsPrimary = {
	hero_image?: unknown;
	banner_image?: unknown;
	hero_title?: RichTextField;
	hero_breadcrumb?: RichTextField;
	project_title?: unknown;
	project_category?: string | null;
	project_intro?: unknown;
	info_title?: string | null;
	client_name?: string | null;
	category_label?: string | null;
	project_date?: string | null;
	address?: string | null;
	help_title?: string | null;
	help_phone?: string | null;
	help_button_label?: string | null;
	help_button_link?: unknown;
	confidence_title?: unknown;
	confidence_image?: unknown;
	confidence_points?: Array<{ point?: string | null }> | null;
	challenge_title?: unknown;
	challenge_text?: unknown;
	challenge_images?: Array<{ image?: unknown }> | null;
};

type ProjectDetailsProps = SliceComponentProps;

const hasImageUrl = (value: unknown): value is { url: string } =>
	typeof value === "object" &&
	value !== null &&
	"url" in value &&
	typeof (value as { url?: unknown }).url === "string";

const getLinkUrl = (value: unknown): string | undefined =>
	typeof value === "object" &&
	value !== null &&
	"url" in value &&
	typeof (value as { url?: unknown }).url === "string"
		? ((value as { url: string }).url ?? undefined)
		: undefined;

const asRichTextField = (value: unknown): RichTextField | null =>
	Array.isArray(value) ? (value as RichTextField) : null;

const ProjectDetails: FC<ProjectDetailsProps> = ({ slice }) => {
	const p = ((slice as { primary?: ProjectDetailsPrimary }).primary ?? {}) as ProjectDetailsPrimary;

	const challengeImages = useMemo(
		() =>
			(p.challenge_images ?? [])
				.filter((r) => hasImageUrl(r.image))
				.map((r) => (r.image as { url: string }).url),
		[p.challenge_images],
	);

	const confidencePoints = useMemo(
		() =>
			(p.confidence_points ?? [])
				.map((r) => r.point?.trim())
				.filter((x): x is string => Boolean(x)),
		[p.confidence_points],
	);

	const heroImage = hasImageUrl(p.hero_image)
		? p.hero_image.url
		: "https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg?auto=compress&cs=tinysrgb&w=1800";
	const bannerImage = hasImageUrl(p.banner_image) ? p.banner_image.url : heroImage;

	const confidenceImage = hasImageUrl(p.confidence_image)
		? p.confidence_image.url
		: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=900";

	const projectTitleField = asRichTextField(p.project_title);
	const projectIntroField = asRichTextField(p.project_intro);
	const confidenceTitleField = asRichTextField(p.confidence_title);
	const challengeTitleField = asRichTextField(p.challenge_title);
	const challengeTextField = asRichTextField(p.challenge_text);

	return (
		<Box className={classes.detailsRoot}>
			<Box
				className={classes.pageBanner}
				h={{ base: 210, sm: 250, md: 280 }}
				style={{ backgroundImage: `url("${bannerImage}")` }}
			>
				<Box className={classes.pageBannerOverlay} />
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
					<CustomPrismicRichText field={p.hero_title} c="white" mb={8} />
					<CustomPrismicRichText field={p.hero_breadcrumb} body="body1" c="gray.3" fw={500} />
				</Container>
			</Box>
			<Box py={{ base: 36, md: 56 }}>
				<Box maw={1180} mx="auto">
					<Box className={classes.heroWrap}>
						<Box className={classes.heroImage}>
							<Image src={heroImage} alt={"Project"} h={{ base: 220, md: 430 }} />
						</Box>

						<Box className={classes.infoCard} mt={{ base: "md", lg: 0 }}>
							<Text fw={700} mb="xs">
								{p.info_title}
							</Text>
							<div className={classes.metaRow}>
								<div className={classes.metaIcon}>
									<IconUser size={14} />
								</div>
								<Box>
									<Text size="xs" c="dimmed">
										Client:
									</Text>
									<Text fw={600} size="sm">
										{p.client_name}
									</Text>
								</Box>
							</div>
							<div className={classes.metaRow}>
								<div className={classes.metaIcon}>
									<IconTag size={14} />
								</div>
								<Box>
									<Text size="xs" c="dimmed">
										Category:
									</Text>
									<Text fw={600} size="sm">
										{p.category_label || p.project_category}
									</Text>
								</Box>
							</div>
							<div className={classes.metaRow}>
								<div className={classes.metaIcon}>
									<IconTag size={14} />
								</div>
								<Box>
									<Text size="xs" c="dimmed">
										Date:
									</Text>
									<Text fw={600} size="sm">
										{p.project_date}
									</Text>
								</Box>
							</div>
							<div className={classes.metaRow}>
								<div className={classes.metaIcon}>
									<IconMapPin size={14} />
								</div>
								<Box>
									<Text size="xs" c="dimmed">
										Address:
									</Text>
									<Text fw={600} size="sm">
										{p.address}
									</Text>
								</Box>
							</div>
						</Box>
					</Box>

					<Grid mt={{ base: "lg", md: "xl" }} gutter="xl">
						<Grid.Col span={{ base: 12, lg: 8 }}>
							<Stack gap="md">
								<Text className={classes.chip}>{p.project_category}</Text>
							<CustomPrismicRichText
								field={projectTitleField}
								variant="hero"
								c="dark.8"
								mb={{ base: 16, md: 24 }}
								maw="100%"
							/>
								<CustomPrismicRichText field={projectIntroField} body="body1" c="dimmed" />
							</Stack>
						</Grid.Col>
					</Grid>

					<Grid mt={{ base: 28, md: 36 }} gutter="xl" align="flex-start">
						<Grid.Col span={12}>
							<CustomPrismicRichText field={confidenceTitleField} c="dark.8" mb="md" />
							<Grid gutter="lg" align="flex-start">
								<Grid.Col span={{ base: 12, md: 4, lg: 3 }}>
									<Box className={classes.sectionImage}>
										<Image src={confidenceImage} alt="Confidence section" h={190} />
									</Box>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 8, lg: 5 }}>
									<Stack gap={10}>
										{confidencePoints.length > 0
											? confidencePoints.map((point, i) => (
													<Group key={`${point}-${i}`} gap={8} align="flex-start" wrap="nowrap">
														<ThemeIcon variant="light" color="orange" size={18} radius="xl">
															<IconArrowRight size={12} />
														</ThemeIcon>
														<Text size="sm">{point}</Text>
													</Group>
												))
											: null}
									</Stack>
								</Grid.Col>
								<Grid.Col span={{ base: 12, lg: 4 }}>
									<Box className={classes.helpCard}>
										<Title order={3} c="white">
											{p.help_title}
										</Title>
										<Text mt="xs">{p.help_phone}</Text>
										<Button
											mt="md"
											radius="xl"
											color="orange"
											component={Link}
											href={getLinkUrl(p.help_button_link) || "/contact"}
										>
											{p.help_button_label}
										</Button>
									</Box>
								</Grid.Col>
							</Grid>
						</Grid.Col>
					</Grid>

					<Box mt={{ base: 28, md: 36 }}>
						<CustomPrismicRichText field={challengeTitleField} c="dark.8" />
						<CustomPrismicRichText field={challengeTextField} body="body1" c="dimmed" mt="sm" />
						{challengeImages.length > 0 && (
							<SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mt="md">
								{challengeImages.slice(0, 2).map((img, i) => (
									<Box
										key={`${img}-${i}`}
										className={`${classes.sectionImage} ${classes.challengeImage}`}
									>
										<Image src={img} alt={`Challenge ${i + 1}`} h={{ base: 280, md: 340 }} />
									</Box>
								))}
							</SimpleGrid>
						)}
					</Box>

					<Group
						justify="space-between"
						mt={36}
						pt={20}
						style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }}
					>
						<Link href="/projects" className={classes.pagerLink}>
							<Group gap={6}>
								<IconArrowLeft size={16} /> Previous
							</Group>
						</Link>
						<Link href="/projects" className={classes.pagerLink}>
							<Group gap={6}>
								Next <IconArrowRight size={16} />
							</Group>
						</Link>
					</Group>
				</Box>
			</Box>
		</Box>
	);
};

export default ProjectDetails;
