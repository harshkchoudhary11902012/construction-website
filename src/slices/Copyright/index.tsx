"use client";

import { type FC } from "react";
import { PrismicNextLink } from "@prismicio/next";
import { Box, Anchor, rem } from "@mantine/core";
import { IconArrowUp } from "@tabler/icons-react";
import type { SliceComponentProps } from "@prismicio/react";
import { CustomPrismicRichText } from "@/components/custom-components/CustomPrismicRichText";
import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import classes from "./Copyright.module.css";

type CopyrightProps = SliceComponentProps<Content.CopyrightSlice>;

const Copyright: FC<CopyrightProps> = ({ slice }) => {
	const {
		copyright_text,
		terms_link,
		terms_label,
		privacy_link,
		privacy_label,
		cookies_link,
		cookies_label,
	} = slice.primary;

	const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

	return (
		<>
			<Box
				component="div"
				className={classes.bar}
				py={{ base: rem(20), sm: rem(22) }}
				style={{
					backgroundColor: "var(--mantine-color-dark-8)",
					color: "var(--mantine-color-gray-3)",
					position: "relative",
				}}
			>
				<Box className="layout-content" w="100%">
					<div className={classes.inner}>
						{copyright_text && (
							<Box className={classes.copy}>
								<CustomPrismicRichText
									field={copyright_text}
									body="body2"
									c="gray.3"
									style={{ margin: 0 }}
								/>
							</Box>
						)}
						<div className={classes.links}>
							{isFilled.link(terms_link) && (
								<Anchor
									component={PrismicNextLink}
									field={terms_link}
									c="gray.3"
									size="sm"
									style={{ textDecoration: "none", whiteSpace: "nowrap" }}
								>
									{terms_label ?? "Terms of service"}
								</Anchor>
							)}
							{isFilled.link(privacy_link) && (
								<Anchor
									component={PrismicNextLink}
									field={privacy_link}
									c="gray.3"
									size="sm"
									style={{ textDecoration: "none", whiteSpace: "nowrap" }}
								>
									{privacy_label ?? "Privacy policy"}
								</Anchor>
							)}
							{isFilled.link(cookies_link) && (
								<Anchor
									component={PrismicNextLink}
									field={cookies_link}
									c="gray.3"
									size="sm"
									style={{ textDecoration: "none", whiteSpace: "nowrap" }}
								>
									{cookies_label ?? "Cookies"}
								</Anchor>
							)}
						</div>
					</div>
				</Box>
			</Box>
			<Box
				component="button"
				onClick={scrollToTop}
				aria-label="Scroll to top"
				style={{
					position: "fixed",
					right: "max(0.75rem, env(safe-area-inset-right))",
					bottom: "max(0.75rem, env(safe-area-inset-bottom))",
					width: rem(44),
					height: rem(44),
					borderRadius: "50%",
					backgroundColor: "var(--mantine-color-orange-5)",
					border: "none",
					cursor: "pointer",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					color: "white",
					zIndex: 100,
				}}
			>
				<IconArrowUp size={20} />
			</Box>
		</>
	);
};

export default Copyright;
