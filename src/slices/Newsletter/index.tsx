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
		<>
			<Box py={50} px={300}>
				<Group justify="space-between" align="center" wrap="wrap" gap="xl">
					<Stack gap={0}>
						<PrismicRichText
							field={heading_line1}
							components={{
								heading1: ({ children }) => <Text fz={46}>{children}</Text>,
							}}
						/>
						<PrismicRichText
							field={heading_line2}
							components={{
								heading2: ({ children }) => <Text fz={32}>{children}</Text>,
							}}
						/>
					</Stack>
					<Group gap="sm">
						<TextInput
							placeholder={email_placeholder ?? "Enter Email"}
							radius="xl"
							w={400}
							styles={{
								input: {
									height: 70,
									padding: 25,
								},
							}}
						/>
						<Button
							color="dark"
							h={70}
							p={25}
							radius="xl"
							rightSection={<IconArrowRight size={18} />}
						>
							{subscribe_button_text ?? "Subscribe Now"}
						</Button>
					</Group>
				</Group>
				<Divider my={30} mx={0} size={2} />
			</Box>
		</>
	);
};

export default Newsletter;
