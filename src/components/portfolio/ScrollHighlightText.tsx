/**
 * ScrollHighlightText.tsx
 *
 * Wraps multiple paragraphs and progressively highlights words
 * based on scroll progress. Words stay highlighted once scrolled past.
 * All paragraphs share one global progress.
 *
 * Uses a single scroll listener + CSS transitions for performance,
 * avoiding per-word motion values that cause jank on mobile.
 */
import { useRef, useState, useCallback } from 'react';
import {
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from 'motion/react';

interface ScrollHighlightGroupProps {
  paragraphs: string[];
  className?: string;
  paragraphStyle?: (index: number) => React.CSSProperties | undefined;
  /** Number of paragraphs to show when collapsed (mobile). Undefined = show all. */
  previewCount?: number;
  /** Whether the full text is expanded */
  expanded?: boolean;
}

export default function ScrollHighlightGroup({
  paragraphs,
  className = '',
  paragraphStyle,
  previewCount,
  expanded = true,
}: ScrollHighlightGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'end 0.1'],
  });

  // Single scroll listener — update progress state at ~60fps via rAF
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setProgress(v);
  });

  // Pre-split all words with global indices
  const allParagraphWords = paragraphs.map((text) => text.split(/\s+/));
  const totalWords = allParagraphWords.reduce((sum, w) => sum + w.length, 0);

  const showAll = expanded || previewCount === undefined;
  const visibleCount = showAll ? paragraphs.length : previewCount;

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

  // Build paragraphs with word-level opacity based on current progress
  let globalIndex = 0;
  const allParagraphElements = allParagraphWords.map((words, pIdx) => {
    const wordElements = words.map((word, wIdx) => {
      const wordStart = globalIndex / totalWords;
      const wordEnd = (globalIndex + 1) / totalWords;

      // Compute opacity: interpolate between 0.15 and 1
      let opacity: number;
      if (progress >= wordEnd) {
        opacity = 1;
      } else if (progress <= wordStart) {
        opacity = 0.15;
      } else {
        const t = (progress - wordStart) / (wordEnd - wordStart);
        opacity = 0.15 + t * 0.85;
      }

      globalIndex++;
      return (
        <span key={`${pIdx}-${wIdx}`} style={{ opacity }}>
          {word}{' '}
        </span>
      );
    });

    const isVisible = pIdx < visibleCount;

    return (
      <div
        key={pIdx}
        style={{
          overflow: 'hidden',
          height: isVisible ? 'auto' : 0,
          opacity: isVisible ? 1 : 0,
          marginTop: isVisible && pIdx > 0 ? 24 : 0,
          transition: 'height 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), margin-top 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <p className={className} style={paragraphStyle?.(pIdx)}>
          {wordElements}
        </p>
      </div>
    );
  });

  return (
    <div ref={containerRef}>
      {allParagraphElements}
    </div>
  );
}
