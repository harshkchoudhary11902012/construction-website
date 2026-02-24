"use client";

import {
	Text,
	type TextProps,
	createPolymorphicComponent,
} from "@mantine/core";
import { forwardRef } from "react";

const CustomText = createPolymorphicComponent<"p", TextProps>(
	forwardRef<HTMLParagraphElement, TextProps>((props, ref) => (
		<Text
			{...props}
			ref={ref}
			size={props.size ?? "sm"}
			c={props.c ?? "dimmed"}
			style={{ lineHeight: 1.6, ...props.style }}
		/>
	))
);

export { CustomText };
