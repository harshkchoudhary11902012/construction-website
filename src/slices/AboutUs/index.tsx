"use client";

import { type FC, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { type Content, isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import { motion } from "framer-motion";
import { Box, Button, Grid, Group, Stack, Text, Title, rem } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconArrowRight, IconCheck, IconChevronRight, IconPhone } from "@tabler/icons-react";
import { CustomPrismicRichText } from "@/components/custom-components/CustomPrismicRichText";
import classes from "./AboutUs.module.css";

type AboutUsProps = SliceComponentProps<Content.AboutUsSlice>;

const AUTO_ADVANCE_MS = 5200;
const DEFAULT_ABOUT_PATH = "/about-us";

const DEFAULT_FEATURES = [
	"Quality real estate services",
	"100% Satisfaction guarantee",
	"Highly professional team",
	"Dealing always on time",
] as const;

const FALLBACK_CAROUSEL_URLS = [
	"https://images.unsplash.com/photo-1518005020951-eccb49477700?w=1200&h=900&fit=crop",
	"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=900&fit=crop",
	"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=900&fit=crop",
] as const;

function resolveCarouselUrls(slice: Content.AboutUsSlice): string[] {
	const fromCms =
		slice.primary.carousel_images
			?.map((row) => row.image?.url)
			.filter((url): url is string => Boolean(url)) ?? [];
	if (fromCms.length > 0) return fromCms;
	return [...FALLBACK_CAROUSEL_URLS];
}

function resolveFeatures(slice: Content.AboutUsSlice): string[] {
	const rows = slice.primary.features ?? [];
	const fromCms = rows.filter((row) => isFilled.keyText(row.text)).map((row) => row.text as string);
	return fromCms.length > 0 ? fromCms : [...DEFAULT_FEATURES];
}

const AboutUs: FC<AboutUsProps> = ({ slice }) => {
	const { eyebrow, title, description, phone_label, phone_number, more_button_label, more_link } =
		slice.primary;

	const isDesktop = useMediaQuery("(min-width: 48em)");
	const stackStepX = isDesktop ? 92 : 48;

	const images = useMemo(() => resolveCarouselUrls(slice), [slice]);
	const features = useMemo(() => resolveFeatures(slice), [slice]);
	const n = images.length;
	const [active, setActive] = useState(0);

	const next = useCallback(() => {
		if (n <= 1) return;
		setActive((i) => (i + 1) % n);
	}, [n]);

	useEffect(() => {
		if (n <= 1) return;
		const t = setInterval(next, AUTO_ADVANCE_MS);
		return () => clearInterval(t);
	}, [n, next]);

	const eyebrowText = typeof eyebrow === "string" && eyebrow.trim() ? eyebrow : "ABOUT US";
	const phoneLabelText =
		typeof phone_label === "string" && phone_label.trim() ? phone_label : "Call Us 24/7";
	const phoneNumberText =
		typeof phone_number === "string" && phone_number.trim() ? phone_number : "+01 234 56789";
	const moreLabel =
		typeof more_button_label === "string" && more_button_label.trim()
			? more_button_label
			: "More About Us";

	const moreButtonShared = {
		color: "dark" as const,
		size: "md" as const,
		radius: "xl" as const,
		rightSection: <IconArrowRight size={18} />,
		px: rem(28),
		mt: rem(28),
		w: "fit-content" as const,
		children: moreLabel,
	};

	const carouselStage = (
		<Box pos="relative" className={classes.stage}>
			<Box className={classes.decoCircle} />

			{n > 0 &&
				[...images].map((url, i) => {
					const stackIndex = (i - active + n * 100) % n;
					const translateX = stackIndex * stackStepX;
					const scale = 1 - stackIndex * 0.08;
					const opacity = Math.max(0.58, 1 - stackIndex * 0.24);

					return (
						<motion.div
							key={`${url}-${i}`}
							className={classes.card}
							initial={false}
							animate={{
								x: translateX,
								y: "-50%",
								scale,
								opacity,
								zIndex: n - stackIndex,
							}}
							transition={{
								type: "tween",
								duration: 0.7,
								ease: [0.22, 1, 0.36, 1],
							}}
							style={{ top: "50%" }}
						>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img className={classes.cardImage} src={url} alt="" />
						</motion.div>
					);
				})}

			{n > 1 && (
				<Box className={classes.navBtnWrap}>
					<Button
						variant="default"
						radius="xl"
						w={54}
						h={54}
						p={0}
						onClick={next}
						aria-label="Next image"
						styles={{
							root: {
								boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
								border: "1px solid rgba(0,0,0,0.08)",
							},
						}}
					>
						<IconChevronRight size={30} stroke={2.25} />
					</Button>
				</Box>
			)}
		</Box>
	);

	return (
		<Box
			component="section"
			className={classes.section}
			py={{ base: 40, sm: 48, md: 72 }}
			px={{ base: "md", sm: "lg", md: rem(56), lg: rem(72) }}
		>
			<Grid className={classes.grid} gutter={{ base: "lg", md: "xl" }} align="center">
				{/* Mobile: carousel first; desktop: copy left */}
				<Grid.Col span={{ base: 12, md: 5 }} order={{ base: 2, md: 1 }}>
					<Stack gap="lg">
							<Group gap="sm" align="center" wrap="nowrap">
								<Box w={32} h={3} bg="orange.6" style={{ borderRadius: 2, flexShrink: 0 }} />
								<Text
									fw={700}
									tt="uppercase"
									size="sm"
									c="dark.8"
									style={{ letterSpacing: "0.12em" }}
								>
									{eyebrowText}
								</Text>
							</Group>

							<PrismicRichText
								field={title}
								components={{
									heading2: ({ children }) => (
										<Title
											order={2}
											c="dark.8"
											style={{
												fontSize: "clamp(1.65rem, 2vw + 1rem, 2.75rem)",
												lineHeight: 1.15,
												fontWeight: 700,
											}}
										>
											{children}
										</Title>
									),
								}}
							/>

							<CustomPrismicRichText
								field={description}
								body="body1"
								size="md"
								c="dimmed"
								maw={{ base: "100%", lg: 520 }}
							/>

							<Group wrap="wrap" align="flex-start" gap="xl" mt="md">
								<Stack gap="sm" style={{ flex: "1 1 220px", minWidth: 0 }}>
									{features.map((line) => (
										<Group key={line} gap="sm" wrap="nowrap" align="flex-start">
											<IconCheck
												size={20}
												color="var(--mantine-color-orange-6)"
												style={{ flexShrink: 0 }}
											/>
											<Text size="sm" c="dark.7" lh={1.5}>
												{line}
											</Text>
										</Group>
									))}
								</Stack>

								<Stack gap={6} style={{ flex: "0 0 auto" }} miw={0}>
									<Box
										w={{ base: 48, sm: 52 }}
										h={{ base: 48, sm: 52 }}
										bg="orange.6"
										style={{
											borderRadius: "50%",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<IconPhone size={24} color="white" />
									</Box>
									<Text
										size="xs"
										c="dimmed"
										tt="uppercase"
										fw={600}
										style={{ letterSpacing: "0.06em" }}
									>
										{phoneLabelText}
									</Text>
									<Title order={3} fz={{ base: "lg", sm: "xl" }} fw={800} c="dark.8" lh={1.2}>
										{phoneNumberText}
									</Title>
								</Stack>
							</Group>

							{isFilled.link(more_link) ? (
								<Button component={PrismicNextLink} field={more_link} {...moreButtonShared} />
							) : (
								<Button component={Link} href={DEFAULT_ABOUT_PATH} {...moreButtonShared} />
							)}
						</Stack>
				</Grid.Col>

				<Grid.Col span={{ base: 12, md: 7 }} order={{ base: 1, md: 2 }}>
					{carouselStage}
				</Grid.Col>
			</Grid>
		</Box>
	);
};

export default AboutUs;
