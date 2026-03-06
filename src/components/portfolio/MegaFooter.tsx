/**
 * MegaFooter.tsx
 *
 * Minimum 50vh height. Multi-column, high-contrast grid.
 * Routes all secondary pages, contact info, and socials.
 * Uses Motion viewport staggering for entrance animations.
 * Hardware-accelerated (transform, opacity) only.
 */
import {
  motion,
  useReducedMotion,
  type Variants,
} from 'motion/react';

// ── Types ──────────────────────────────────────────────
interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

interface MegaFooterProps {
  name: string;
  email: string;
  navigation: NavLink[];
  socials: SocialLink[];
  tagline?: string;
  copyright?: string;
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// ── Main Component ─────────────────────────────────────

export default function MegaFooter({
  name,
  email,
  navigation,
  socials,
  tagline = 'Quality is never accidental.',
  copyright,
}: MegaFooterProps) {
  const prefersReducedMotion = useReducedMotion();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative bg-pf-text text-pf-bg overflow-hidden"
      aria-label="Footer"
    >
      <div className="max-w-[90vw] mx-auto px-6 md:px-12 py-16 md:py-24 flex flex-col justify-between">
        {/* Top section — CTA / Tagline */}
        <motion.div
          variants={prefersReducedMotion ? undefined : containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <motion.p
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="pf-serif leading-tight-display tracking-brutal mb-10 md:mb-16"
            style={{
              fontSize: 'clamp(1.75rem, 1rem + 3vw, 4rem)',
              color: '#F9F9F7',
            }}
          >
            {tagline}
            <span className="block mt-3 pf-grotesk text-fluid-xs tracking-[0.2em] uppercase text-pf-bg/30">
              — William A. Foster
            </span>
          </motion.p>

          {/* Contact CTA */}
          <motion.div
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="mb-10 md:mb-16"
          >
            <a
              href={`mailto:${email}`}
              className="pf-grotesk text-fluid-lg text-pf-bg/60 hover:text-pf-bg transition-colors duration-300 pf-link"
            >
              {email}
            </a>
          </motion.div>
        </motion.div>

        {/* Multi-column grid */}
        <motion.div
          variants={prefersReducedMotion ? undefined : containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 md:gap-8"
        >
          {/* Column 1 — Brand */}
          <motion.div
            variants={prefersReducedMotion ? undefined : itemVariants}
          >
            <h3
              className="pf-serif mb-4"
              style={{
                fontSize: 'clamp(1.5rem, 1rem + 2vw, 3rem)',
                color: '#F9F9F7',
              }}
            >
              {name}
            </h3>
            <p className="pf-grotesk text-fluid-xs text-pf-bg/40 leading-relaxed">
              Software Developer &amp; Entrepreneur
            </p>
          </motion.div>

          {/* Column 2 — Navigation */}
          <motion.div
            variants={prefersReducedMotion ? undefined : itemVariants}
          >
            <h4 className="pf-grotesk text-fluid-xs uppercase tracking-[0.3em] text-pf-bg/40 mb-6">
              Navigate
            </h4>
            <nav className="space-y-3">
              {navigation.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block pf-grotesk text-fluid-sm text-pf-bg/70 hover:text-pf-bg transition-colors duration-300"
                  {...(link.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>

          {/* Column 3 — Social */}
          <motion.div
            variants={prefersReducedMotion ? undefined : itemVariants}
          >
            <h4 className="pf-grotesk text-fluid-xs uppercase tracking-[0.3em] text-pf-bg/40 mb-6">
              Connect
            </h4>
            <div className="space-y-3">
              {socials.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 pf-grotesk text-fluid-sm text-pf-bg/70 hover:text-pf-bg transition-colors duration-300 group"
                >
                  <i
                    className={`${social.icon} w-4 text-center text-pf-bg/40 group-hover:text-pf-bg transition-colors duration-300`}
                  />
                  {social.label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Column 4 — Location / Info */}
          <motion.div
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="md:col-span-3 lg:col-span-1"
          >
            <h4 className="pf-grotesk text-fluid-xs uppercase tracking-[0.3em] text-pf-bg/40 mb-6">
              Based in
            </h4>
            <p className="pf-grotesk text-fluid-sm text-pf-bg/70 mb-2">
              Budapest · Esztergom · Pécs
            </p>
            <p className="pf-grotesk text-fluid-xs text-pf-bg/40">
              Available for freelance &amp; collaboration
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-between mt-10 md:mt-16 pt-6 border-t border-pf-bg/10"
        >
          <p className="pf-grotesk text-fluid-xs text-pf-bg/30">
            {copyright || `© ${currentYear} ${name}. All rights reserved.`}
          </p>
          <p className="pf-grotesk text-fluid-xs text-pf-bg/20 mt-2 md:mt-0">
            Crafted with precision and intent.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
