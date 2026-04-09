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

    let isVisible = false;

    // Cached span positions in document coordinates — built once, reused every frame.
    // During scroll we only do arithmetic against these values; zero getBoundingClientRect calls.
    type SpanPos = { docTop: number; height: number; left: number };
    let posCache: SpanPos[] = [];
    let containerLeft = 0;
    let containerWidth = 1;

    const buildCache = () => {
      const spans = wordSpansRef.current;
      const container = containerRef.current;
      if (!container || spans.length === 0) return;

      const scrollY = window.scrollY;
      const cRect = container.getBoundingClientRect();
      containerLeft = cRect.left; // horizontal position doesn't change on vertical scroll
      containerWidth = cRect.width || 1;

      posCache = spans.map((span) => {
        if (!span) return { docTop: 0, height: 24, left: 0 };
        const r = span.getBoundingClientRect();
        return { docTop: r.top + scrollY, height: r.height, left: r.left };
      });
    };

    const update = () => {
      if (!isVisible || posCache.length === 0) return;

      const viewportH = window.innerHeight;
      const readingLineY = viewportH * readingLineRatio;
      const scrollY = window.scrollY;
      const lineHeight = posCache[0]?.height || 24;
      const spans = wordSpansRef.current;

      for (let i = 0; i < posCache.length; i++) {
        const span = spans[i];
        const pos = posCache[i];
        if (!span || !pos) continue;

        // Convert cached document coordinate to current viewport coordinate
        const wordCenterY = pos.docTop + pos.height / 2 - scrollY;

        if (wordCenterY < readingLineY - lineHeight) {
          span.style.opacity = '1';
        } else if (wordCenterY > readingLineY) {
          span.style.opacity = String(dimOpacity);
        } else {
          const wordX = (pos.left - containerLeft) / containerWidth;
          const lineProgress = 1 - (wordCenterY - (readingLineY - lineHeight)) / lineHeight;
          span.style.opacity = wordX <= lineProgress ? '1' : String(dimOpacity);
        }
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    const onResize = () => {
      buildCache();
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    // Gate scroll work on visibility — but never build the cache mid-scroll
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries.some((e) => e.isIntersecting);
        if (isVisible) update();
      },
      { rootMargin: '200px 0px' }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    // Build cache during idle time so it doesn't block an in-progress scroll
    const scheduleCache = () => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => { buildCache(); update(); }, { timeout: 1000 });
      } else {
        setTimeout(() => { buildCache(); update(); }, 100);
      }
    };
    scheduleCache();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
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
