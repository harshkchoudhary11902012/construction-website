"use client";

import { type FC } from "react";
import { PrismicNextLink } from "@prismicio/next";
import { Box, Grid, Group, Image, Stack, Text, Anchor, rem } from "@mantine/core";
import {
	IconMapPin,
	IconPhone,
	IconMail,
	IconBrandFacebook,
	IconBrandTwitter,
	IconBrandLinkedin,
	IconBrandYoutube,
	IconBrandInstagram,
} from "@tabler/icons-react";
import type { SliceComponentProps } from "@prismicio/react";
import { CustomPrismicRichText } from "@/components/custom-components/CustomPrismicRichText";
import type { Content } from "@prismicio/client";
import { asText, isFilled } from "@prismicio/client";

type FooterColumnsProps = SliceComponentProps<Content.FooterColumnsSlice>;

const SOCIAL_ICONS: Record<string, typeof IconBrandFacebook> = {
	facebook: IconBrandFacebook,
	twitter: IconBrandTwitter,
	linkedin: IconBrandLinkedin,
	youtube: IconBrandYoutube,
	instagram: IconBrandInstagram,
};

const CONTACT_ICONS: Record<string, typeof IconMapPin> = {
	location: IconMapPin,
	phone: IconPhone,
	email: IconMail,
};

const FooterColumns: FC<FooterColumnsProps> = ({ slice }) => {
	const {
		company_logo,
		company_name,
		company_description,
		social_links,
		get_in_touch_heading,
		contact_items,
		useful_links_heading,
		useful_links,
		explore_heading,
		explore_links,
	} = slice.primary;

	const socials = social_links ?? [];
	const contacts = contact_items ?? [];
	const useful = useful_links ?? [];
	const explore = explore_links ?? [];

	return (
		<Box className="layout-content" w="100%">
			<Stack justify="center" align="stretch" py={{ base: 32, sm: 40, md: 50 }} px={0}>
				<Grid grow w="100%" gutter={{ base: "md", sm: "lg", md: "xl" }}>
				{/* Column 1: About */}
				<Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
					<Stack gap="xl">
						{(company_logo.url || company_name) && (
							<Group gap="sm" wrap="wrap" align="center">
								{company_logo?.url && (
									<Image
										src={company_logo.url}
										alt={company_logo.alt ?? ""}
										w={100}
										h={60}
										// fit="contain"
									/>
								)}
								{company_name && (
									<Text
										fz={{ base: 18, sm: 20 }}
										c="dark.7"
										maw={{ base: "100%", sm: 220 }}
										style={{ wordBreak: "break-word" }}
									>
										{company_name}
									</Text>
								)}
							</Group>
						)}
						{company_description && (
							<CustomPrismicRichText
								field={company_description}
								body="body2"
								c="dark.6"
								maw={{ base: "100%", sm: 360 }}
								w="100%"
							/>
						)}
						<Group gap="xs">
							{socials.map((item, idx) => {
								const Icon =
									SOCIAL_ICONS[item.icon ?? "facebook"] ?? IconBrandFacebook;
								return (
									<Anchor
										key={idx}
										component={PrismicNextLink}
										field={item.link}
										style={{
											width: rem(36),
											height: rem(36),
											borderRadius: "50%",
											border: "1px solid var(--mantine-color-dark-3)",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											color: "var(--mantine-color-dark-7)",
										}}
									>
										<Icon size={18} />
									</Anchor>
								);
							})}
						</Group>
					</Stack>
				</Grid.Col>

				{/* Column 2: Get In Touch */}
				<Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
					<Stack gap="xl">
						{get_in_touch_heading && (
							<Text fw={600} size="md" c="dark.7">
								{get_in_touch_heading}
							</Text>
						)}
						{contacts.map((item, idx) => {
							const Icon = CONTACT_ICONS[item.icon ?? "location"] ?? IconMapPin;
							const text = asText(item.lines) || "";
							return (
								<Group key={idx} align="flex-start" gap="sm" wrap="nowrap">
									<Icon
										size={18}
										style={{ marginTop: 4 }}
										color="var(--mantine-color-dark-5)"
									/>
									<Stack gap={2}>
										{isFilled.link(item.link) ? (
											<Anchor
												component={PrismicNextLink}
												field={item.link}
												c="dark.6"
												size="sm"
												style={{
													textDecoration: "none",
													whiteSpace: "pre-line",
												}}
											>
												{text}
											</Anchor>
										) : (
											<Text
												size="sm"
												c="dark.6"
												style={{ whiteSpace: "pre-line" }}
											>
												{text}
											</Text>
										)}
									</Stack>
								</Group>
							);
						})}
					</Stack>
				</Grid.Col>

				{/* Column 3: Useful Links */}
				<Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
					<Stack gap="xl">
						{useful_links_heading && (
							<Text fw={600} size="md" c="dark.7">
								{useful_links_heading}
							</Text>
						)}
						<Stack gap="md">
							{useful.map((item, idx) => (
								<Anchor
									key={idx}
									component={PrismicNextLink}
									field={item.link}
									c="dark.6"
									size="sm"
									style={{ textDecoration: "none" }}
								>
									&gt; {item.label}
								</Anchor>
							))}
						</Stack>
					</Stack>
				</Grid.Col>

				{/* Column 4: Explore */}
				<Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
					<Stack gap="xl">
						{explore_heading && (
							<Text fw={600} size="md" c="dark.7">
								{explore_heading}
							</Text>
						)}
						<Stack gap="md">
							{explore.map((item, idx) => (
								<Anchor
									key={idx}
									component={PrismicNextLink}
									field={item.link}
									c="dark.6"
									size="sm"
									style={{ textDecoration: "none" }}
								>
									&gt; {item.label}
								</Anchor>
							))}
						</Stack>
					</Stack>
				</Grid.Col>
			</Grid>
			</Stack>
		</Box>
	);
};

export default FooterColumns;
