"use client";

import { type FC } from "react";
import { type Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import { PerfumeBottleParticles } from "@/components/ui/perfume-bottle-particles";
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
			{/* Perfume Bottle Particles Background */}
			<div className="w-full absolute inset-0 h-screen">
				<PerfumeBottleParticles
					id="perfumebottleparticles"
					className="w-full h-full"
					particleColor="#FFFFFF"
				/>
			</div>

			{/* Content */}
			<div className="flex flex-col items-center justify-center gap-4 relative z-20 px-4">
				{/* Title */}
				{isFilled.richText(slice.primary.title) && (
					<div className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white font-custom">
						<PrismicRichText field={slice.primary.title} />
					</div>
				)}

				<div className="w-[40rem] relative">
					{/* Gradients */}
					<div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
					<div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
					<div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
					<div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
				</div>

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
