"use client";

import { type FC } from "react";
import { type Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import { SparklesCore } from "@/components/ui/sparkles";
import { isFilled } from "@prismicio/client";

/**
 * Props for `LandingPage`.
 */
type LandingPageProps = SliceComponentProps<Content.LandingPageSlice>;

/**
 * Component for "LandingPage" Slices.
 */
const LandingPage: FC<LandingPageProps> = ({ slice }) => {
	return (
		<div className="h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden relative">
			{/* Sparkles Background */}
			<div className="w-full absolute inset-0 h-screen">
				<SparklesCore
					id="tsparticleslandingpage"
					background="transparent"
					minSize={0.6}
					maxSize={1.4}
					particleDensity={100}
					className="w-full h-full"
					particleColor="#FFFFFF"
					speed={1}
				/>
			</div>

			{/* Content */}
			<div className="flex flex-col items-center justify-center gap-4 relative z-20 px-4">
				{/* Title */}
				{isFilled.richText(slice.primary.title) && (
					<div className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white">
						<PrismicRichText field={slice.primary.title} />
					</div>
				)}

				{/* Subtitle */}
				{isFilled.richText(slice.primary.subtitle) && (
					<div className="text-neutral-300 cursor-default text-center max-w-2xl">
						<PrismicRichText field={slice.primary.subtitle} />
					</div>
				)}
			</div>
		</div>
	);
};

export default LandingPage;
