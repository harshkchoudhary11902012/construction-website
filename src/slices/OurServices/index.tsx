"use client";

import { type FC } from "react";
import Link from "next/link";
import { type Content, isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import {
	Box,
	Button,
	Grid,
	Group,
	Image,
	Stack,
	Text,
	Title,
	rem,
} from "@mantine/core";
import {
	IconArrowRight,
	IconBuildingSkyscraper,
	IconHammer,
	IconHome,
	IconLayoutBoard,
	IconRulerMeasure,
} from "@tabler/icons-react";
import { CustomPrismicRichText } from "@/components/custom-components/CustomPrismicRichText";
import classes from "./OurServices.module.css";

type OurServicesProps = SliceComponentProps<Content.OurServicesSlice>;

type ServiceIconKey = "blueprint" | "frame" | "home" | "building" | "hammer";

const SERVICE_ICONS: Record<ServiceIconKey, typeof IconRulerMeasure> = {
	blueprint: IconRulerMeasure,
	frame: IconLayoutBoard,
	home: IconHome,
	building: IconBuildingSkyscraper,
	hammer: IconHammer,
};

const DEFAULT_CTA_PATH = "/services";

function resolveIcon(key: string | null | undefined) {
	const k = (key ?? "blueprint") as ServiceIconKey;
	return SERVICE_ICONS[k] ?? IconRulerMeasure;
}

const OurServices: FC<OurServicesProps> = ({ slice }) => {
	const { eyebrow, title, intro, cta_label, cta_link, services } = slice.primary;

	const rows = services ?? [];
	const visible = rows.filter(
		(row) =>
			isFilled.keyText(row.title) ||
			isFilled.image(row.image) ||
			(row.description && row.description.length > 0),
	);

	const eyebrowText =
		typeof eyebrow === "string" && eyebrow.trim() ? eyebrow.trim() : "OUR SERVICES";
	const ctaText =
		typeof cta_label === "string" && cta_label.trim() ? cta_label.trim() : "Browse All Services";

	if (visible.length === 0 && !isFilled.richText(title) && !isFilled.richText(intro)) {
		return null;
	}

	return (
		<Box
			component="section"
			className={classes.section}
			py={{ base: 40, sm: 48, md: 64 }}
			px={{ base: "md", sm: "lg", md: rem(48) }}
			bg="gray.0"
		>
			<Box className={classes.surface} p={{ base: rem(24), sm: rem(32), md: rem(48) }}>
				<svg
					className={classes.decoWaves}
					viewBox="0 0 120 80"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden
				>
					<path
						d="M4 40c12-8 20-8 32 0s20 8 32 0 20-8 32 0 12 8 16 8"
						stroke="currentColor"
						strokeWidth="3"
						strokeLinecap="round"
					/>
					<path
						d="M4 56c12-8 20-8 32 0s20 8 32 0 20-8 32 0 12 8 16 8"
						stroke="currentColor"
						strokeWidth="2"
						strokeOpacity="0.7"
						strokeLinecap="round"
					/>
				</svg>
				<Box className={classes.decoCube} aria-hidden />
				<Box className={classes.decoRing} aria-hidden />

				<Box className={classes.inner}>
					<Stack gap="xl">
						<Group
							align="flex-start"
							justify="space-between"
							gap="lg"
							wrap="wrap"
							grow={false}
						>
							<Stack gap="md" maw={{ base: "100%", md: "58%" }} miw={0} flex="1 1 280px">
								<Group gap="sm" wrap="nowrap">
									<Box className={classes.eyebrowDot} />
									<Text
										fw={700}
										tt="uppercase"
										size="sm"
										c="dark.7"
										style={{ letterSpacing: "0.12em" }}
									>
										{eyebrowText}
									</Text>
								</Group>

								{isFilled.richText(title) && (
									<PrismicRichText
										field={title}
										components={{
											heading2: ({ children }) => (
												<Title
													order={2}
													c="dark.9"
													style={{
														fontSize: "clamp(1.5rem, 2vw + 0.85rem, 2.35rem)",
														lineHeight: 1.2,
														fontWeight: 700,
													}}
												>
													{children}
												</Title>
											),
										}}
									/>
								)}

								{isFilled.richText(intro) && (
									<CustomPrismicRichText
										field={intro}
										body="body1"
										size="md"
										c="dimmed"
										maw="100%"
									/>
								)}
							</Stack>

							<Box style={{ flex: "0 0 auto" }} pt={{ base: 0, md: rem(8) }}>
								{isFilled.link(cta_link) ? (
									<Button
										component={PrismicNextLink}
										field={cta_link}
										color="dark"
										size="md"
										radius="xl"
										rightSection={
											<Box
												component="span"
												style={{
													display: "inline-flex",
													alignItems: "center",
													justifyContent: "center",
													width: 28,
													height: 28,
													borderRadius: "50%",
													background: "rgba(255,255,255,0.15)",
												}}
											>
												<IconArrowRight size={16} />
											</Box>
										}
										px={rem(22)}
										styles={{
											root: { fontWeight: 600 },
										}}
									>
										{ctaText}
									</Button>
								) : (
									<Button
										component={Link}
										href={DEFAULT_CTA_PATH}
										color="dark"
										size="md"
										radius="xl"
										rightSection={
											<Box
												component="span"
												style={{
													display: "inline-flex",
													alignItems: "center",
													justifyContent: "center",
													width: 28,
													height: 28,
													borderRadius: "50%",
													background: "rgba(255,255,255,0.15)",
												}}
											>
												<IconArrowRight size={16} />
											</Box>
										}
										px={rem(22)}
										styles={{
											root: { fontWeight: 600 },
										}}
									>
										{ctaText}
									</Button>
								)}
							</Box>
						</Group>

						{visible.length > 0 && (
							<Grid gutter={{ base: "lg", md: "xl" }} mt={{ base: "sm", md: "md" }}>
								{visible.map((item, idx) => {
									const Icon = resolveIcon(item.icon);
									return (
										<Grid.Col key={`${item.title ?? "s"}-${idx}`} span={{ base: 12, md: 4 }}>
											<Stack gap="lg" align="flex-start">
												<Box className={classes.iconRing}>
													<Icon size={26} stroke={1.5} />
												</Box>

												{isFilled.keyText(item.title) && (
													<Title order={3} fz="lg" fw={700} c="dark.9" lh={1.3}>
														{item.title}
													</Title>
												)}

												{isFilled.richText(item.description) && (
													<CustomPrismicRichText
														field={item.description}
														body="body2"
														c="dimmed"
														maw="100%"
													/>
												)}

												{isFilled.image(item.image) && (
													<Box className={classes.serviceImage}>
														<Image
															src={item.image.url}
															alt={item.image.alt ?? ""}
															radius="lg"
															h="100%"
															w="100%"
															fit="cover"
														/>
													</Box>
												)}
											</Stack>
										</Grid.Col>
									);
								})}
							</Grid>
						)}
					</Stack>
				</Box>
			</Box>
		</Box>
	);
};

export default OurServices;
