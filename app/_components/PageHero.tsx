"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface PageHeroProps {
  label: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  breadcrumb?: { label: string; href: string }[];
}

export default function PageHero({ label, title, titleAccent, subtitle, breadcrumb }: PageHeroProps) {
  return (
    <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden bg-[#0a0a0a]">
      {/* Background hex grid */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute right-0 top-0 w-[500px] h-[500px] opacity-[0.04]" viewBox="0 0 300 300" fill="none">
          {Array.from({ length: 4 }).map((_, row) =>
            Array.from({ length: 4 }).map((_, col) => (
              <polygon
                key={`${row}-${col}`}
                points="30,5 55,18 55,44 30,57 5,44 5,18"
                stroke="#FF8C42"
                strokeWidth="0.8"
                fill="none"
                transform={`translate(${col * 62 + (row % 2) * 31}, ${row * 54})`}
              />
            ))
          )}
        </svg>
        <div
          className="absolute left-[-100px] bottom-0 w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #FF8C42 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        {breadcrumb && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-xs text-[#555] mb-6"
          >
            <Link href="/" className="hover:text-[#FF8C42] transition-colors">Home</Link>
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                <span>/</span>
                {i === breadcrumb.length - 1 ? (
                  <span className="text-[#888]">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-[#FF8C42] transition-colors">{crumb.label}</Link>
                )}
              </span>
            ))}
          </motion.nav>
        )}

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-8 h-0.5 bg-[#FF8C42]" />
          <span
            className="text-[#FF8C42] text-xs uppercase tracking-[0.3em] font-semibold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {label}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
          className="text-[clamp(40px,8vw,88px)] font-black uppercase leading-none mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <span className="text-white">{title} </span>
          {titleAccent && <span className="text-[#FF8C42]">{titleAccent}</span>}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-[#888] text-sm sm:text-base max-w-xl leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Bottom border with glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF8C42]/30 to-transparent" />
    </section>
  );
}
