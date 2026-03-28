"use client";

import { type FC, useCallback, useEffect, useMemo, useState } from "react";
import { type Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import useEmblaCarousel from "embla-carousel-react";
import { Box, Button, Grid, Group, Image, Stack, Text, rem } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import type { SliceComponentProps } from "@prismicio/react";
import clsx from "clsx";
import { CustomPrismicRichText } from "@/components/custom-components/CustomPrismicRichText";
import classes from "./Hero.module.css";

type HeroProps = SliceComponentProps<Content.HeroSlice>;

const HERO_AUTOPLAY_INTERVAL_MS = 4000;

type StatRow = { value: string; label: string };

const DEFAULT_STATS: ReadonlyArray<StatRow> = [
	{ value: "20+", label: "Years of Experience" },
	{ value: "270+", label: "Projects" },
	{ value: "85+", label: "Team members" },
	{ value: "1200+", label: "Clients" },
];

function resolveStatsFromPrimary(stats: Content.HeroSliceDefaultPrimary["stats"]): StatRow[] {
	const rows = stats ?? [];
	const fromCms = rows
		.filter((row) => isFilled.keyText(row.value) && isFilled.keyText(row.label))
		.map((row) => ({
			value: row.value as string,
			label: row.label as string,
		}));
	return fromCms.length > 0 ? fromCms : [...DEFAULT_STATS];
}

const Hero: FC<HeroProps> = ({ slice }) => {
	const { title, description, cta_label, cta_link, carousel_images } = slice.primary;
	const images = carousel_images?.filter((item) => item.image.url) ?? [];
	const [selectedIndex, setSelectedIndex] = useState(0);

	const statsRows = useMemo(
		() => resolveStatsFromPrimary(slice.primary.stats),
		[slice.primary.stats],
	);

	const showCarousel = useMediaQuery("(min-width: 48em)");

	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: true,
		align: "start",
		skipSnaps: false,
	});

	const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
	const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

	const onSelect = useCallback(() => {
		if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap());
	}, [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return;
		emblaApi.on("select", onSelect);
		queueMicrotask(() => onSelect());
		return () => {
			emblaApi.off("select", onSelect);
		};
	}, [emblaApi, onSelect]);

	useEffect(() => {
		if (!showCarousel || images.length <= 1) return;
		const interval = setInterval(() => {
			emblaApi?.scrollNext();
		}, HERO_AUTOPLAY_INTERVAL_MS);
		return () => clearInterval(interval);
	}, [emblaApi, images.length, showCarousel]);

	const mainImage = images[selectedIndex]?.image ?? images[0]?.image;
	const ctaLabel = typeof cta_label === "string" ? cta_label : "Discover More";

	if (images.length === 0) return null;

	const carouselArrows = [
		{ fn: scrollPrev, label: "Previous slide" as const, Icon: IconArrowLeft },
		{ fn: scrollNext, label: "Next slide" as const, Icon: IconArrowRight },
	];

	return (
		<Box component="section" className={classes.heroSection} mt={{ base: 24, sm: 36, md: 50 }}>
			<Box className={classes.heroGridWrap}>
				<Grid gutter={{ base: "md", md: 20 }} align="stretch">
					<Grid.Col span={{ base: 12, md: 5.5 }}>
						<Box
							pl={{ base: 0, md: 50 }}
							pr={{ base: 0, md: 0 }}
							h={{ base: 260, sm: 320, md: 700 }}
							mih={{ base: 220, sm: 280, md: undefined }}
						>
							{mainImage && (
								<Image src={mainImage.url} alt={""} radius="xl" h="100%" w="100%" fit="cover" />
							)}
						</Box>
					</Grid.Col>

					<Grid.Col span={{ base: 12, md: 6.5 }} className={classes.overflowVisible}>
						<Stack
							className={classes.rightStack}
							px={{ base: 0, md: rem(40) }}
							pt={{ base: 24, sm: 28, md: 0 }}
						>
							<Box className={classes.heroCopy}>
								<CustomPrismicRichText
									field={title}
									variant="hero"
									mb={{ base: 16, md: 24 }}
									maw="100%"
								/>
								<CustomPrismicRichText
									field={description}
									c="dark.6"
									lh={{ base: 1.65, md: 2 }}
									mb={{ base: 24, md: 40 }}
									maw={{ base: "100%", sm: 500 }}
									w="100%"
									mx={{ base: "auto", md: 0 }}
								/>

								{cta_label && (
									<Button
										component={PrismicNextLink}
										field={cta_link}
										color="orange"
										size="md"
										radius="xl"
										rightSection={<IconArrowRight size={20} />}
										px={rem(32)}
										w="fit-content"
									>
										{ctaLabel}
									</Button>
								)}
							</Box>

							<Box className={clsx(classes.carouselMetrics, classes.carouselDesktopOnly)}>
								<Box className={classes.carouselWrap}>
									<div ref={emblaRef} className={classes.emblaViewport}>
										<Box className={classes.emblaTrack}>
											{images.map((item, idx) => (
												<Box
													key={idx}
													className={clsx(
														classes.slide,
														selectedIndex === idx && classes.slideActive,
													)}
												>
													<Image
														src={item.image.url}
														alt={item.image.alt ?? ""}
														radius="xl"
														h="100%"
														w="100%"
														fit="cover"
														className={classes.slideImage}
													/>
												</Box>
											))}
										</Box>
									</div>
									<Group gap="xs" className={classes.navOverlay}>
										{carouselArrows.map(({ fn, label, Icon }) => (
											<Button
												key={label}
												variant="default"
												className={classes.navBtn}
												onClick={fn}
												aria-label={label}
											>
												<Icon size={18} />
											</Button>
										))}
									</Group>
								</Box>
							</Box>

							<Box className={clsx(classes.statsBand, classes.statsInline)}>
								<div className={classes.statsInlineInner}>
									{statsRows.map((stat, index) => (
										<Stack
											key={`${stat.value}-${stat.label}-${index}`}
											gap={6}
											align="center"
											ta="center"
										>
											<Text component="span" fw={700} c="dark.8" className={classes.statValue}>
												{stat.value}
											</Text>
											<Text
												c="dark.4"
												fw={500}
												maw="100%"
												tt="uppercase"
												className={classes.statLabel}
												lh={1.35}
											>
												{stat.label}
											</Text>
										</Stack>
									))}
								</div>
							</Box>
						</Stack>
					</Grid.Col>
				</Grid>
			</Box>

			<Box className={clsx(classes.statsAside, classes.statsAsideDesktop)}>
				<Grid className={classes.statsAsideGrid} gutter={{ base: "sm", sm: "md", md: "xl" }} align="center">
					{statsRows.map((stat, index) => (
						<Grid.Col
							key={`${stat.value}-${stat.label}-${index}`}
							span={{ base: 6, sm: 6, md: 3 }}
							className={classes.statCol}
						>
							<Stack gap={6} align="center" justify="center" ta="center" py={{ base: "xs", md: 0 }} w="100%">
								<Text component="span" fw={700} c="dark.8" className={classes.statValue} ta="center">
									{stat.value}
								</Text>
								<Text
									c="dark.4"
									fw={500}
									tt="uppercase"
									className={classes.statLabel}
									lh={1.35}
									ta="center"
								>
									{stat.label}
								</Text>
							</Stack>
						</Grid.Col>
					))}
				</Grid>
			</Box>
		</Box>
	);
};

export default Hero;
