"use client";

import { Group, Button, Burger, Drawer, Stack, Anchor, Box, Image, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PrismicNextLink } from "@prismicio/next";
import type {
	NavigationDocument,
	NavigationDocumentDataNavLinksItem,
} from "../../../prismicio-types";

type HeaderProps = {
	navigation: NavigationDocument | null;
};

export function Header({ navigation }: HeaderProps) {
	const [opened, { toggle, close }] = useDisclosure(false);

	const navLinks = navigation?.data?.nav_links ?? [];
	const logo = navigation?.data?.logo;
	const line1 = navigation?.data?.company_name_line1;
	const line2 = navigation?.data?.company_name_line2;
	const ctaLabel = navigation?.data?.cta_label;
	const ctaLink = navigation?.data?.cta_link;

	const companyNameLine1 = typeof line1 === "string" ? line1 : "BUILDA";
	const companyNameLine2 = typeof line2 === "string" ? line2 : "CONSTRUCTIONS";
	const ctaButtonLabel = typeof ctaLabel === "string" ? ctaLabel : "GET A QUOTE";

	return (
		<>
			<Group
				justify="space-between"
				h={rem(120)}
				px={rem(60)}
				wrap="nowrap"
				style={{ width: "100%" }}
			>
				{/* Left: logo and company name */}
				<Anchor
					component={PrismicNextLink}
					field={{ link_type: "Web", url: "/" }}
					style={{
						textDecoration: "none",
						display: "flex",
						alignItems: "center",
					}}
				>
					{logo?.url ? (
						<Image
							src={logo.url}
							alt={logo.alt ?? ""}
							w={130}
							fit="contain"
						/>
					) : (
						<Box
							w={rem(48)}
							h={rem(48)}
							style={{
								background: "var(--mantine-color-orange-5)",
								borderRadius: "var(--mantine-radius-sm)",
								flexShrink: 0,
							}}
						/>
					)}
					<Box>
						<Box
							component="span"
							fw={700}
							size="xl"
							c="dark.8"
							style={{
								display: "block",
								lineHeight: 1.1,
								fontSize: rem(22),
								textTransform: "uppercase",
								letterSpacing: "0.02em",
							}}
						>
							{companyNameLine1}
						</Box>
						<Box
							component="span"
							size="sm"
							c="dark.6"
							style={{
								display: "block",
								lineHeight: 1.1,
								fontSize: rem(12),
								textTransform: "uppercase",
								letterSpacing: "0.05em",
							}}
						>
							{companyNameLine2}
						</Box>
					</Box>
				</Anchor>

				{/* Center: nav links (desktop) */}
				<Group gap={rem(70)} visibleFrom="sm" style={{ flex: 1, justifyContent: "center" }}>
					{navLinks.map((item: NavigationDocumentDataNavLinksItem, idx: number) => (
						<Anchor
							key={idx}
							component={PrismicNextLink}
							field={item.link}
							size="sm"
							c="dark.7"
							fw={500}
							style={{ textDecoration: "none" }}
						>
							{typeof item.label === "string" ? item.label : "Link"}
						</Anchor>
					))}
				</Group>

				{/* Right: CTA */}
				<Box visibleFrom="sm">
					<Button
						component={PrismicNextLink}
						field={ctaLink ?? { link_type: "Web", url: "/#contact" }}
						color="orange"
						size="sm"
						radius="md"
						rightSection={<span aria-hidden>→</span>}
					>
						{ctaButtonLabel}
					</Button>
				</Box>

				<Burger
					opened={opened}
					onClick={toggle}
					hiddenFrom="sm"
					size="sm"
					aria-label="Toggle menu"
				/>
			</Group>

			<Drawer opened={opened} onClose={close} title="Menu" position="right" size="sm">
				<Stack gap="md">
					{navLinks.map((item: NavigationDocumentDataNavLinksItem, idx: number) => (
						<Anchor
							key={idx}
							component={PrismicNextLink}
							field={item.link}
							onClick={close}
							size="md"
							style={{ textDecoration: "none" }}
						>
							{typeof item.label === "string" ? item.label : "Link"}
						</Anchor>
					))}
					<Button
						component={PrismicNextLink}
						field={ctaLink ?? { link_type: "Web", url: "/#contact" }}
						color="orange"
						fullWidth
						onClick={close}
					>
						{ctaButtonLabel}
					</Button>
				</Stack>
			</Drawer>
		</>
	);
}
