"use client";

import { type FC } from "react";
import { Box, Button, Divider, Group, Stack, Text, TextInput } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import type { Content } from "@prismicio/client";

type NewsletterProps = SliceComponentProps<Content.NewsletterSlice>;

const Newsletter: FC<NewsletterProps> = ({ slice }) => {
	const { heading_line1, heading_line2, email_placeholder, subscribe_button_text } =
		slice.primary;

	return (
		<Box
			component="section"
			py={{ base: 36, sm: 44, md: 50 }}
			px={{ base: 0, sm: "xs", md: 0 }}
			maw={1200}
			mx="auto"
			w="100%"
		>
			<Stack gap="xl" align="stretch">
				<Stack gap={4}>
					<PrismicRichText
						field={heading_line1}
						components={{
							heading1: ({ children }) => (
								<Text
									fw={700}
									c="dark.8"
									style={{
										fontSize: "clamp(1.5rem, 5vw + 0.5rem, 2.875rem)",
										lineHeight: 1.15,
									}}
								>
									{children}
								</Text>
							),
						}}
					/>
					<PrismicRichText
						field={heading_line2}
						components={{
							heading2: ({ children }) => (
								<Text
									fw={600}
									c="dark.7"
									style={{
										fontSize: "clamp(1.1rem, 3vw + 0.35rem, 2rem)",
										lineHeight: 1.2,
									}}
								>
									{children}
								</Text>
							),
						}}
					/>
				</Stack>

				<Group align="stretch" justify="flex-start" gap="md" wrap="wrap">
					<TextInput
						placeholder={email_placeholder ?? "Enter Email"}
						radius="xl"
						flex={1}
						miw={0}
						maw={{ base: "100%", md: 420 }}
						w={{ base: "100%", md: "auto" }}
						styles={{
							input: {
								height: "clamp(52px, 12vw, 70px)",
								paddingInline: "clamp(1rem, 3vw, 1.5rem)",
								fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
							},
						}}
					/>
					<Button
						color="dark"
						h="auto"
						mih="clamp(52px, 12vw, 70px)"
						px="clamp(1rem, 3vw, 1.5rem)"
						radius="xl"
						rightSection={<IconArrowRight size={18} />}
						w={{ base: "100%", sm: "auto" }}
						maw={{ base: "100%", sm: 280 }}
						style={{ alignSelf: "stretch" }}
					>
						{subscribe_button_text ?? "Subscribe Now"}
					</Button>
				</Group>
			</Stack>
			<Divider my={{ base: 24, md: 30 }} mx={0} size={2} />
		</Box>
	);
};

export default Newsletter;
