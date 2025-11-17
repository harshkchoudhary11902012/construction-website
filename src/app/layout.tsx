import { PrismicPreview } from "@prismicio/next";
import { repositoryName } from "@/prismicio";
import "@/app/globals.css";
import localFont from "next/font/local";

// Load your custom font
const customFont = localFont({
	src: "../../public/fonts/Dream-Avenue.ttf",
	variable: "--font-custom",
	display: "swap",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={customFont.variable}>
			<body>{children}</body>
			<PrismicPreview repositoryName={repositoryName} />
		</html>
	);
}
