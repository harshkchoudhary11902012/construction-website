import { type Metadata } from "next";
import { asText } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { Box, Title, Text, Anchor, Stack } from "@mantine/core";

function PrismicSetupFallback() {
	return (
		<Box py={80} px="md">
			<Stack align="center" gap="lg" maw={600} mx="auto">
				<Title order={1} ta="center">
					Prismic Setup Required
				</Title>
				<Text c="dimmed" ta="center" size="lg">
					The Prismic repository is not configured or not found. To display content:
				</Text>
				<Stack gap="xs">
					<Text size="sm">
						1. Create a repository at{" "}
						<Anchor href="https://prismic.io/dashboard" target="_blank" rel="noopener">
							prismic.io/dashboard
						</Anchor>
					</Text>
					<Text size="sm">
						2. Update <code>slicemachine.config.json</code> with your repository name
					</Text>
					<Text size="sm">
						3. Create a Page document with UID <strong>home</strong> in Prismic
					</Text>
				</Stack>
			</Stack>
		</Box>
	);
}

export default async function Home() {
	const client = createClient();
	const home = await client.getByUID("page", "home").catch(() => null);

	if (!home) {
		return <PrismicSetupFallback />;
	}

	return <SliceZone slices={home.data.slices} components={components} />;
}

export async function generateMetadata(): Promise<Metadata> {
	const client = createClient();
	const home = await client.getByUID("page", "home").catch(() => null);

	if (!home) {
		return { title: "Construction Website" };
	}

	return {
		title: asText(home.data.title),
		description: home.data.meta_description ?? undefined,
		openGraph: {
			title: home.data.meta_title ?? undefined,
			images: home.data.meta_image?.url
				? [{ url: home.data.meta_image.url }]
				: undefined,
		},
	};
}
