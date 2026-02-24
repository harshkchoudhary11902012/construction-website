"use client";

import type { RichTextField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import { Title, type TextProps } from "@mantine/core";
import { rem } from "@mantine/core";
import { CustomH1, CustomH2, CustomH3, CustomH4, CustomH5 } from "./custom-heading";
import { CustomText } from "./custom-text";

type CustomPrismicRichTextProps = {
	field: RichTextField | null | undefined;
	body?: "body1" | "body2";
	variant?: "default" | "hero";
} & TextProps;

const heroHeadingStyles = {
	h1: { fontSize: rem(64), lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 700 },
};

export function CustomPrismicRichText({
	field,
	body = "body2",
	variant = "default",
	fw,
	c,
	mt,
	mb,
	pt,
	pb,
	ml,
	ta,
	...props
}: CustomPrismicRichTextProps) {
	const textProps = { fw, c, mt, mb, pt, pb, ml, ta };
	return (
		<PrismicRichText
			field={field}
			components={{
				heading1: ({ children }) =>
					variant === "hero" ? (
						<Title order={1} {...textProps} style={heroHeadingStyles.h1}>
							{children}
						</Title>
					) : (
						<CustomH1 {...textProps}>{children}</CustomH1>
					),
				heading2: ({ children }) => (
					<CustomH2 {...textProps}>{children}</CustomH2>
				),
				heading3: ({ children }) => (
					<CustomH3 {...textProps}>{children}</CustomH3>
				),
				heading4: ({ children }) => (
					<CustomH4 {...textProps}>{children}</CustomH4>
				),
				heading5: ({ children }) => (
					<CustomH5 {...textProps}>{children}</CustomH5>
				),
				paragraph: ({ children }) => (
					<CustomText
						size={body === "body1" ? "md" : "sm"}
						c={c ?? "dimmed"}
						mt={mt}
						mb={mb}
						pt={pt}
						pb={pb}
						ml={ml}
						ta={ta}
						{...props}
					>
						{children}
					</CustomText>
				),
				hyperlink: ({ node, children }) => (
					<PrismicNextLink field={node.data}>{children}</PrismicNextLink>
				),
			}}
		/>
	);
}
