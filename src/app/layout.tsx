import { PrismicPreview } from "@prismicio/next";
import { repositoryName } from "@/prismicio";
import { createClient } from "@/prismicio";
import "@mantine/core/styles.css";
import "@/app/globals.css";
import localFont from "next/font/local";
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const customFont = localFont({
	src: "../../public/fonts/Dream-Avenue.ttf",
	variable: "--font-custom",
	display: "swap",
});

const theme = createTheme({
	primaryColor: "orange",
	defaultRadius: "md",
});

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const client = createClient();
	const navigation = await client.getSingle("navigation").catch(() => null);

	return (
		<html lang="en" className={customFont.variable} suppressHydrationWarning>
			<body>
				<ColorSchemeScript defaultColorScheme="light" />
				<MantineProvider theme={theme}>
					<Header navigation={navigation} />
					<main>{children}</main>
					<Footer />
				</MantineProvider>
				<PrismicPreview repositoryName={repositoryName} />
			</body>
		</html>
	);
}
