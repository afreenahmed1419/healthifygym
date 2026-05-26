'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './GridMotion.css';

const ROWS = 3;
const COLS = 5;

interface GridMotionProps {
  items?: string[];
  gradientColor?: string;
}

export default function GridMotion({
  items = [],
  gradientColor = '#FF6B00',
}: GridMotionProps) {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const total = ROWS * COLS;
  const filled = Array.from({ length: total }, (_, i) =>
    items.length > 0 ? items[i % items.length] : ''
  );

  const rows = [
    filled.slice(0, COLS),
    filled.slice(COLS, COLS * 2),
    filled.slice(COLS * 2, COLS * 3),
  ];

  useEffect(() => {
    const activeRows = rowRefs.current.filter(Boolean) as HTMLDivElement[];
    const tweens: gsap.core.Tween[] = [];

    // Measure SET_W once from the first row — all rows are identical so
    // reusing the same value guarantees every row travels the same distance
    // in the same time, giving perfectly equal scroll speeds.
    const SET_W = activeRows[0]
      ? ((activeRows[0].children[COLS] as HTMLElement)?.offsetLeft ?? 0)
      : 0;

    activeRows.forEach((row, i) => {
      const startX = i % 2 === 0 ? 0 : -SET_W;
      const endX   = i % 2 === 0 ? -SET_W : 0;

      gsap.set(row, { x: startX });
      tweens.push(
        gsap.to(row, { x: endX, duration: 30, ease: 'none', repeat: -1 })
      );
    });

    return () => tweens.forEach(t => t.kill());
  }, []);

  return (
    <div className="gm-container">
      <div className="gm-wrapper">
        {rows.map((row, ri) => (
          <div
            key={ri}
            ref={el => { rowRefs.current[ri] = el; }}
            className="gm-row"
          >
            {/* Three copies — ensures the row covers the full viewport at every animation position */}
            {[...row, ...row, ...row].map((src, ci) => (
              <div key={ci} className="gm-item">
                {src
                  ? <img src={src} alt="" className="gm-img" draggable={false} />
                  : <div className="gm-placeholder" style={{ background: `${gradientColor}15` }} />
                }
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="gm-overlay" />
    </div>
  );
}
