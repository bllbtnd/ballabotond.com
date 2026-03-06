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
  const isEven = index % 2 === 0;

  // Stagger: odd items get top padding on desktop for visual offset
  const staggerClass = index % 2 === 1 ? 'md:pt-16' : '';

  const content = (
    <motion.article
      variants={prefersReducedMotion ? undefined : projectCardVariants}
      className={`group ${staggerClass}`}
    >
      <div className="py-8 md:py-10">
        {/* Project number + category */}
        <div className="flex items-baseline justify-between mb-4">
          <span className="pf-grotesk text-fluid-xs text-pf-muted tracking-[0.15em] uppercase">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="pf-grotesk text-fluid-xs text-pf-muted tracking-[0.1em] uppercase">
            {project.category}
          </span>
        </div>

        {/* Title — large, striking */}
        <h3
          className="pf-serif text-pf-text leading-tight-display tracking-tight-brutal mb-4 group-hover:text-pf-accent transition-colors duration-300"
          style={{
            fontSize: 'clamp(1.75rem, 1rem + 3vw, 4rem)',
          }}
        >
          {project.title}
        </h3>

        {/* Description — minimal citation style */}
        <p className="pf-grotesk text-fluid-sm text-pf-muted leading-relaxed max-w-lg mb-4">
          {project.description}
        </p>

        {/* Status + link */}
        <div className="flex items-center gap-4">
          {project.status === 'active' && project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pf-link pf-grotesk text-fluid-xs uppercase tracking-[0.2em] text-pf-text"
            >
              View Project
            </a>
          )}
          {project.status === 'coming-soon' && (
            <span className="pf-grotesk text-fluid-xs uppercase tracking-[0.2em] text-pf-muted">
              Coming Soon
            </span>
          )}
          {project.status === 'past' && (
            <span className="pf-grotesk text-fluid-xs uppercase tracking-[0.2em] text-pf-muted italic">
              Archived
            </span>
          )}
        </div>

        {/* Divider line */}
        <div className="pf-divider mt-8" />
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
        {/* Section header with sticky behavior */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-24"
        >
          <div className="sticky top-0 pt-6 pb-4 bg-pf-bg z-20">
            <h2
              className="pf-serif text-pf-text leading-tight-display tracking-brutal"
              style={{ fontSize: 'clamp(2.5rem, 1.5rem + 5vw, 7rem)' }}
            >
              {sectionTitle}
            </h2>
            <div className="pf-divider mt-8" />
          </div>
        </motion.div>

        {/* Asymmetric project grid — 2-column with proper spacing */}
        <motion.div
          variants={prefersReducedMotion ? undefined : galleryContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-4"
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
