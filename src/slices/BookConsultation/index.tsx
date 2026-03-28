"use client";

import { type FC, useMemo, useState } from "react";
import { type Content, isFilled } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import {
	Box,
	Button,
	Grid,
	Group,
	Image,
	Select,
	SimpleGrid,
	Stack,
	Text,
	Textarea,
	TextInput,
	rem,
} from "@mantine/core";
import { IconChevronDown, IconMail, IconMessage, IconSend, IconUser } from "@tabler/icons-react";
import classes from "./BookConsultation.module.css";

type BookConsultationProps = SliceComponentProps<Content.BookConsultationSlice>;

const FALLBACK_IMAGE =
	"https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&h=1200&fit=crop";

const DEFAULT_SERVICE_OPTIONS = [
	{ value: "commercial", label: "Commercial Construction" },
	{ value: "residential", label: "Residential Projects" },
	{ value: "renovation", label: "Renovation & Remodeling" },
] as const;

const BookConsultation: FC<BookConsultationProps> = ({ slice }) => {
	const p = slice.primary;

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [service, setService] = useState<string | null>(null);
	const [message, setMessage] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const serviceData = useMemo(() => {
		const rows = p.service_options ?? [];
		const fromCms = rows
			.filter((row) => isFilled.keyText(row.label))
			.map((row, i) => ({ value: `svc-${i}`, label: row.label as string }));
		if (fromCms.length > 0) return fromCms;
		return DEFAULT_SERVICE_OPTIONS.map((o) => ({ value: o.value, label: o.label }));
	}, [p.service_options]);

	const imageUrl = isFilled.image(p.side_image) ? p.side_image.url : FALLBACK_IMAGE;
	const imageAlt = isFilled.image(p.side_image) ? (p.side_image.alt ?? "") : "";

	const namePh =
		typeof p.name_placeholder === "string" && p.name_placeholder.trim()
			? p.name_placeholder
			: "Your Name*";
	const emailPh =
		typeof p.email_placeholder === "string" && p.email_placeholder.trim()
			? p.email_placeholder
			: "Your Email*";
	const servicePh =
		typeof p.service_placeholder === "string" && p.service_placeholder.trim()
			? p.service_placeholder
			: "Select Service Type";
	const messagePh =
		typeof p.message_placeholder === "string" && p.message_placeholder.trim()
			? p.message_placeholder
			: "Type Your Message";
	const submitLabel =
		typeof p.submit_label === "string" && p.submit_label.trim() ? p.submit_label : "Submit Message";

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitted(true);
	};

	return (
		<Box component="section" className={classes.band}>
			<Box className="layout-content" w="100%" py={{ base: 48, sm: 56, md: 72 }} pos="relative">
				<Box className={classes.inner}>
					<Grid gutter={{ base: "xl", md: 48 }} align="center">
						<Grid.Col span={{ base: 12, md: 6 }}>
							<Box className={classes.visualWrap}>
								<Box className={classes.imageFrame}>
									<Image src={imageUrl} alt={imageAlt} fit="cover" h="100%" w="100%" />
									<svg
										className={classes.decoRays}
										viewBox="0 0 100 36"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										aria-hidden
									>
										{[10, 22, 34, 46, 58, 70, 82, 94].map((x, i) => (
											<line
												key={x}
												x1={x}
												y1="34"
												x2={x}
												y2={10 + i * 0.5}
												stroke="currentColor"
												strokeWidth="1.2"
												strokeOpacity={0.25 + i * 0.06}
												strokeLinecap="round"
											/>
										))}
									</svg>
								</Box>
							</Box>
						</Grid.Col>

						<Grid.Col span={{ base: 12, md: 6 }}>
							<Stack gap="lg" className={classes.formStack}>
								{isFilled.richText(p.title) && (
									<PrismicRichText
										field={p.title}
										components={{
											heading2: ({ children }) => (
												<Text
													component="h2"
													fw={700}
													c="white"
													style={{
														fontSize: "clamp(1.5rem, 2vw + 0.85rem, 2.15rem)",
														lineHeight: 1.2,
														margin: 0,
													}}
												>
													{children}
												</Text>
											),
										}}
									/>
								)}

								{submitted ? (
									<Text c="gray.3" size="sm">
										Thanks — we&apos;ll get back to you shortly.
									</Text>
								) : (
									<Box component="form" onSubmit={handleSubmit}>
										<Stack gap="md">
											<SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
												<TextInput
													classNames={{ root: classes.inputRoot }}
													placeholder={namePh}
													value={name}
													onChange={(e) => setName(e.currentTarget.value)}
													required
													aria-label={namePh}
													rightSection={<IconUser size={18} opacity={0.55} />}
													rightSectionPointerEvents="none"
												/>
												<TextInput
													classNames={{ root: classes.inputRoot }}
													type="email"
													placeholder={emailPh}
													value={email}
													onChange={(e) => setEmail(e.currentTarget.value)}
													required
													aria-label={emailPh}
													rightSection={<IconMail size={18} opacity={0.55} />}
													rightSectionPointerEvents="none"
												/>
											</SimpleGrid>

											<Select
												classNames={{ root: classes.selectRoot }}
												placeholder={servicePh}
												data={serviceData}
												value={service}
												onChange={setService}
												clearable
												aria-label={servicePh}
												rightSection={<IconChevronDown size={18} opacity={0.55} />}
												comboboxProps={{
													transitionProps: { transition: "fade", duration: 150 },
												}}
												styles={{
													dropdown: {
														backgroundColor: "#1a1a1f",
														border: "1px solid rgba(255,255,255,0.2)",
													},
													option: { color: "#f0f0f2" },
												}}
											/>

											<Textarea
												classNames={{ root: classes.inputRoot }}
												placeholder={messagePh}
												value={message}
												onChange={(e) => setMessage(e.currentTarget.value)}
												minRows={4}
												autosize
												aria-label={messagePh}
												rightSection={
													<Box pt={6} pr={4}>
														<IconMessage size={18} opacity={0.45} />
													</Box>
												}
												rightSectionPointerEvents="none"
											/>

											<Group justify="flex-start" mt="xs">
												<Button
													type="submit"
													color="orange"
													size="md"
													radius="xl"
													px={rem(26)}
													rightSection={<IconSend size={18} />}
												>
													{submitLabel}
												</Button>
											</Group>
										</Stack>
									</Box>
								)}
							</Stack>
						</Grid.Col>
					</Grid>
				</Box>
			</Box>
		</Box>
	);
};

export default BookConsultation;
