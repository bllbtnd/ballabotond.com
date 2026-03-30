/**
 * ResumeTimeline.tsx
 *
 * Desktop: Two-column scroll theater.
 *   Left column  (experience + education) and right column (tech stack) each
 *   translate upward at their own speed so that both start scrolling at the
 *   same moment and finish at exactly the same moment — even though their
 *   content heights differ. Both columns map scroll-progress [0→1] to their
 *   own y-range [0→-overflow]; the speed difference is a natural consequence
 *   of having different overflow amounts over the same progress range.
 *
 * Mobile: Normal single-column stacked layout with whileInView animations.
 *
 * All transforms use only hardware-accelerated properties (translateY / opacity).
 * Full prefers-reduced-motion fallback.
 */
import { useRef, useEffect, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from 'motion/react';

// ── Types ──────────────────────────────────────────────────────────────────────
interface TimelineEntry {
  year: string;
  title: string;
  company: string;
  companyUrl?: string;
  description: string[];
  isCurrent?: boolean;
}

interface StackCategory {
  label: string;
  items: string[];
}

interface ResumeTimelineProps {
  sectionTitle: string;
  experienceEntries: TimelineEntry[];
  educationTitle: string;
  educationEntries: TimelineEntry[];
  stackTitle: string;
  categories: StackCategory[];
}

// ── Mobile animation variants ──────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

// ── Shared sub-components ──────────────────────────────────────────────────────

function TimelineItem({ entry }: { entry: TimelineEntry }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-2 md:gap-6">
      <div className="md:text-right">
        <span className="pf-grotesk text-fluid-xs uppercase tracking-[0.15em] text-pf-muted">
          {entry.year}
        </span>
      </div>
      <div className="pb-10 border-l border-pf-border pl-6 relative">
        <div
          className={`absolute left-0 top-1.5 w-2 h-2 rounded-full -translate-x-1/2 ${
            entry.isCurrent ? 'bg-pf-accent' : 'bg-pf-muted'
          }`}
        />
        <h3 className="pf-grotesk text-fluid-base font-medium text-pf-text leading-tight mb-1">
          {entry.title}
        </h3>
        {entry.companyUrl ? (
          <a
            href={entry.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pf-link pf-grotesk text-fluid-sm text-pf-accent inline-block mb-3"
          >
            {entry.company}
          </a>
        ) : (
          <span className="pf-grotesk text-fluid-sm text-pf-accent block mb-3">
            {entry.company}
          </span>
        )}
        <ul className="space-y-1">
          {entry.description.map((desc, i) => (
            <li key={i} className="pf-grotesk text-fluid-sm text-pf-muted leading-relaxed">
              {desc}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CategoryBlock({ label, items }: StackCategory) {
  return (
    <div>
      <p className="pf-grotesk text-fluid-xs uppercase tracking-[0.2em] text-pf-accent mb-3">
        {label}
      </p>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={item} className="flex items-baseline gap-2.5">
            <span
              className="text-pf-border select-none font-mono text-sm leading-none flex-shrink-0"
              aria-hidden="true"
            >
              {i === items.length - 1 ? '┗' : '┣'}
            </span>
            <span className="pf-grotesk text-fluid-sm text-pf-muted hover:text-pf-text transition-colors duration-150 cursor-default">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function ResumeTimeline({
  sectionTitle,
  experienceEntries,
  educationTitle,
  educationEntries,
  stackTitle,
  categories,
}: ResumeTimelineProps) {
  const prefersReducedMotion = useReducedMotion();

  // Theater refs
  const theaterRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);

  // Measured state — default tall enough so nothing is clipped before measurement
  const [theaterHeight, setTheaterHeight] = useState(2400);
  const [leftOverflow, setLeftOverflow] = useState(0);
  const [rightOverflow, setRightOverflow] = useState(0);

  // Single scroll progress source shared by both columns.
  // Both columns map [0→1] to [0→-theirOverflow]:
  //   – shorter column travels less → appears slower
  //   – taller column travels more → appears faster
  //   – both start at 0 and finish at their end simultaneously at progress = 1
  const { scrollYProgress } = useScroll({
    target: theaterRef,
    offset: ['start start', 'end end'],
  });

  const leftY = useTransform(scrollYProgress, [0, 1], [0, -leftOverflow]);
  const rightY = useTransform(scrollYProgress, [0, 1], [0, -rightOverflow]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const measure = () => {
      if (!leftContentRef.current || !rightContentRef.current) return;

      const vh = window.innerHeight;

      // How many pixels of content exceed the sticky viewport height
      const lOv = Math.max(0, leftContentRef.current.scrollHeight - vh);
      const rOv = Math.max(0, rightContentRef.current.scrollHeight - vh);

      setLeftOverflow(lOv);
      setRightOverflow(rOv);

      // Theater outer height = sticky height (vh) + room to scroll + small rest buffer
      setTheaterHeight(vh + Math.max(lOv, rOv) + vh * 0.15);
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [prefersReducedMotion]);

  // ── Section heading (always visible, scrolls normally) ──────────────────────
  const SectionHeading = (
    <div className="max-w-[90vw] mx-auto px-6 md:px-12 pt-24 md:pt-40 pb-16 md:pb-24">
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2
          className="pf-serif text-pf-text leading-tight-display tracking-brutal"
          style={{ fontSize: 'clamp(2.5rem, 1.5rem + 5vw, 7rem)' }}
        >
          {sectionTitle}
        </h2>
        <div className="pf-divider mt-8" />
      </motion.div>
    </div>
  );

  return (
    <section aria-label="Resume">
      {SectionHeading}

      {/* ── Mobile layout (< lg) ─────────────────────────────────────────────── */}
      <div className="block lg:hidden max-w-[90vw] mx-auto px-6 md:px-12 pb-24">
        <motion.div
          variants={prefersReducedMotion ? undefined : containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {experienceEntries.map((entry, i) => (
            <motion.div key={i} variants={prefersReducedMotion ? undefined : itemVariants}>
              <TimelineItem entry={entry} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 mb-16">
          <h3 className="pf-grotesk text-fluid-xs uppercase tracking-[0.3em] text-pf-accent mb-8">
            {educationTitle}
          </h3>
          <motion.div
            variants={prefersReducedMotion ? undefined : containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {educationEntries.map((entry, i) => (
              <motion.div key={i} variants={prefersReducedMotion ? undefined : itemVariants}>
                <TimelineItem entry={entry} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div>
          <h3 className="pf-grotesk text-fluid-xs uppercase tracking-[0.3em] text-pf-accent mb-8">
            {stackTitle}
          </h3>
          <div className="grid grid-cols-2 gap-x-10 gap-y-10">
            {categories.map((cat) => (
              <CategoryBlock key={cat.label} label={cat.label} items={cat.items} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Desktop scroll theater (≥ lg) ───────────────────────────────────── */}
      <div
        ref={theaterRef}
        className="hidden lg:block"
        style={{ height: `${theaterHeight}px` }}
      >
        {/* Sticky viewport — columns are clipped here */}
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="max-w-[90vw] mx-auto px-6 md:px-12 h-full">
            <div className="grid grid-cols-2 h-full">

              {/* Left column — Experience + Education */}
              <div className="overflow-hidden h-full border-r border-pf-border pr-10 xl:pr-16">
                <motion.div
                  ref={leftContentRef}
                  style={prefersReducedMotion ? {} : { y: leftY }}
                  className="pt-12 pb-32"
                >
                  {experienceEntries.map((entry, i) => (
                    <TimelineItem key={i} entry={entry} />
                  ))}
                  <div className="mt-14">
                    <h3 className="pf-grotesk text-fluid-xs uppercase tracking-[0.3em] text-pf-accent mb-8">
                      {educationTitle}
                    </h3>
                    {educationEntries.map((entry, i) => (
                      <TimelineItem key={i} entry={entry} />
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right column — Tech Stack */}
              <div className="overflow-hidden h-full pl-10 xl:pl-16">
                <motion.div
                  ref={rightContentRef}
                  style={prefersReducedMotion ? {} : { y: rightY }}
                  className="pt-12 pb-32"
                >
                  <p className="pf-grotesk text-fluid-xs uppercase tracking-[0.3em] text-pf-accent mb-10">
                    {stackTitle}
                  </p>
                  <div className="grid grid-cols-2 gap-x-10 gap-y-10">
                    {categories.map((cat) => (
                      <CategoryBlock key={cat.label} label={cat.label} items={cat.items} />
                    ))}
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
