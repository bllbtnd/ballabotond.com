import { useRef, useEffect } from 'react';
import { useReducedMotion } from 'motion/react';

interface ScrollHighlightGroupProps {
  paragraphs: string[];
  className?: string;
  paragraphStyle?: (index: number) => React.CSSProperties | undefined;
  previewCount?: number;
  expanded?: boolean;
}

const DIM = 0.15;
const READING_LINE = 0.60; // 60% from top of viewport
const FADE_PX = 80;        // px of soft transition zone around the reading line

export default function ScrollHighlightGroup({
  paragraphs,
  className = '',
  paragraphStyle,
  previewCount,
  expanded = true,
}: ScrollHighlightGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = containerRef.current;
    if (!el) return;

    // Apply the gradient mask once. Only --hl-pct changes on scroll —
    // one CSS custom property write per frame instead of N opacity writes.
    const mask = `linear-gradient(to bottom,
      black 0%,
      black calc(var(--hl-pct, 0%) - ${FADE_PX}px),
      rgba(0,0,0,${DIM}) calc(var(--hl-pct, 0%) + ${FADE_PX}px),
      rgba(0,0,0,${DIM}) 100%)`;
    el.style.webkitMaskImage = mask;
    el.style.maskImage = mask;

    // Cache container position in document coordinates — rebuilt on resize, not scroll.
    let docTop = 0;
    let elHeight = 1;

    const buildCache = () => {
      const r = el.getBoundingClientRect();
      docTop = r.top + window.scrollY;
      elHeight = r.height || 1;
    };

    const update = () => {
      const readingY = window.innerHeight * READING_LINE;
      const relY = readingY - (docTop - window.scrollY);
      const pct = (Math.max(0, Math.min(elHeight, relY)) / elHeight * 100).toFixed(2);
      el.style.setProperty('--hl-pct', `${pct}%`);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    // ResizeObserver handles both window resize and expand/collapse height changes.
    const ro = new ResizeObserver(() => {
      buildCache();
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    });
    ro.observe(el);

    window.addEventListener('scroll', onScroll, { passive: true });

    // Immediate cache + update, then refine after layout animations settle.
    buildCache();
    update();
    const refineTimer = setTimeout(() => { buildCache(); update(); }, 400);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(refineTimer);
      ro.disconnect();
      el.style.webkitMaskImage = '';
      el.style.maskImage = '';
    };
  }, [prefersReducedMotion]);

  const visibleCount = (expanded || previewCount === undefined) ? paragraphs.length : previewCount;

  if (prefersReducedMotion) {
    return (
      <div ref={containerRef}>
        {paragraphs.slice(0, visibleCount).map((text, i) => (
          <p key={i} className={className} style={{ marginTop: i > 0 ? 24 : 0, ...paragraphStyle?.(i) }}>
            {text}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      {paragraphs.map((text, i) => {
        const visible = i < visibleCount;
        return (
          <div
            key={i}
            style={{
              overflow: 'hidden',
              height: visible ? 'auto' : 0,
              opacity: visible ? 1 : 0,
              marginTop: visible && i > 0 ? 24 : 0,
              transition: 'height 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), margin-top 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <p className={className} style={paragraphStyle?.(i)}>{text}</p>
          </div>
        );
      })}
    </div>
  );
}
