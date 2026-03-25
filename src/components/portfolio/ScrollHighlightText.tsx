/**
 * ScrollHighlightText.tsx
 *
 * Premium scroll-highlight effect: words progressively illuminate
 * as they cross an invisible "reading line" at 80% from the top
 * of the viewport. Words above the line are highlighted, words
 * below are dimmed, with a soft gradient transition.
 *
 * Performance: bypasses React rendering entirely — uses refs to
 * directly update DOM opacity via requestAnimationFrame. Zero
 * re-renders during scroll.
 */
import { useRef, useEffect } from 'react';
import { useReducedMotion } from 'motion/react';

interface ScrollHighlightGroupProps {
  paragraphs: string[];
  className?: string;
  paragraphStyle?: (index: number) => React.CSSProperties | undefined;
  previewCount?: number;
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
  const wordSpansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();

  const allParagraphWords = paragraphs.map((text) => text.split(/\s+/));
  const totalWords = allParagraphWords.reduce((sum, w) => sum + w.length, 0);

  const dimOpacity = 0.15;
  // The reading line position: 80% from top of viewport
  const readingLineRatio = 0.80;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const update = () => {
      const viewportH = window.innerHeight;
      const readingLineY = viewportH * readingLineRatio;
      const spans = wordSpansRef.current;
      // One line-height worth of extra range for within-line word progression
      const lineHeight = spans[0]?.getBoundingClientRect().height || 24;

      for (let i = 0; i < spans.length; i++) {
        const span = spans[i];
        if (!span) continue;

        const rect = span.getBoundingClientRect();
        const wordCenterY = rect.top + rect.height / 2;

        if (wordCenterY < readingLineY - lineHeight) {
          // Line is fully above the reading zone — highlighted
          span.style.opacity = '1';
        } else if (wordCenterY > readingLineY) {
          // Below the reading line — dimmed
          span.style.opacity = String(dimOpacity);
        } else {
          // On the reading line — use horizontal position for word-by-word reveal
          // Words further left on the line get highlighted first
          const container = containerRef.current;
          if (!container) { span.style.opacity = String(dimOpacity); continue; }
          const containerRect = container.getBoundingClientRect();
          const containerWidth = containerRect.width || 1;
          const wordX = (rect.left - containerRect.left) / containerWidth;
          // Map vertical position within the line-height zone to a threshold
          const lineProgress = 1 - (wordCenterY - (readingLineY - lineHeight)) / lineHeight;
          // Word highlights when its horizontal position is less than the line progress
          span.style.opacity = wordX <= lineProgress ? '1' : String(dimOpacity);
        }
      }
    };

    // Use passive scroll listener for best performance
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Also listen for resize (viewport height changes)
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial paint
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [prefersReducedMotion, totalWords]);

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

  let globalIndex = 0;
  const allParagraphElements = allParagraphWords.map((words, pIdx) => {
    const wordElements = words.map((word, wIdx) => {
      const idx = globalIndex;
      globalIndex++;
      return (
        <span
          key={`${pIdx}-${wIdx}`}
          ref={(el) => { wordSpansRef.current[idx] = el; }}
          style={{ opacity: dimOpacity }}
        >
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

  wordSpansRef.current.length = totalWords;

  return (
    <div ref={containerRef}>
      {allParagraphElements}
    </div>
  );
}
