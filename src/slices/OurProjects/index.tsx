"use client";

import {
	type CSSProperties,
	type FC,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import Link from "next/link";
import { type Content, isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import clsx from "clsx";
import { Box, Button, Group, Image, Stack, Text, Title, rem } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconArrowRight, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { CustomPrismicRichText } from "@/components/custom-components/CustomPrismicRichText";
import classes from "./OurProjects.module.css";

type OurProjectsProps = SliceComponentProps<Content.OurProjectsSlice>;

const DEFAULT_CAROUSEL_CTA = "/projects";
const DEFAULT_MOSAIC_CTA = "/contact";

const OurProjects: FC<OurProjectsProps> = ({ slice }) => {
	const p = slice.primary;

	const projectCards = useMemo(() => {
		const rows = p.project_cards ?? [];
		return rows.filter((row) => isFilled.image(row.image));
	}, [p.project_cards]);

	const mosaicPhotos = useMemo(() => {
		const rows = p.mosaic_photos ?? [];
		return rows.filter((row) => isFilled.image(row.image)).slice(0, 6);
	}, [p.mosaic_photos]);

	const isMosaicDesktop = useMediaQuery("(min-width: 48em)");

	const autoplayPlugin = useMemo(
		() =>
			Autoplay({
				delay: 3000,
				stopOnInteraction: true,
				stopOnMouseEnter: true,
			}),
		[],
	);

	const [emblaRef, emblaApi] = useEmblaCarousel(
		{
			loop: projectCards.length > 1,
			align: "start",
			skipSnaps: false,
		},
		projectCards.length > 1 ? [autoplayPlugin] : [],
	);

	const firstProjectImageRef = useRef<HTMLDivElement | null>(null);
	const [carouselNavYpx, setCarouselNavYpx] = useState<number | null>(null);

	useEffect(() => {
		const el = firstProjectImageRef.current;
		if (!el || projectCards.length === 0) {
			setCarouselNavYpx(null);
			return;
		}
		const measure = () => setCarouselNavYpx(el.offsetHeight / 2);
		const ro = new ResizeObserver(measure);
		ro.observe(el);
		measure();
		return () => ro.disconnect();
	}, [projectCards.length]);

	const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
	const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

	const carouselEyebrow =
		typeof p.carousel_eyebrow === "string" && p.carousel_eyebrow.trim()
			? p.carousel_eyebrow.trim()
			: "OUR PROJECTS";
	const carouselCtaText =
		typeof p.carousel_cta_label === "string" && p.carousel_cta_label.trim()
			? p.carousel_cta_label.trim()
			: "Browse All Project";

	const mosaicEyebrow =
		typeof p.mosaic_eyebrow === "string" && p.mosaic_eyebrow.trim()
			? p.mosaic_eyebrow.trim()
			: "WORK WITH US";
	const mosaicCtaText =
		typeof p.mosaic_cta_label === "string" && p.mosaic_cta_label.trim()
			? p.mosaic_cta_label.trim()
			: "Get In Touch";

	const showDark =
		isFilled.richText(p.carousel_title) ||
		isFilled.richText(p.carousel_intro) ||
		projectCards.length > 0;

	const showLight =
		isFilled.richText(p.mosaic_title) ||
		mosaicPhotos.length > 0 ||
		isFilled.link(p.mosaic_cta_link);

	if (!showDark && !showLight) return null;

	const MosaicCtaBlock = (
		<Box className={classes.mosaicCtaInner}>
			<Stack gap="lg" align="center">
				<Box className={classes.mosaicEyebrowRow}>
					<Box className={classes.mosaicLine} />
					<Text fw={700} tt="uppercase" size="sm" c="orange.6" style={{ letterSpacing: "0.14em" }}>
						{mosaicEyebrow}
					</Text>
					<Group gap={6} wrap="nowrap" align="center">
						<Box className={classes.mosaicLine} />
						<Box className={classes.mosaicDot} />
					</Group>
				</Box>

				{isFilled.richText(p.mosaic_title) && (
					<PrismicRichText
						field={p.mosaic_title}
						components={{
							heading2: ({ children }) => (
								<Title
									order={2}
									c="dark.9"
									ta="center"
									style={{
										fontSize: "clamp(1.35rem, 2.2vw + 0.65rem, 2rem)",
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

				{isFilled.link(p.mosaic_cta_link) ? (
					<Button
						component={PrismicNextLink}
						field={p.mosaic_cta_link}
						color="orange"
						size="md"
						radius="xl"
						rightSection={<IconArrowRight size={18} />}
						px={rem(26)}
					>
						{mosaicCtaText}
					</Button>
				) : (
					<Button
						component={Link}
						href={DEFAULT_MOSAIC_CTA}
						color="orange"
						size="md"
						radius="xl"
						rightSection={<IconArrowRight size={18} />}
						px={rem(26)}
					>
						{mosaicCtaText}
					</Button>
				)}
			</Stack>
		</Box>
	);

	return (
		<Box component="section" mb={{ base: 0, md: 100 }}>
			{showDark && (
				<Box className={classes.darkBand} mb={{ base: 0, md: 100 }}>
					<Box
						className="layout-content"
						w="100%"
						py={{ base: 40, sm: 48, md: 56 }}
						pos="relative"
						style={{ zIndex: 1 }}
					>
						<Box className={classes.decoCubeDark} aria-hidden />
						<Box className={classes.darkBandInner}>
							<Stack gap="xl">
								<Group align="flex-start" justify="space-between" gap="lg" wrap="wrap">
									<Stack gap="md" maw={{ base: "100%", md: "55%" }} miw={0}>
										<Group gap="sm" wrap="nowrap">
											<Box className={classes.eyebrowLine} />
											<Text
												fw={700}
												tt="uppercase"
												size="sm"
												c="orange.5"
												style={{ letterSpacing: "0.12em" }}
											>
												{carouselEyebrow}
											</Text>
										</Group>

										{isFilled.richText(p.carousel_title) && (
											<PrismicRichText
												field={p.carousel_title}
												components={{
													heading2: ({ children }) => (
														<Title
															order={2}
															c="white"
															style={{
																fontSize: "clamp(1.5rem, 2.2vw + 0.75rem, 2.5rem)",
																lineHeight: 1.15,
																fontWeight: 700,
															}}
														>
															{children}
														</Title>
													),
												}}
											/>
										)}

										{isFilled.richText(p.carousel_intro) && (
											<CustomPrismicRichText
												field={p.carousel_intro}
												body="body1"
												c="gray.3"
												maw="100%"
											/>
										)}
									</Stack>

									<Box style={{ flex: "0 0 auto" }}>
										{isFilled.link(p.carousel_cta_link) ? (
											<Button
												component={PrismicNextLink}
												field={p.carousel_cta_link}
												variant="default"
												radius="xl"
												size="md"
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
															border: "1px solid rgba(255,255,255,0.35)",
														}}
													>
														<IconArrowRight size={16} />
													</Box>
												}
												px={rem(20)}
												styles={{
													root: {
														background: "transparent",
														color: "white",
														borderColor: "rgba(255,255,255,0.55)",
														fontWeight: 600,
													},
												}}
											>
												{carouselCtaText}
											</Button>
										) : (
											<Button
												component={Link}
												href={DEFAULT_CAROUSEL_CTA}
												variant="default"
												radius="xl"
												size="md"
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
															border: "1px solid rgba(255,255,255,0.35)",
														}}
													>
														<IconArrowRight size={16} />
													</Box>
												}
												px={rem(20)}
												styles={{
													root: {
														background: "transparent",
														color: "white",
														borderColor: "rgba(255,255,255,0.55)",
														fontWeight: 600,
													},
												}}
											>
												{carouselCtaText}
											</Button>
										)}
									</Box>
								</Group>

								{projectCards.length > 0 && (
									<Box
										className={classes.carouselShell}
										style={
											carouselNavYpx != null
												? ({
														["--carousel-nav-y"]: `${carouselNavYpx}px`,
													} as CSSProperties)
												: undefined
										}
									>
										<Box className={classes.carouselViewport} ref={emblaRef}>
											<Box className={classes.carouselTrack}>
												{projectCards.map((card, idx) => (
													<Box key={`${card.title}-${idx}`} className={classes.carouselSlide}>
														<Stack gap="md">
															{isFilled.image(card.image) && (
																<Box
																	className={classes.projectCardImage}
																	ref={idx === 0 ? firstProjectImageRef : undefined}
																>
																	<Image
																		src={card.image.url}
																		alt={card.image.alt ?? ""}
																		radius="xl"
																		h="100%"
																		w="100%"
																		fit="cover"
																	/>
																</Box>
															)}
															{isFilled.keyText(card.title) && (
																<Title order={3} fz="lg" fw={700} c="white">
																	{card.title}
																</Title>
															)}
															{isFilled.richText(card.description) && (
																<CustomPrismicRichText
																	field={card.description}
																	body="body2"
																	c="gray.4"
																	maw="100%"
																/>
															)}
														</Stack>
													</Box>
												))}
											</Box>
										</Box>
										{projectCards.length > 1 && (
											<>
												<Button
													className={clsx(classes.navFab, classes.navFabPrev)}
													variant="default"
													onClick={scrollPrev}
													aria-label="Previous projects"
												>
													<IconChevronLeft size={22} />
												</Button>
												<Button
													className={clsx(classes.navFab, classes.navFabNext)}
													variant="default"
													onClick={scrollNext}
													aria-label="Next projects"
												>
													<IconChevronRight size={22} />
												</Button>
											</>
										)}
									</Box>
								)}
							</Stack>
						</Box>
					</Box>
				</Box>
			)}

			{showLight && (
				<Box
					className={classes.lightBand}
					py={{ base: 48, md: 64 }}
					px={{ base: "md", md: rem(48) }}
				>
					<Box className={classes.decoCubeOrange} aria-hidden />
					<Box className={classes.decoRipple} style={{ top: "18%", right: "22%" }} aria-hidden />
					<Box className={classes.decoRipple} style={{ bottom: "16%", right: "8%" }} aria-hidden />
					<Box className={classes.decoDotOrange} aria-hidden />
					<svg
						className={classes.decoWavesOrange}
						viewBox="0 0 100 48"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden
					>
						<path
							d="M4 12c10-4 16-4 26 0s16 4 26 0 16-4 26 0 10 4 14 4"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
						/>
						<path
							d="M4 24c10-4 16-4 26 0s16 4 26 0 16-4 26 0 10 4 14 4"
							stroke="currentColor"
							strokeWidth="2"
							strokeOpacity="0.75"
							strokeLinecap="round"
						/>
						<path
							d="M4 36c10-4 16-4 26 0s16 4 26 0 16-4 26 0 10 4 14 4"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeOpacity="0.55"
							strokeLinecap="round"
						/>
					</svg>

					{isMosaicDesktop && mosaicPhotos.length > 0 ? (
						<Stack gap="xl" className={classes.mosaicWrap}>
							<Box className={clsx(classes.mosaicRow, classes.mosaicRowTop)}>
								{mosaicPhotos.slice(0, 3).map((row, idx) => (
									<Box
										key={`mos-top-${idx}`}
										className={classes.mosaicCell}
										style={{ aspectRatio: "5 / 4" }}
									>
										<Image
											src={row.image.url}
											alt={row.image.alt ?? ""}
											fit="cover"
											h="100%"
											w="100%"
										/>
									</Box>
								))}
							</Box>
							<Box className={classes.mosaicCtaRow}>
								<Box maw={rem(448)} w="100%" mx="auto">
									{MosaicCtaBlock}
								</Box>
							</Box>
							{mosaicPhotos.length > 3 && (
								<Box className={clsx(classes.mosaicRow, classes.mosaicRowBottom)}>
									{mosaicPhotos.slice(3, 6).map((row, idx) => (
										<Box
											key={`mos-bot-${idx}`}
											className={classes.mosaicCell}
											style={{ aspectRatio: "5 / 4" }}
										>
											<Image
												src={row.image.url}
												alt={row.image.alt ?? ""}
												fit="cover"
												h="100%"
												w="100%"
											/>
										</Box>
									))}
								</Box>
							)}
						</Stack>
					) : (
						<Stack gap="xl" className={classes.mosaicStack}>
							{mosaicPhotos.length > 0 && (
								<>
									<Box className={classes.mosaicStackRow}>
										{mosaicPhotos.slice(0, 2).map((row, idx) => (
											<Box
												key={`m1-${idx}`}
												className={classes.mosaicCell}
												style={{ aspectRatio: "1 / 1" }}
											>
												<Image
													src={row.image.url}
													alt={row.image.alt ?? ""}
													fit="cover"
													h="100%"
													w="100%"
												/>
											</Box>
										))}
									</Box>
									{mosaicPhotos.length > 2 && (
										<Box className={classes.mosaicCell} style={{ aspectRatio: "16 / 10" }}>
											<Image
												src={mosaicPhotos[2].image.url}
												alt={mosaicPhotos[2].image.alt ?? ""}
												fit="cover"
												h="100%"
												w="100%"
											/>
										</Box>
									)}
								</>
							)}
							<Box style={{ alignSelf: "center", width: "100%", maxWidth: rem(400) }}>
								{MosaicCtaBlock}
							</Box>
							{mosaicPhotos.length > 3 && (
								<>
									<Box className={classes.mosaicStackRow}>
										{mosaicPhotos.slice(3, 5).map((row, idx) => (
											<Box
												key={`m2-${idx}`}
												className={classes.mosaicCell}
												style={{ aspectRatio: "1 / 1" }}
											>
												<Image
													src={row.image.url}
													alt={row.image.alt ?? ""}
													fit="cover"
													h="100%"
													w="100%"
												/>
											</Box>
										))}
									</Box>
									{mosaicPhotos[5] && (
										<Box className={classes.mosaicCell} style={{ aspectRatio: "16 / 10" }}>
											<Image
												src={mosaicPhotos[5].image.url}
												alt={mosaicPhotos[5].image.alt ?? ""}
												fit="cover"
												h="100%"
												w="100%"
											/>
										</Box>
									)}
								</>
							)}
						</Stack>
					)}

					{isMosaicDesktop && mosaicPhotos.length === 0 && (
						<Box maw={400} mx="auto">
							{MosaicCtaBlock}
						</Box>
					)}
				</Box>
			)}
		</Box>
	);
};

export default OurProjects;
