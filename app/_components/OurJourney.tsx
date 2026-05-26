"use client";

import { useEffect, useRef } from "react";

const STOPS = [
  { side: "left",  num: "01", title: "A Safe Space Is Born",      text: "Healthify was founded with one purpose — to give women a comfortable, judgment-free environment to train confidently and focus on their goals." },
  { side: "right", num: "02", title: "Women Training Women",       text: "We brought in female trainers who understand your body, your challenges, and your goals — making every session comfortable and effective." },
  { side: "left",  num: "03", title: "Every Woman, Every Goal",    text: "From fat loss and toning to strength gain and weight gain — we built personalized programs for women at every stage of life." },
  { side: "right", num: "04", title: "Beyond the Basics",          text: "We go deeper — offering specialized support for postpartum recovery, PCOS/PCOD management, and thyroid-related fitness concerns." },
  { side: "left",  num: "05", title: "Built to Last",              text: "No crash diets. No quick fixes. Just sustainable transformations built on consistency, education, and a community that keeps you going." },
] as const;

export default function OurJourney() {
  const trackRef   = useRef<HTMLDivElement>(null);
  const svgRef     = useRef<SVGSVGElement>(null);
  const pathBgRef  = useRef<SVGPathElement>(null);
  const pathAnimRef= useRef<SVGPathElement>(null);
  const builtRef   = useRef(false);

  useEffect(() => {
    const isMobile = () => window.innerWidth <= 700;

    function addDot(svg: SVGSVGElement, cx: number, cy: number) {
      const ns = "http://www.w3.org/2000/svg";
      const ring = document.createElementNS(ns, "circle");
      ring.setAttribute("cx", String(cx));
      ring.setAttribute("cy", String(cy));
      ring.setAttribute("r",  "12");
      ring.setAttribute("fill",   "rgba(255,107,0,0.1)");
      ring.setAttribute("stroke", "rgba(255,107,0,0.3)");
      ring.setAttribute("stroke-width", "1");
      ring.classList.add("jdot");
      svg.appendChild(ring);

      const dot = document.createElementNS(ns, "circle");
      dot.setAttribute("cx", String(cx));
      dot.setAttribute("cy", String(cy));
      dot.setAttribute("r",  "6");
      dot.setAttribute("fill", "#ff6b00");
      dot.setAttribute("filter", "url(#jglow)");
      dot.classList.add("jdot");
      svg.appendChild(dot);
    }

    function animatePath(path: SVGPathElement) {
      const len = path.getTotalLength();
      path.style.strokeDasharray  = String(len);
      path.style.strokeDashoffset = String(len);
      path.style.transition = "none";
      requestAnimationFrame(() => {
        path.style.transition = "stroke-dashoffset 2.4s cubic-bezier(0.4,0,0.2,1)";
        path.style.strokeDashoffset = "0";
      });
    }

    function buildPath() {
      const track = trackRef.current;
      const svg   = svgRef.current;
      const pathBg  = pathBgRef.current;
      const pathAnim= pathAnimRef.current;
      if (!track || !svg || !pathBg || !pathAnim) return;

      svg.querySelectorAll(".jdot").forEach(el => el.remove());

      const rect = track.getBoundingClientRect();
      const W = rect.width;
      const H = track.scrollHeight;

      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.style.height = H + "px";

      const markers = Array.from(track.querySelectorAll<HTMLElement>(".jmarker"));
      const pts = markers.map(m => {
        const r = m.getBoundingClientRect();
        return {
          x: r.left - rect.left + r.width  / 2,
          y: r.top  - rect.top  + r.height / 2,
        };
      });

      const cx = W / 2;

      if (isMobile()) {
        const mx = 16;
        const d = `M ${mx} 0 L ${mx} ${H}`;
        pathBg.setAttribute("d", d);
        pathAnim.setAttribute("d", d);
        pts.forEach(p => addDot(svg, mx, p.y));
      } else {
        const all = [{ x: cx, y: 0 }, ...pts, { x: cx, y: H }];
        let d = `M ${all[0].x} ${all[0].y}`;
        for (let i = 0; i < all.length - 1; i++) {
          const p0 = all[Math.max(0, i - 1)];
          const p1 = all[i];
          const p2 = all[i + 1];
          const p3 = all[Math.min(all.length - 1, i + 2)];
          const cp1x = p1.x + (p2.x - p0.x) / 4;
          const cp1y = p1.y + (p2.y - p0.y) / 4;
          const cp2x = p2.x - (p3.x - p1.x) / 4;
          const cp2y = p2.y - (p3.y - p1.y) / 4;
          d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
        }
        pathBg.setAttribute("d", d);
        pathAnim.setAttribute("d", d);
        pts.forEach(p => addDot(svg, p.x, p.y));
      }

      if (!builtRef.current) {
        animatePath(pathAnim);
        builtRef.current = true;
      }
    }

    // IntersectionObserver — cards fade in
    const cardIo = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) (e.target as HTMLElement).style.opacity = "1",
          (e.target as HTMLElement).style.transform = "translateY(0)";
      });
    }, { threshold: 0.15 });

    const cards = document.querySelectorAll<HTMLElement>(".jcard");
    cards.forEach((c, i) => {
      c.style.transitionDelay = `${i * 0.12}s`;
      cardIo.observe(c);
    });

    // Section entering viewport triggers path build + animate
    const sectionIo = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { buildPath(); sectionIo.disconnect(); } });
    }, { threshold: 0.05 });
    if (trackRef.current) sectionIo.observe(trackRef.current);

    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(timer); timer = setTimeout(buildPath, 120); };
    window.addEventListener("resize", onResize);

    return () => {
      cardIo.disconnect();
      sectionIo.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <style>{`
        .jcard {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        @media (max-width: 700px) {
          .jstop { display: flex !important; flex-direction: column; align-items: flex-start !important; text-align: left !important; padding-left: 40px !important; min-height: auto !important; }
          .jstop .jmid { order: -1; margin-bottom: 10px; margin-left: -24px !important; }
          .jstop .jempty { display: none; }
          .jstop .jcard { text-align: left !important; padding: 0 !important; width: 100% !important; margin-bottom: 32px !important; }
          .jstop .jcard p { margin: 0 !important; max-width: 100% !important; }
          .jstop .jcard span { font-size: 3rem !important; }
        }
      `}</style>

      <section style={{ position: "relative", padding: "100px 24px 130px", background: "transparent", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "72px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginBottom: "18px" }}>
            <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.45 }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.35em", color: "#FF8200" }}>THE HEALTHIFY STORY</span>
            <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.45 }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(2.8rem, 5vw, 5rem)", lineHeight: 0.92, color: "#F5F0EB", letterSpacing: "0.03em" }}>
            THE HEALTHIFY <span style={{ color: "#FF8200", textShadow: "0 0 50px rgba(255,130,0,0.35)" }}>JOURNEY</span>
          </h2>
          <div style={{ width: "70px", height: "3px", background: "linear-gradient(to right, #FF8200, transparent)", margin: "18px auto 0", borderRadius: "2px" }} />
        </div>

        {/* Track */}
        <div ref={trackRef} style={{ position: "relative", maxWidth: "1000px", margin: "0 auto", zIndex: 1 }}>

          {/* SVG overlay */}
          <svg ref={svgRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", pointerEvents: "none", overflow: "visible", zIndex: 0 }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="jglow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <path ref={pathBgRef}  fill="none" stroke="rgba(255,107,0,0.1)" strokeWidth="1" strokeLinecap="round" />
            <path ref={pathAnimRef} fill="none" stroke="#FF8200" strokeWidth="1" strokeLinecap="round" />
          </svg>

          {/* Stops */}
          {STOPS.map((stop, i) => (
            <div key={stop.num} className="jstop" style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr", minHeight: "300px", alignItems: "center", position: "relative", zIndex: 2 }}>

              {/* Left slot */}
              {stop.side === "left" ? (
                <div className="jcard" style={{ gridColumn: 1, textAlign: "right", paddingRight: "48px" }}>
                  <span style={{ display: "block", fontFamily: "var(--font-bebas)", fontSize: "clamp(4rem,7vw,6.5rem)", color: "rgba(255,130,0,0.07)", lineHeight: 1, marginBottom: "-12px", userSelect: "none" }}>{stop.num}</span>
                  <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(1.6rem,2.6vw,2.2rem)", color: "#F5F0EB", letterSpacing: "0.04em", lineHeight: 1, marginBottom: "14px" }}>{stop.title}</h3>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 300, color: "#aaaaaa", lineHeight: 1.85, maxWidth: "340px", marginLeft: "auto" }}>{stop.text}</p>
                </div>
              ) : (
                <div className="jempty" style={{ gridColumn: 1 }} />
              )}

              {/* Centre marker */}
              <div className="jmid" style={{ gridColumn: 2, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div className="jmarker" style={{ width: "14px", height: "14px", borderRadius: "50%", background: "transparent" }} />
              </div>

              {/* Right slot */}
              {stop.side === "right" ? (
                <div className="jcard" style={{ gridColumn: 3, textAlign: "left", paddingLeft: "48px" }}>
                  <span style={{ display: "block", fontFamily: "var(--font-bebas)", fontSize: "clamp(4rem,7vw,6.5rem)", color: "rgba(255,130,0,0.07)", lineHeight: 1, marginBottom: "-12px", userSelect: "none" }}>{stop.num}</span>
                  <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(1.6rem,2.6vw,2.2rem)", color: "#F5F0EB", letterSpacing: "0.04em", lineHeight: 1, marginBottom: "14px" }}>{stop.title}</h3>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 300, color: "#aaaaaa", lineHeight: 1.85, maxWidth: "340px" }}>{stop.text}</p>
                </div>
              ) : (
                <div className="jempty" style={{ gridColumn: 3 }} />
              )}

            </div>
          ))}
        </div>
      </section>
    </>
  );
}
