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
  // The previous implementation applied a mask gradient that faded
  // text around a reading line. To remove the fade effect, we no
  // longer modify mask images or perform per-frame updates.

  const visibleCount = (expanded || previewCount === undefined) ? paragraphs.length : previewCount;

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
