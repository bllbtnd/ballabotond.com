/**
 * LifeStory.tsx
 *
 * A cinematic "about me" section placed before the professional resume.
 * Left side: a portrait photo with parallax scroll effect.
 * Right side: a continuous narrative text that flows like a story.
 * Uses Motion (Framer Motion) for parallax and viewport-triggered animations.
 * All animations use hardware-accelerated properties only (transform, opacity).
 */
import { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from 'motion/react';

interface LifeStoryProps {
  sectionTitle: string;
  storyText: string[];
  profileImage: string;
  profileAlt: string;
  caption?: string;
  readMoreLabel?: string;
  showLessLabel?: string;
}

const paragraphVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function LifeStory({
  sectionTitle,
  storyText,
  profileImage,
  profileAlt,
  caption,
  readMoreLabel = 'Read more',
  showLessLabel = 'Show less',
}: LifeStoryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Mobile "Read more" state
  const MOBILE_PREVIEW_COUNT = 1;
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1023px)');
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const shouldTruncate = isMobile && !expanded && storyText.length > MOBILE_PREVIEW_COUNT;
  const visibleParagraphs = shouldTruncate ? storyText.slice(0, MOBILE_PREVIEW_COUNT) : storyText;

  // Parallax for the portrait image — scrolls at 0.5x creating depth
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.03]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-40"
      aria-label="Life Story"
    >
      <div className="max-w-[90vw] mx-auto px-6 md:px-12">
        {/* Section header */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-24"
        >
          <h2
            className="pf-serif text-pf-text leading-tight-display tracking-brutal"
            style={{ fontSize: 'clamp(2.5rem, 1.5rem + 5vw, 7rem)' }}
          >
            {sectionTitle}
          </h2>
          <div className="pf-divider mt-8" />
        </motion.div>

        {/* Two-column layout: photo left (sticky), story right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left column — Portrait (sticky) */}
          <div>
            <div className="lg:sticky lg:top-24">
              <motion.div
                ref={imageRef}
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden aspect-square rounded-sm"
              >
                <motion.img
                  src={profileImage}
                  alt={profileAlt}
                  className="w-full h-full object-cover"
                  style={
                    prefersReducedMotion
                      ? {}
                      : {
                          y: imageY,
                          scale: imageScale,
                        }
                  }
                  loading="eager"
                  width={600}
                  height={800}
                />
              </motion.div>

              {/* Caption under image */}
              {caption && (
                <motion.p
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="pf-grotesk text-fluid-xs text-pf-muted mt-4 tracking-wide"
                >
                  {caption}
                </motion.p>
              )}
            </div>
          </div>

          {/* Right column — Story text */}
          <div>
            <motion.div
              variants={prefersReducedMotion ? undefined : containerVariants}
              initial={isMobile ? false : 'hidden'}
              whileInView={isMobile ? undefined : 'visible'}
              viewport={{ once: true, margin: '-50px' }}
              className="space-y-6"
            >
              {visibleParagraphs.map((paragraph, i) => {
                const paragraphClass = 'pf-grotesk text-fluid-base text-pf-text leading-relaxed';
                const paragraphStyle = { textIndent: i === 0 ? '0' : '2em' };

                if (isMobile) {
                  return (
                    <p key={i} className={paragraphClass} style={paragraphStyle}>
                      {paragraph}
                    </p>
                  );
                }

                return (
                  <motion.p
                    key={i}
                    variants={prefersReducedMotion ? undefined : paragraphVariants}
                    className={paragraphClass}
                    style={paragraphStyle}
                  >
                    {paragraph}
                  </motion.p>
                );
              })}
            </motion.div>

            {/* Read more / Show less — mobile only */}
            {isMobile && storyText.length > MOBILE_PREVIEW_COUNT && (
              <button
                onClick={() => setExpanded(prev => !prev)}
                className="mt-6 pf-grotesk text-fluid-sm text-pf-accent uppercase tracking-[0.2em] hover:opacity-70 transition-opacity duration-300 flex items-center gap-2"
                aria-expanded={expanded}
              >
                <span>{expanded ? showLessLabel : readMoreLabel}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
