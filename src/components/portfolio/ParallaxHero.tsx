/**
 * ParallaxHero.tsx
 * 
 * The Manifesto — Screen-filling typography with asymmetric parallax.
 * Background typographic elements scroll at 0.5x speed (slow),
 * foreground content scrolls at 1x (normal) creating spatial volume.
 * 
 * Uses Motion (Framer Motion) useScroll + useTransform for
 * hardware-accelerated parallax on transform/opacity only.
 */
import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'motion/react';

interface ParallaxHeroProps {
  name: string;
  tagline: string;
  subtitle: string;
  description?: string;
  description2?: string;
  locations?: string;
  availabilityLabel?: string;
  isAvailable?: boolean;
  profileImage?: string;
  profileAlt?: string;
  profileLink?: string;
  scrollCta?: string;
}

export default function ParallaxHero({
  name,
  tagline,
  subtitle,
  description = 'Software Developer & Entrepreneur.',
  description2 = 'Crafting precision-driven digital experiences.',
  locations = 'Budapest · Esztergom · Pécs',
  availabilityLabel = 'Available',
  isAvailable = true,
  profileImage,
  profileAlt = '',
  profileLink,
  scrollCta = 'Scroll',
}: ParallaxHeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Track scroll progress within the hero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Background text parallax — moves at 0.5x speed (half)
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  // Foreground content parallax — moves at 1x (normal scroll)
  const fgY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  // Fade out as user scrolls away
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  // Subtle scale on background text
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  // If reduced motion, disable all transforms
  const motionProps = prefersReducedMotion
    ? {}
    : {
        style: {
          y: bgY,
          scale: bgScale,
          opacity: heroOpacity,
        },
      };

  const fgMotionProps = prefersReducedMotion
    ? {}
    : {
        style: {
          y: fgY,
          opacity: heroOpacity,
        },
      };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background typographic layer — slow parallax (0.5x speed) */}
      <motion.div
        {...motionProps}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          className="pf-serif text-pf-border whitespace-nowrap"
          style={{
            fontSize: 'clamp(6rem, 2rem + 20vw, 22rem)',
            lineHeight: 0.85,
            letterSpacing: '-0.04em',
            opacity: 0.35,
          }}
        >
          {name}
        </span>
      </motion.div>

      {/* Accent line — decorative */}
      <motion.div
        {...(prefersReducedMotion
          ? {}
          : { style: { y: useTransform(scrollYProgress, [0, 1], ['0%', '15%']), opacity: heroOpacity } })}
        className="absolute top-1/2 left-0 w-full pointer-events-none"
        aria-hidden="true"
      >
        <div className="h-px bg-pf-border w-full" />
      </motion.div>

      {/* Foreground content — 1x scroll speed */}
      <motion.div
        {...fgMotionProps}
        className="relative z-10 w-full max-w-[90vw] px-6 md:px-12"
      >
        {/* Asymmetric grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-asymmetric gap-8 lg:gap-16 items-end">
          {/* Left column — primary statement */}
          <div>
            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="pf-grotesk text-fluid-sm uppercase tracking-[0.3em] text-pf-accent mb-6 md:mb-8"
            >
              {subtitle}
            </motion.p>

            <motion.h1
              initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="pf-serif text-pf-text leading-brutal tracking-brutal"
              style={{
                fontSize: 'clamp(3rem, 1.5rem + 8vw, 10rem)',
              }}
            >
              {tagline.split('\n').map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </motion.h1>
          </div>

          {/* Right column — profile image + metadata */}
          <div className="pb-2">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
              className="space-y-6"
            >
              {/* Profile image — clickable, links to stories */}
              {profileImage && (
                <a
                  href={profileLink || '#'}
                  className="block w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden saturate-[0.85] hover:saturate-100 transition-all duration-700 group/img"
                  aria-label="View my stories"
                >
                  <img
                    src={profileImage}
                    alt={profileAlt}
                    className="w-full h-full object-cover scale-100 group-hover/img:scale-105 transition-transform duration-700"
                    loading="eager"
                    width={208}
                    height={208}
                  />
                </a>
              )}
              <p className="pf-grotesk text-fluid-base text-pf-accent leading-relaxed max-w-md">
                {description}
                <br />
                {description2}
              </p>
              <p className="pf-grotesk text-fluid-xs text-pf-muted tracking-wide">
                {locations}{availabilityLabel ? ` · ${availabilityLabel}` : ''}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-6 md:left-12 flex items-center gap-3"
      >
        <div className="w-px h-12 bg-pf-muted origin-top" />
        <span className="pf-grotesk text-fluid-xs uppercase tracking-[0.2em] text-pf-muted rotate-0">
          {scrollCta}
        </span>
      </motion.div>

    </section>
  );
}
