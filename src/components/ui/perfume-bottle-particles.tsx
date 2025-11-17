"use client";

import { useId, useEffect, useState, useRef } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, Engine, Particle } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";

type PerfumeBottleParticlesProps = {
	id?: string;
	className?: string;
	particleColor?: string;
};

// Define perfume bottle shape as target positions
const getBottleShape = (
	width: number,
	height: number,
	position: "left" | "right" | "top" | "bottom",
	isMobile: boolean
) => {
	const centerX = width / 2;
	const centerY = height / 2;
	const bottleWidth = Math.min(width * 0.12, 180);
	const bottleHeight = Math.min(height * 0.55, 350);

	let bottleCenterX: number;
	let bottleCenterY: number;

	if (isMobile) {
		// Mobile: top and bottom positioning
		bottleCenterX = centerX;
		bottleCenterY =
			position === "top"
				? centerY - height * 0.2 // Top bottle
				: centerY + height * 0.2; // Bottom bottle
	} else {
		// Desktop: left and right positioning
		bottleCenterX =
			position === "left"
				? width * 0.2 // Left side of center
				: width * 0.8; // Right side of center
		bottleCenterY = centerY;
	}

	const points: { x: number; y: number }[] = [];

	// Bottle cap (top - circular)
	for (let i = 0; i < 12; i++) {
		const angle = (i / 12) * Math.PI * 2;
		const radius = bottleWidth * 0.3;
		points.push({
			x: bottleCenterX + Math.cos(angle) * radius,
			y: bottleCenterY - bottleHeight / 2 + Math.sin(angle) * radius * 0.5,
		});
	}

	// Bottle neck
	for (let i = 0; i < 8; i++) {
		const progress = i / 8;
		const neckWidth = bottleWidth * (0.3 + progress * 0.2);
		points.push({
			x: bottleCenterX - neckWidth / 2,
			y: bottleCenterY - bottleHeight / 2 + 30 + progress * 40,
		});
		points.push({
			x: bottleCenterX + neckWidth / 2,
			y: bottleCenterY - bottleHeight / 2 + 30 + progress * 40,
		});
	}

	// Bottle body (curved sides)
	for (let i = 0; i < 25; i++) {
		const progress = i / 25;
		const curve = Math.sin(progress * Math.PI) * 0.35;
		const bodyWidth = bottleWidth * (0.5 + curve);
		points.push({
			x: bottleCenterX - bodyWidth / 2,
			y: bottleCenterY - bottleHeight / 2 + 70 + progress * (bottleHeight - 70),
		});
		points.push({
			x: bottleCenterX + bodyWidth / 2,
			y: bottleCenterY - bottleHeight / 2 + 70 + progress * (bottleHeight - 70),
		});
	}

	// Bottle base
	for (let i = 0; i < 8; i++) {
		const progress = i / 8;
		const baseWidth = bottleWidth * (0.85 - progress * 0.2);
		points.push({
			x: bottleCenterX - baseWidth / 2,
			y: bottleCenterY + bottleHeight / 2 - 20 + progress * 20,
		});
		points.push({
			x: bottleCenterX + baseWidth / 2,
			y: bottleCenterY + bottleHeight / 2 - 20 + progress * 20,
		});
	}

	return points;
};

export const PerfumeBottleParticles = (props: PerfumeBottleParticlesProps) => {
	const { id, className, particleColor = "#FFFFFF" } = props;
	const [init, setInit] = useState(false);
	const [isForming, setIsForming] = useState(false);
	const containerRef = useRef<Container | null>(null);
	const firstBottleShapeRef = useRef<{ x: number; y: number }[]>([]);
	const secondBottleShapeRef = useRef<{ x: number; y: number }[]>([]);
	const animationFrameRef = useRef<number | undefined>(undefined);
	const isMobileRef = useRef<boolean>(false);
	const particleDataRef = useRef<
		Map<
			Particle,
			{
				startX: number;
				startY: number;
				targetX: number;
				targetY: number;
				isBackground: boolean;
			}
		>
	>(new Map());
	const controls = useAnimation();
	const generatedId = useId();

	useEffect(() => {
		initParticlesEngine(async (engine: Engine) => {
			await loadSlim(engine);
		}).then(() => {
			setInit(true);
		});
	}, []);

	const particlesLoaded = async (container?: Container) => {
		if (container && container.canvas) {
			containerRef.current = container;
			const width = container.canvas.size?.width || window.innerWidth;
			const height = container.canvas.size?.height || window.innerHeight;
			const isMobile = width <= 768;
			isMobileRef.current = isMobile;

			// Update bottle positions based on screen size
			if (isMobile) {
				// Mobile: top and bottom
				firstBottleShapeRef.current = getBottleShape(width, height, "top", isMobile);
				secondBottleShapeRef.current = getBottleShape(width, height, "bottom", isMobile);
			} else {
				// Desktop: left and right
				firstBottleShapeRef.current = getBottleShape(width, height, "left", isMobile);
				secondBottleShapeRef.current = getBottleShape(width, height, "right", isMobile);
			}

			controls.start({
				opacity: 1,
				transition: { duration: 0.5 },
			});

			// Wait a moment, then start forming the bottles (only on desktop)
			if (!isMobile) {
				setTimeout(() => {
					startFormingBottles(container);
				}, 1000);
			}
		}
	};

	const startFormingBottles = (container: Container) => {
		if (
			!container.particles ||
			firstBottleShapeRef.current.length === 0 ||
			secondBottleShapeRef.current.length === 0
		)
			return;

		const firstBottle = firstBottleShapeRef.current;
		const secondBottle = secondBottleShapeRef.current;
		const particles: Particle[] = [];

		// Collect all particles
		for (let i = 0; i < container.particles.count; i++) {
			const particle = container.particles.get(i);
			if (particle) {
				particles.push(particle);
			}
		}

		// Check if mobile - if so, all particles stay in background
		const isMobile = isMobileRef.current;

		// Distribute particles: 25% first bottle, 25% second bottle, 50% background (desktop only)
		// On mobile, 100% background
		const firstBottleCount = isMobile ? 0 : Math.floor(particles.length * 0.25);
		const secondBottleCount = isMobile ? 0 : Math.floor(particles.length * 0.25);
		// Rest stay in background

		particles.forEach((particle, index) => {
			let targetX: number;
			let targetY: number;
			let isBackground = false;

			if (!isMobile && index < firstBottleCount) {
				// Assign to first bottle (desktop only)
				const targetIndex = index % firstBottle.length;
				const target = firstBottle[targetIndex];
				targetX = target.x;
				targetY = target.y;
			} else if (!isMobile && index < firstBottleCount + secondBottleCount) {
				// Assign to second bottle (desktop only)
				const secondIndex = (index - firstBottleCount) % secondBottle.length;
				const target = secondBottle[secondIndex];
				targetX = target.x;
				targetY = target.y;
			} else {
				// Keep in background - use current position as target (they'll keep moving)
				targetX = particle.position.x;
				targetY = particle.position.y;
				isBackground = true;
			}

			// Store initial and target positions
			particleDataRef.current.set(particle, {
				startX: particle.position.x,
				startY: particle.position.y,
				targetX: targetX,
				targetY: targetY,
				isBackground: isBackground,
			});
		});

		setIsForming(true);
		const startTime = Date.now();
		const duration = 3000; // 3 seconds to form

		const animate = () => {
			if (!container.particles) {
				animationFrameRef.current = requestAnimationFrame(animate);
				return;
			}

			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);
			// Ease out cubic for smooth animation
			const easeProgress = 1 - Math.pow(1 - progress, 3);

			// Animate each particle to its target position
			particleDataRef.current.forEach((data, particle) => {
				if (data.isBackground) {
					// Background particles keep moving randomly (handled by tsparticles)
					return;
				}

				const newX = data.startX + (data.targetX - data.startX) * easeProgress;
				const newY = data.startY + (data.targetY - data.startY) * easeProgress;

				particle.position.x = newX;
				particle.position.y = newY;
			});

			// Continue animation until complete, then lock particles in place
			if (progress < 1) {
				animationFrameRef.current = requestAnimationFrame(animate);
			} else {
				// After formation, lock bottle particles to their target positions (stable)
				const lockParticles = () => {
					if (!container.particles || isMobileRef.current) return; // Stop if mobile

					particleDataRef.current.forEach((data, particle) => {
						if (data.isBackground) {
							// Background particles handled by tsparticles
							return;
						}

						// Lock bottle particles to their exact target positions (no movement)
						particle.position.x = data.targetX;
						particle.position.y = data.targetY;
					});

					animationFrameRef.current = requestAnimationFrame(lockParticles);
				};

				lockParticles();
			}
		};

		animate();
	};

	// Handle window resize to reposition bottles
	useEffect(() => {
		let resizeTimeout: NodeJS.Timeout;

		const handleResize = () => {
			// Debounce resize events
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				if (!containerRef.current || !containerRef.current.canvas) return;

				const width = containerRef.current.canvas.size?.width || window.innerWidth;
				const height = containerRef.current.canvas.size?.height || window.innerHeight;
				const isMobile = width <= 768;

				// Update bottle positions based on screen size
				isMobileRef.current = isMobile;

				// Update bottle positions based on screen size
				if (isMobile) {
					// Mobile: top and bottom
					firstBottleShapeRef.current = getBottleShape(width, height, "top", isMobile);
					secondBottleShapeRef.current = getBottleShape(width, height, "bottom", isMobile);
				} else {
					// Desktop: left and right
					firstBottleShapeRef.current = getBottleShape(width, height, "left", isMobile);
					secondBottleShapeRef.current = getBottleShape(width, height, "right", isMobile);
				}

				// Recalculate and reposition particles if bottles are already formed (desktop only)
				if (containerRef.current.particles && isForming && !isMobile) {
					// Cancel any ongoing animation
					if (animationFrameRef.current) {
						cancelAnimationFrame(animationFrameRef.current);
					}
					startFormingBottles(containerRef.current);
				} else if (isMobile && containerRef.current.particles) {
					// On mobile, stop any bottle formation and release all particles to background
					if (animationFrameRef.current) {
						cancelAnimationFrame(animationFrameRef.current);
					}
					// Release all particles to background
					particleDataRef.current.forEach((data) => {
						data.isBackground = true;
					});
					setIsForming(false);
				}
			}, 250); // 250ms debounce
		};

		window.addEventListener("resize", handleResize);
		return () => {
			clearTimeout(resizeTimeout);
			window.removeEventListener("resize", handleResize);
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [isForming]);

	return (
		<motion.div animate={controls} className={cn("opacity-0", className)}>
			{init && (
				<Particles
					id={id || generatedId}
					className={cn("h-full w-full")}
					particlesLoaded={particlesLoaded}
					options={{
						background: {
							color: {
								value: "transparent",
							},
						},
						fpsLimit: 120,
						interactivity: {
							events: {
								onClick: {
									enable: false,
								},
								onHover: {
									enable: false,
								},
								resize: {
									enable: true,
								},
							},
							detectsOn: "window",
						},
						particles: {
							color: {
								value: particleColor,
							},
							links: {
								enable: isForming,
								distance: 80,
								color: particleColor,
								opacity: 0.3,
								width: 1,
							},
							collisions: {
								enable: false,
							},
							move: {
								enable: true, // Always enable for background particles
								direction: "none",
								random: true,
								speed: {
									min: 0.5,
									max: 2,
								},
								straight: false,
								outModes: {
									default: "bounce",
								},
							},
							number: {
								density: {
									enable: true,
									width: 1920,
									height: 1080,
								},
								value: 800, // Increased total particles for more background dots
							},
							opacity: {
								value: {
									min: 0.7,
									max: 1,
								},
								animation: {
									enable: true,
									speed: 1,
									sync: false,
								},
							},
							shape: {
								type: "circle",
							},
							size: {
								value: {
									min: 0.4,
									max: 1,
								},
								animation: {
									enable: true,
									speed: 2,
									sync: false,
								},
							},
						},
						detectRetina: true,
					}}
				/>
			)}
		</motion.div>
	);
};
