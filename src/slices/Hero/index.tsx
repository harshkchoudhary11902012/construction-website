"use client";

import { type FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import useEmblaCarousel from "embla-carousel-react";
import { Box, Button, Grid, Group, Image, Stack, Text, rem } from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import type { SliceComponentProps } from "@prismicio/react";
import clsx from "clsx";
import { CustomPrismicRichText } from "@/components/custom-components/CustomPrismicRichText";
import classes from "./Hero.module.css";

type HeroProps = SliceComponentProps<Content.HeroSlice>;

const HERO_AUTOPLAY_INTERVAL_MS = 4000;
const HERO_STATS_OVERLAP_RATIO = 0.28;
const HERO_STATS_SHIFT_DOWN_PX = 70;

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

	const heroGridRef = useRef<HTMLDivElement>(null);
	const [statsOverlapPx, setStatsOverlapPx] = useState(0);

	useEffect(() => {
		const el = heroGridRef.current;
		if (!el) return;
		const update = () => {
			const pull = Math.round(el.offsetHeight * HERO_STATS_OVERLAP_RATIO);
			setStatsOverlapPx(Math.max(0, pull - HERO_STATS_SHIFT_DOWN_PX));
		};
		update();
		const ro = new ResizeObserver(update);
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

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
		if (images.length <= 1) return;
		const interval = setInterval(() => {
			emblaApi?.scrollNext();
		}, HERO_AUTOPLAY_INTERVAL_MS);
		return () => clearInterval(interval);
	}, [emblaApi, images.length]);

	const mainImage = images[selectedIndex]?.image ?? images[0]?.image;
	const ctaLabel = typeof cta_label === "string" ? cta_label : "Discover More";

	if (images.length === 0) return null;

	const carouselArrows = [
		{ fn: scrollPrev, label: "Previous slide" as const, Icon: IconArrowLeft },
		{ fn: scrollNext, label: "Next slide" as const, Icon: IconArrowRight },
	];

	const statsAsideStyle =
		statsOverlapPx > 0 ? ({ marginTop: -statsOverlapPx } as const) : undefined;

	return (
		<Box component="section" className={classes.heroSection} mt={50}>
			<Box ref={heroGridRef} className={classes.heroGridWrap}>
				<Grid gutter={20} align="stretch">
					<Grid.Col span={{ base: 12, md: 5.5 }}>
						<Box pl={{ base: "md", md: 50 }} pr={{ base: "md", md: 0 }} h={{ base: 300, md: 700 }}>
							{mainImage && (
								<Image src={mainImage.url} alt={""} radius="xl" h="100%" w="100%" fit="cover" />
							)}
						</Box>
					</Grid.Col>

					<Grid.Col span={{ base: 12, md: 6.5 }} className={classes.overflowVisible}>
						<Stack
							className={classes.rightStack}
							justify="space-between"
							gap={0}
							px={{ base: "md", md: rem(40) }}
							pt={{ base: 32, md: 50 }}
						>
							<Box>
								<CustomPrismicRichText field={title} variant="hero" mb={24} maw="100%" />
								<CustomPrismicRichText
									field={description}
									c="dark.6"
									lh={2}
									mb={40}
									maw={500}
									w="100%"
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

							<Box className={classes.carouselMetrics}>
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
						</Stack>
					</Grid.Col>
				</Grid>
			</Box>

			<Box className={classes.statsAside} style={statsAsideStyle}>
				<Grid gutter={{ base: "md", md: "xl" }} align="center">
					{statsRows.map((stat, index) => (
						<Grid.Col key={`${stat.value}-${stat.label}-${index}`} span={{ base: 6, sm: 6, md: 3 }}>
							<Stack gap={6} align="center" ta="center" mt={200}>
								<Text fw={700} c="dark.8" className={classes.statValue} fz={48}>
									{stat.value}
								</Text>
								<Text
									size="md"
									c="dark.4"
									fw={500}
									maw={rem(200)}
									tt="uppercase"
									className={classes.statLabel}
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
