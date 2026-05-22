/**
 * MegaFooter.tsx
 *
 * Tall dark footer. Three clean columns: brand, navigation, connect.
 * Hardware-accelerated entrance via Motion (transform + opacity only).
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

// ── Animation variants ─────────────────────────────────
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

// ── Component ──────────────────────────────────────────
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
      style={{ minHeight: '100dvh', paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Footer"
    >
      <div className="max-w-[90vw] mx-auto px-6 md:px-12 py-12 md:py-20 flex flex-col justify-between gap-8"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>

        {/* Quote */}
        <motion.div
          variants={prefersReducedMotion ? undefined : containerVariants}
          initial={prefersReducedMotion ? 'visible' : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.p
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="pf-serif leading-tight-display"
            style={{ fontSize: 'clamp(1.75rem, 1rem + 3vw, 4.5rem)', color: '#F9F9F7' }}
          >
            {tagline}
          </motion.p>
          <motion.p
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="pf-grotesk text-fluid-xs uppercase tracking-[0.25em] mt-4"
            style={{ color: 'rgba(249,249,247,0.3)' }}
          >
            William A. Foster
          </motion.p>
        </motion.div>

        {/* Three-column grid */}
        <motion.div
          variants={prefersReducedMotion ? undefined : containerVariants}
          initial={prefersReducedMotion ? 'visible' : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8"
        >
          {/* Col 1 — Brand */}
          <motion.div variants={prefersReducedMotion ? undefined : itemVariants} className="space-y-3">
            <h3
              className="pf-serif"
              style={{ fontSize: 'clamp(1.4rem, 1rem + 1.5vw, 2.5rem)', color: '#F9F9F7' }}
            >
              {name}
            </h3>
            <p className="pf-grotesk text-fluid-xs" style={{ color: 'rgba(249,249,247,0.4)' }}>
              Software Engineer
            </p>
            <a
              href={`mailto:${email}`}
              className="block pf-grotesk text-fluid-sm pt-2 pf-link"
              style={{ color: 'rgba(249,249,247,0.6)' }}
            >
              {email}
            </a>
          </motion.div>

          {/* Col 2 — Navigate */}
          <motion.div variants={prefersReducedMotion ? undefined : itemVariants}>
            <h4
              className="pf-grotesk text-fluid-xs uppercase tracking-[0.3em] mb-6"
              style={{ color: 'rgba(249,249,247,0.35)' }}
            >
              Navigate
            </h4>
            <nav className="space-y-4">
              {navigation.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block pf-grotesk text-fluid-sm transition-colors duration-300"
                  style={{ color: 'rgba(249,249,247,0.65)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(249,249,247,1)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(249,249,247,0.65)')}
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>

          {/* Col 3 — Connect */}
          <motion.div variants={prefersReducedMotion ? undefined : itemVariants}>
            <h4
              className="pf-grotesk text-fluid-xs uppercase tracking-[0.3em] mb-6"
              style={{ color: 'rgba(249,249,247,0.35)' }}
            >
              Connect
            </h4>
            <div className="space-y-4">
              {socials.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 pf-grotesk text-fluid-sm transition-colors duration-300 group"
                  style={{ color: 'rgba(249,249,247,0.65)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(249,249,247,1)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(249,249,247,0.65)')}
                >
                  <i
                    className={`${social.icon} w-4 text-center flex-shrink-0`}
                    style={{ color: 'rgba(249,249,247,0.35)' }}
                  />
                  {social.label}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-6 border-t gap-3"
          style={{ borderColor: 'rgba(249,249,247,0.1)' }}>
          <p className="pf-grotesk text-fluid-xs" style={{ color: 'rgba(249,249,247,0.3)' }}>
            {copyright || `© ${currentYear} ${name}. All rights reserved.`}
          </p>
          <p className="pf-grotesk text-fluid-xs" style={{ color: 'rgba(249,249,247,0.25)' }}>
            Budapest · Esztergom · Pécs
          </p>
        </div>

      </div>
    </footer>
  );
}
