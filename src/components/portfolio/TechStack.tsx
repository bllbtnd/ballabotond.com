/**
 * TechStack.tsx
 *
 * Visualises the developer's tech stack as a file-tree structure.
 * Unicode box-drawing characters (┣, ┗) are styled in pf-border.
 * Matches the Digital Sobriety aesthetic of the portfolio.
 * All animations use only hardware-accelerated properties (transform, opacity).
 */
import { motion, useReducedMotion, type Variants } from 'motion/react';

interface StackCategory {
  label: string;
  items: string[];
}

interface TechStackProps {
  sectionTitle: string;
  categories: StackCategory[];
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

function CategoryBlock({
  label,
  items,
  prefersReducedMotion,
}: {
  label: string;
  items: string[];
  prefersReducedMotion: boolean | null;
}) {
  return (
    <motion.div variants={prefersReducedMotion ? undefined : itemVariants}>
      <p className="pf-grotesk text-fluid-xs uppercase tracking-[0.2em] text-pf-accent mb-3">
        {label}
      </p>
      <div className="space-y-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <div key={item} className="flex items-baseline gap-2.5">
              <span
                className="text-pf-border select-none font-mono text-sm leading-none flex-shrink-0"
                aria-hidden="true"
              >
                {isLast ? '┗' : '┣'}
              </span>
              <span className="pf-grotesk text-fluid-sm text-pf-muted hover:text-pf-text transition-colors duration-150 cursor-default">
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function TechStack({ sectionTitle, categories }: TechStackProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative py-24 md:py-40" aria-label="Tech Stack">
      <div className="max-w-[90vw] mx-auto px-6 md:px-12">
        {/* Section heading */}
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

        {/* Category grid */}
        <motion.div
          variants={prefersReducedMotion ? undefined : containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-14"
        >
          {categories.map((cat) => (
            <CategoryBlock
              key={cat.label}
              label={cat.label}
              items={cat.items}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
