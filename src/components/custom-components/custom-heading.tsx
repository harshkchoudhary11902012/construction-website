"use client";

import { Title, type TitleProps } from "@mantine/core";
import { rem } from "@mantine/core";

const headingStyles = {
	h1: { fontSize: rem(20), lineHeight: 1.2 },
	h2: { fontSize: rem(18), lineHeight: 1.3 },
	h3: { fontSize: rem(16), lineHeight: 1.3 },
	h4: { fontSize: rem(14), lineHeight: 1.4 },
	h5: { fontSize: rem(10), lineHeight: 1.4 },
	h6: { fontSize: rem(32), lineHeight: 1.2 },
};

export function CustomH1(props: TitleProps) {
	return <Title {...props} order={1} style={headingStyles.h1} />;
}
export function CustomH2(props: TitleProps) {
	return <Title {...props} order={2} style={headingStyles.h2} />;
}
export function CustomH3(props: TitleProps) {
	return <Title {...props} order={3} style={headingStyles.h3} />;
}
export function CustomH4(props: TitleProps) {
	return <Title {...props} order={4} style={headingStyles.h4} />;
}
export function CustomH5(props: TitleProps) {
	return <Title {...props} order={5} style={headingStyles.h5} />;
}
export function CustomH6(props: TitleProps) {
	return <Title {...props} order={6} style={headingStyles.h6} />;
}
