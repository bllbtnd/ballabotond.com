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
import { useRef, useState, useEffect } from 'react';
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
  busyLabel?: string;
  initialBusy?: boolean;
  busyWindows?: { start: number; end: number }[];
  profileImage?: string;
  profileAlt?: string;
  profileLink?: string;
}

export default function ParallaxHero({
  name,
  tagline,
  subtitle,
  description = 'Software Engineer & Entrepreneur.',
  description2 = 'Crafting precision-driven digital experiences.',
  locations = 'Budapest · Esztergom · Pécs',
  availabilityLabel = 'Available',
  busyLabel = 'Busy',
  initialBusy = false,
  busyWindows = [],
  profileImage,
  profileAlt = '',
  profileLink,
}: ParallaxHeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Calendar + time-aware availability
  // initialBusy comes from build-time calendar fetch
  // busyWindows are upcoming calendar events (next 24h) as epoch ms
  // Client-side also checks night hours & weekends as fallback
  const [isAvailable, setIsAvailable] = useState(!initialBusy);
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const budapest = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Budapest' }));
      const hour = budapest.getHours();
      const day = budapest.getDay(); // 0=Sun, 6=Sat

      // Night (22:00-08:00) and weekends always busy
      const isNightOrWeekend = hour >= 22 || hour < 8 || day === 0 || day === 6;

      // Check if currently inside any calendar busy window
      const nowMs = Date.now();
      const isBusyByCalendar = busyWindows.some(
        w => nowMs >= w.start && nowMs < w.end
      );

      setIsAvailable(!isNightOrWeekend && !isBusyByCalendar);
    };
    check();
    const interval = setInterval(check, 60_000); // re-check every minute
    return () => clearInterval(interval);
  }, [busyWindows]);

  const statusLabel = isAvailable ? availabilityLabel : busyLabel;

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
            opacity: 1,
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
              {/* Profile image — clickable, links to map */}
              {profileImage && (
                <a
                  href={profileLink || '#'}
                  className="block w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden saturate-[0.85] hover:saturate-100 transition-all duration-700 group/img"
                  aria-label="View my map"
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
                {locations}{statusLabel ? ` · ${statusLabel}` : ''}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-8 right-6 md:right-12 h-14 w-[2px] bg-pf-muted overflow-hidden"
        aria-hidden="true"
      >
        <motion.div
          className="absolute top-0 left-0 h-5 w-[2px] bg-pf-accent"
          animate={prefersReducedMotion ? undefined : { y: [0, 40, 0], opacity: [0.45, 1, 0.45] }}
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration: 1.6,
                  ease: [0.4, 0, 0.2, 1],
                  delay: 2.25,
                  repeat: Infinity,
                  repeatDelay: 0.7,
                }
          }
        />
      </motion.div>

    </section>
  );
}
