import { type Metadata } from "next";
import { Box, Stack, Text, Title } from "@mantine/core";

export const metadata: Metadata = {
	title: "About Us",
	description: "Learn more about Building Construction Solutions.",
};

export default function AboutUsPage() {
	return (
		<Box component="main" py={{ base: 40, sm: 48, md: 80 }} px={{ base: 0, sm: "xs" }}>
			<Stack gap="md" maw={720}>
				<Title order={1}>About Us</Title>
				<Text c="dimmed" size="lg">
					This page will be designed in the next step. For now, use the home slice or navigation to
					get back to the site.
				</Text>
			</Stack>
		</Box>
	);
}
