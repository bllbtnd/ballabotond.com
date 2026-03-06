/**
 * ResumeTimeline.tsx
 *
 * Transforms work history into a highly legible, text-driven timeline.
 * Uses Motion whileInView with staggerChildren for viewport staggering.
 * All animations use only hardware-accelerated properties (transform, opacity).
 * Full prefers-reduced-motion fallback via useReducedMotion.
 */
import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  type Variants,
} from 'motion/react';

// ── Types ──────────────────────────────────────────────
interface TimelineEntry {
  year: string;
  title: string;
  company: string;
  companyUrl?: string;
  description: string[];
  isCurrent?: boolean;
}

interface ResumeTimelineProps {
  sectionTitle: string;
  experienceEntries: TimelineEntry[];
  educationTitle: string;
  educationEntries: TimelineEntry[];
  skillsTitle: string;
  skills: {
    category: string;
    items: string[];
  }[];
}

// ── Animation Variants ─────────────────────────────────
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// ── Sub-components ─────────────────────────────────────

function TimelineItem({
  entry,
  prefersReducedMotion,
}: {
  entry: TimelineEntry;
  prefersReducedMotion: boolean | null;
}) {
  return (
    <motion.div
      variants={prefersReducedMotion ? undefined : itemVariants}
      className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-8 group"
    >
      {/* Year column */}
      <div className="md:text-right">
        <span className="pf-grotesk text-fluid-xs uppercase tracking-[0.15em] text-pf-muted">
          {entry.year}
        </span>
      </div>

      {/* Content column */}
      <div className="pb-10 border-l border-pf-border pl-6 md:pl-8 relative">
        {/* Timeline dot */}
        <div
          className={`absolute left-0 top-1.5 w-2 h-2 rounded-full -translate-x-1/2 ${
            entry.isCurrent ? 'bg-pf-accent' : 'bg-pf-muted'
          }`}
        />

        <h3 className="pf-grotesk text-fluid-lg font-medium text-pf-text leading-tight mb-1">
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

        <ul className="space-y-1.5">
          {entry.description.map((desc, i) => (
            <li
              key={i}
              className="pf-grotesk text-fluid-sm text-pf-muted leading-relaxed"
            >
              {desc}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function SkillBlock({
  category,
  items,
  prefersReducedMotion,
}: {
  category: string;
  items: string[];
  prefersReducedMotion: boolean | null;
}) {
  return (
    <motion.div
      variants={prefersReducedMotion ? undefined : itemVariants}
    >
      <h4 className="pf-grotesk text-fluid-xs uppercase tracking-[0.2em] text-pf-muted mb-4">
        {category}
      </h4>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {items.map((item) => (
          <span
            key={item}
            className="pf-grotesk text-fluid-sm text-pf-text"
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────

export default function ResumeTimeline({
  sectionTitle,
  experienceEntries,
  educationTitle,
  educationEntries,
  skillsTitle,
  skills,
}: ResumeTimelineProps) {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-40"
      aria-label="Resume"
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

        {/* Two-column asymmetric layout */}
        <div className="grid grid-cols-1 lg:grid-cols-asymmetric gap-16 lg:gap-24">
          {/* Left column — Experience */}
          <div>
            <motion.div
              variants={prefersReducedMotion ? undefined : containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="space-y-0"
            >
              {experienceEntries.map((entry, i) => (
                <TimelineItem
                  key={i}
                  entry={entry}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </motion.div>

            {/* Education sub-section */}
            <div className="mt-16 md:mt-24">
              <motion.h3
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="pf-grotesk text-fluid-xs uppercase tracking-[0.3em] text-pf-accent mb-8"
              >
                {educationTitle}
              </motion.h3>

              <motion.div
                variants={prefersReducedMotion ? undefined : containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="space-y-0"
              >
                {educationEntries.map((entry, i) => (
                  <TimelineItem
                    key={i}
                    entry={entry}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                ))}
              </motion.div>
            </div>
          </div>

          {/* Right column — Skills (sticky) */}
          <div>
            <div className="lg:sticky lg:top-24">
              <motion.h3
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="pf-grotesk text-fluid-xs uppercase tracking-[0.3em] text-pf-accent mb-8"
              >
                {skillsTitle}
              </motion.h3>

              <motion.div
                variants={prefersReducedMotion ? undefined : containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="space-y-8"
              >
                {skills.map((skill, i) => (
                  <SkillBlock
                    key={i}
                    category={skill.category}
                    items={skill.items}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
