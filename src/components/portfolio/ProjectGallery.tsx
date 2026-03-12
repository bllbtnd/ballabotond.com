/**
 * ProjectGallery.tsx
 *
 * Asymmetric, staggered project grid.
 * Projects rendered as stark, minimalist citations.
 * Uses position: sticky on category headers.
 * Viewport staggering via whileInView + staggerChildren.
 * All animations hardware-accelerated (transform, opacity).
 */
import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from 'motion/react';

// ── Types ──────────────────────────────────────────────
interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  url?: string;
  status: 'active' | 'coming-soon' | 'past';
  year?: string;
  index?: number;
}

interface ProjectGalleryProps {
  sectionTitle: string;
  projects: Project[];
}

// ── Animation Variants ─────────────────────────────────
const galleryContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const projectCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 32,
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

function ProjectCard({
  project,
  index,
  prefersReducedMotion,
}: {
  project: Project;
  index: number;
  prefersReducedMotion: boolean | null;
}) {
  const statusLabel =
    project.status === 'active'
      ? 'Live'
      : project.status === 'coming-soon'
        ? 'Coming Soon'
        : 'Archived';

  const content = (
    <motion.article
      variants={prefersReducedMotion ? undefined : projectCardVariants}
      className="group border border-pf-border/60 hover:border-pf-accent/40 transition-colors duration-300"
    >
      <div className="px-6 py-7 md:px-8 md:py-8">
        <div className="flex items-center justify-between gap-4 mb-5">
          <span className="pf-grotesk text-fluid-xs text-pf-muted tracking-[0.18em] uppercase">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="pf-grotesk text-fluid-xs text-pf-muted tracking-[0.14em] uppercase">
            {statusLabel}
          </span>
        </div>

        <h3
          className="pf-serif text-pf-text leading-tight-display tracking-tight-brutal mb-4 group-hover:text-pf-accent transition-colors duration-300"
          style={{
            fontSize: 'clamp(1.6rem, 1.05rem + 2.7vw, 3.2rem)',
          }}
        >
          {project.title}
        </h3>

        <p className="pf-grotesk text-fluid-sm text-pf-muted leading-relaxed max-w-3xl mb-6">
          {project.description}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-pf-border/60">
          <span className="pf-grotesk text-fluid-xs uppercase tracking-[0.14em] text-pf-muted">
            {project.category}
          </span>

          {project.status === 'active' && project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pf-link pf-grotesk text-fluid-xs uppercase tracking-[0.2em] text-pf-text"
            >
              Open Project
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );

  return content;
}

// ── Main Component ─────────────────────────────────────

export default function ProjectGallery({
  sectionTitle,
  projects,
}: ProjectGalleryProps) {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax for the background typographic element
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.15, 0.15, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-40 overflow-hidden"
      aria-label="Projects"
    >
      {/* Background typographic parallax element */}
      {!prefersReducedMotion && (
        <motion.div
          style={{ y: bgY, opacity: bgOpacity }}
          className="absolute top-1/4 -right-12 pointer-events-none select-none"
          aria-hidden="true"
        >
          <span
            className="pf-serif text-pf-border block"
            style={{
              fontSize: 'clamp(8rem, 4rem + 15vw, 20rem)',
              lineHeight: 0.85,
              writingMode: 'vertical-rl',
              letterSpacing: '-0.04em',
            }}
          >
            Work
          </span>
        </motion.div>
      )}

      <div className="max-w-[90vw] mx-auto px-6 md:px-12 relative z-10">
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

        {/* Project list */}
        <motion.div
          variants={prefersReducedMotion ? undefined : galleryContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="space-y-5 md:space-y-6"
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
