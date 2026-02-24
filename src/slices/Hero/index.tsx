"use client";

import { type FC, useCallback, useEffect, useState } from "react";
import { type Content } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import useEmblaCarousel from "embla-carousel-react";
import { Box, Button, Group, Image, Grid, Stack, rem } from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import type { SliceComponentProps } from "@prismicio/react";
import { CustomPrismicRichText } from "@/components/custom-components/CustomPrismicRichText";

type HeroProps = SliceComponentProps<Content.HeroSlice>;

const HERO_AUTOPLAY_INTERVAL_MS = 4000;

const Hero: FC<HeroProps> = ({ slice }) => {
	const { title, description, cta_label, cta_link, carousel_images } = slice.primary;
	const images = carousel_images?.filter((item) => item.image.url) ?? [];
	const [selectedIndex, setSelectedIndex] = useState(0);

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
		// Sync initial state
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

	return (
		<Box h={"100vh"} mt={30}>
			<Grid gutter={0} h="100%">
				<Grid.Col span={{ base: 12, md: 5.5 }}>
					{/* Left Column: Main Image */}
					<Box pos="relative" pl={50} h="100%">
						{mainImage && (
							<Image
								src={mainImage.url}
								alt={""}
								radius="xl"
								h="100%"
								w="auto"
								fit="cover"
							/>
						)}
					</Box>
				</Grid.Col>

				<Grid.Col span={{ base: 12, md: 6.5 }}>
					<Stack px={65} gap={0}>
						<CustomPrismicRichText
							field={title}
							variant="hero"
							mb={24}
							mt={50}
							w={20}
						/>
						<CustomPrismicRichText field={description} body="body1" mb={40} w={500} />

						{cta_label && (
							<Button
								component={PrismicNextLink}
								field={cta_link}
								color="orange"
								size="md"
								radius="xl"
								rightSection={<IconArrowRight size={20} />}
								mb={rem(48)}
								px={rem(32)}
								w="fit-content"
							>
								{ctaLabel}
							</Button>
						)}

						{/* Carousel */}
						<Box pos="relative" style={{ overflow: "visible" }}>
							<div ref={emblaRef} style={{ overflow: "hidden" }}>
								<Box style={{ display: "flex", gap: rem(12) }}>
									{images.map((item, idx) => (
										<Box
											key={idx}
											style={{
												flex: `0 0 calc((100% - ${rem(24)}) / 3)`,
												minWidth: 0,
												borderRadius: "var(--mantine-radius-xl)",
												overflow: "hidden",
												aspectRatio: "16/9",
												position: "relative",
												border:
													selectedIndex === idx
														? "2px solid var(--mantine-color-orange-5)"
														: "2px solid transparent",
												transition: "border-color 0.3s ease",
											}}
										>
											<Image
												src={item.image.url}
												alt={item.image.alt ?? ""}
												radius="xl"
												h="100%"
												w="100%"
												fit="cover"
												style={{ position: "absolute", inset: 0 }}
											/>
										</Box>
									))}
								</Box>
							</div>
							<Group
								gap="xs"
								style={{
									position: "absolute",
									left: rem(-20),
									right: rem(-20),
									top: "50%",
									transform: "translateY(-50%)",
									justifyContent: "space-between",
									pointerEvents: "none",
								}}
							>
								<Button
									variant="filled"
									size="sm"
									h={rem(40)}
									w={rem(40)}
									p={0}
									radius="xl"
									onClick={scrollPrev}
									aria-label="Previous slide"
									style={{
										pointerEvents: "auto",
										backgroundColor: "white",
										color: "var(--mantine-color-dark-7)",
										border: "1px solid gray",
									}}
								>
									<IconArrowLeft size={18} />
								</Button>
								<Button
									variant="filled"
									size="sm"
									h={rem(40)}
									w={rem(40)}
									p={0}
									radius="xl"
									onClick={scrollNext}
									aria-label="Next slide"
									style={{
										pointerEvents: "auto",
										backgroundColor: "white",
										color: "var(--mantine-color-dark-7)",
										border: "1px solid gray",
									}}
								>
									<IconArrowRight size={18} />
								</Button>
							</Group>
						</Box>
						{/* </Box> */}
					</Stack>
				</Grid.Col>
			</Grid>
		</Box>
	);
};

export default Hero;
