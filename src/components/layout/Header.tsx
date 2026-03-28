"use client";

import { Group, Button, Burger, Drawer, Anchor, Box, Image, Text, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PrismicNextLink } from "@prismicio/next";
import { IconChevronRight } from "@tabler/icons-react";
import type {
	NavigationDocument,
	NavigationDocumentDataNavLinksItem,
} from "../../../prismicio-types";
import classes from "./Header.module.css";

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
			<Box
				component="header"
				pos="sticky"
				top={0}
				bg="var(--mantine-color-body)"
				w="100%"
				style={{
					zIndex: 200,
					borderBottom:
						"1px solid color-mix(in srgb, var(--mantine-color-dark-3) 12%, transparent)",
				}}
			>
				<Box className="layout-content" w="100%">
					<Group
						justify="space-between"
						h={{ base: rem(100), sm: rem(80) }}
						px={0}
						wrap="nowrap"
						w="100%"
						py={{ base: rem(6), sm: rem(4) }}
						gap="md"
					>
						{/* Left: logo and company name */}
						<Anchor
							component={PrismicNextLink}
							field={{ link_type: "Web", url: "/" }}
							style={{
								textDecoration: "none",
								display: "flex",
								alignItems: "center",
								gap: rem(12),
							}}
						>
							{logo?.url ? (
								<Image
									src={logo.url}
									alt={logo.alt ?? ""}
									w={{ base: 120, sm: 138 }}
									maw={{ base: 120, sm: 138 }}
									h={{ base: 56, sm: 56 }}
									fit="contain"
									style={{ flexShrink: 0 }}
								/>
							) : (
								<Box
									w={{ base: rem(56), sm: rem(50) }}
									h={{ base: rem(56), sm: rem(50) }}
									style={{
										background: "var(--mantine-color-orange-5)",
										borderRadius: "var(--mantine-radius-md)",
										flexShrink: 0,
									}}
								/>
							)}
							<Box miw={0} style={{ minWidth: 0 }}>
								<Box
									component="span"
									fw={700}
									c="dark.8"
									style={{
										display: "block",
										lineHeight: 1.12,
										fontSize: "clamp(0.82rem, 2.4vw + 0.35rem, 1.28rem)",
										textTransform: "uppercase",
										letterSpacing: "0.03em",
									}}
								>
									{companyNameLine1}
								</Box>
								<Box
									component="span"
									c="dark.6"
									style={{
										display: "block",
										lineHeight: 1.15,
										marginTop: 2,
										fontSize: "clamp(0.68rem, 1.6vw + 0.35rem, 0.78rem)",
										textTransform: "uppercase",
										letterSpacing: "0.08em",
										fontWeight: 600,
									}}
								>
									{companyNameLine2}
								</Box>
							</Box>
						</Anchor>

						{/* Center: nav links (tablet/desktop) */}
						<Group
							gap={rem(40)}
							visibleFrom="sm"
							style={{ flex: 1, justifyContent: "center" }}
							wrap="wrap"
						>
							{navLinks.map((item: NavigationDocumentDataNavLinksItem, idx: number) => (
								<Anchor
									key={idx}
									component={PrismicNextLink}
									field={item.link}
									size="sm"
									c="dark.7"
									fw={600}
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
								radius="xl"
								rightSection={<span aria-hidden>→</span>}
								px={rem(18)}
							>
								{ctaButtonLabel}
							</Button>
						</Box>

						<Burger
							opened={opened}
							onClick={toggle}
							hiddenFrom="sm"
							size="md"
							aria-label="Toggle menu"
						/>
					</Group>
				</Box>
			</Box>

			<Drawer
				opened={opened}
				onClose={close}
				position="right"
				size="md"
				padding="lg"
				title={
					<Anchor
						component={PrismicNextLink}
						field={{ link_type: "Web", url: "/" }}
						onClick={close}
						className={classes.drawerBrand}
					>
						{logo?.url ? (
							<Image
								src={logo.url}
								alt={logo.alt ?? ""}
								w={96}
								h={48}
								maw={96}
								mah={48}
								fit="contain"
								style={{ flexShrink: 0, objectFit: "contain" }}
							/>
						) : (
							<Box
								w={rem(48)}
								h={rem(48)}
								style={{
									background: "var(--mantine-color-orange-5)",
									borderRadius: "var(--mantine-radius-md)",
									flexShrink: 0,
								}}
							/>
						)}
						<Box className={classes.drawerBrandText}>
							<Text
								component="span"
								fw={700}
								c="dark.8"
								display="block"
								lh={1.12}
								style={{
									fontSize: "clamp(0.78rem, 3.5vw, 1.1rem)",
									textTransform: "uppercase",
									letterSpacing: "0.03em",
								}}
							>
								{companyNameLine1}
							</Text>
							<Text
								component="span"
								c="dark.6"
								display="block"
								mt={2}
								fw={600}
								lh={1.15}
								style={{
									fontSize: "clamp(0.65rem, 2.8vw, 0.82rem)",
									textTransform: "uppercase",
									letterSpacing: "0.08em",
								}}
							>
								{companyNameLine2}
							</Text>
						</Box>
					</Anchor>
				}
				styles={{
					header: {
						borderBottom:
							"1px solid color-mix(in srgb, var(--mantine-color-dark-3) 12%, transparent)",
						marginBottom: 0,
						paddingBottom: rem(16),
					},
					body: {
						paddingTop: rem(16),
						display: "flex",
						flexDirection: "column",
						minHeight: "calc(100dvh - 5rem)",
					},
				}}
			>
				<nav className={classes.drawerNav} aria-label="Main navigation">
					{navLinks.map((item: NavigationDocumentDataNavLinksItem, idx: number) => (
						<Anchor
							key={idx}
							component={PrismicNextLink}
							field={item.link}
							onClick={close}
							className={classes.drawerLink}
						>
							<span>{typeof item.label === "string" ? item.label : "Link"}</span>
							<IconChevronRight
								size={20}
								stroke={2}
								className={classes.drawerChevron}
								aria-hidden
							/>
						</Anchor>
					))}
				</nav>

				<hr className={classes.drawerDivider} />

				<div className={classes.drawerCtaWrap}>
					<Button
						component={PrismicNextLink}
						field={ctaLink ?? { link_type: "Web", url: "/#contact" }}
						color="orange"
						size="md"
						radius="xl"
						fullWidth
						rightSection={<IconChevronRight size={18} stroke={2} />}
						onClick={close}
					>
						{ctaButtonLabel}
					</Button>
				</div>
			</Drawer>
		</>
	);
}
