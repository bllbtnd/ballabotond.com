/**
 * PortfolioNav.tsx
 *
 * Minimal fixed navigation for the single-page portfolio.
 * Brutalist grotesk typography. No decorative UI.
 * Fades in on mount, uses hardware-accelerated transitions.
 */
import { useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
  AnimatePresence,
} from 'motion/react';

interface LangOption {
  code: string;
  label: string;
  href: string;
  active: boolean;
}

interface PortfolioNavProps {
  homeHref: string;
  sections: { id: string; label: string }[];
  languages?: LangOption[];
}

export default function PortfolioNav({ homeHref, sections, languages = [] }: PortfolioNavProps) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 80);
  });

  // Close mobile menu on escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      setMobileOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        initial={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-3 left-0 right-0 z-50 px-4 md:px-6"
        role="navigation"
        aria-label="Main navigation"
      >
        <div
          className={`relative max-w-[90vw] mx-auto rounded-full transition-all duration-500`}
          style={{
            background: isScrolled
              ? 'rgba(240, 235, 227, 0.14)'
              : 'rgba(240, 235, 227, 0.06)',
            backdropFilter: `blur(${isScrolled ? '48px' : '36px'}) saturate(${isScrolled ? '1.8' : '1.5'})`,
            WebkitBackdropFilter: `blur(${isScrolled ? '48px' : '36px'}) saturate(${isScrolled ? '1.8' : '1.5'})`,
            border: '0.5px solid rgba(255, 255, 255, 0.08)',
            boxShadow: isScrolled
              ? '0 8px 32px rgba(26,26,26,0.04), inset 0 0.5px 0 rgba(255,255,255,0.1)'
              : '0 4px 20px rgba(26,26,26,0.02), inset 0 0.5px 0 rgba(255,255,255,0.06)',
          }}
        >
          {/* Specular highlight — top edge gleam */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[1px] rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent 15%, rgba(255,255,255,0.1) 50%, transparent 85%)' }}
          />
          {/* Refraction tint — subtle depth gradient */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, transparent 100%)' }}
          />
          <div className="relative px-6 md:px-10 py-3.5 md:py-4.5 flex items-center justify-between">
            {/* Logo / Name */}
            <a
              href={homeHref}
              className="pf-grotesk text-fluid-sm font-medium text-pf-text tracking-tight-brutal"
            >
              Balla Botond
            </a>

            {/* Desktop nav links + lang switcher */}
            <div className="hidden md:flex items-center gap-8">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="pf-grotesk text-fluid-xs uppercase tracking-[0.2em] text-pf-muted hover:text-pf-text transition-colors duration-300 bg-transparent border-none cursor-pointer"
                >
                  {section.label}
                </button>
              ))}

              {/* Language switcher */}
              {languages.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setLangOpen(!langOpen)}
                    className="pf-grotesk text-fluid-xs uppercase tracking-[0.2em] text-pf-muted hover:text-pf-text transition-colors duration-300 bg-transparent border-none cursor-pointer flex items-center gap-1.5"
                    aria-label="Change language"
                    aria-expanded={langOpen}
                  >
                    {languages.find(l => l.active)?.code || 'EN'}
                    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}>
                      <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <AnimatePresence>
                    {langOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 rounded-2xl py-1 min-w-[120px] z-50"
                        style={{
                          background: 'rgba(240, 235, 227, 0.14)',
                          backdropFilter: 'blur(48px) saturate(1.8)',
                          WebkitBackdropFilter: 'blur(48px) saturate(1.8)',
                          border: '0.5px solid rgba(255,255,255,0.08)',
                          boxShadow: '0 8px 32px rgba(26,26,26,0.04), inset 0 0.5px 0 rgba(255,255,255,0.08)',
                        }}
                      >
                        {languages.map((lang) => (
                          <a
                            key={lang.code}
                            href={lang.href}
                            className={`block px-4 py-2 pf-grotesk text-fluid-xs tracking-[0.1em] transition-colors duration-200 ${
                              lang.active
                                ? 'text-pf-text font-medium'
                                : 'text-pf-muted hover:text-pf-text'
                            }`}
                          >
                            {lang.label}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-2"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                className="block w-5 h-px bg-pf-text origin-center"
                transition={{ duration: 0.2 }}
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block w-5 h-px bg-pf-text"
                transition={{ duration: 0.15 }}
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                className="block w-5 h-px bg-pf-text origin-center"
                transition={{ duration: 0.2 }}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-pf-bg flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {sections.map((section, i) => (
              <motion.button
                key={section.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={() => scrollToSection(section.id)}
                className="pf-serif text-pf-text text-3xl tracking-tight-brutal bg-transparent border-none cursor-pointer"
              >
                {section.label}
              </motion.button>
            ))}

            {/* Language switcher in mobile menu */}
            {languages.length > 0 && (
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: sections.length * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-center gap-4 mt-4 pt-6 border-t border-pf-border"
              >
                {languages.map((lang) => (
                  <a
                    key={lang.code}
                    href={lang.href}
                    className={`pf-grotesk text-fluid-sm tracking-[0.1em] transition-colors duration-200 ${
                      lang.active
                        ? 'text-pf-text font-medium'
                        : 'text-pf-muted hover:text-pf-text'
                    }`}
                  >
                    {lang.code}
                  </a>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
