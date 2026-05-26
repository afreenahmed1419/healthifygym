"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const IMAGES = [
  "/images/healthify-collage/img1.png",
  "/images/healthify-collage/img2.jpeg",
  "/images/healthify-collage/img3.png",
  "/images/healthify-collage/img4.png",
  "/images/healthify-collage/img5.jpg",
  "/images/healthify-collage/img6.jpg",
  "/images/healthify-collage/img7.png",
  "/images/healthify-collage/img8.png",
  "/images/healthify-collage/img9.png",
];

function ImgCard({ src, index, tall = false }: { src: string; index: number; tall?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: "14px",
        overflow: "hidden",
        height: tall ? "280px" : "200px",
        cursor: "pointer",
        border: hovered ? "1px solid rgba(255,130,0,0.65)" : "1px solid rgba(255,130,0,0.12)",
        boxShadow: hovered ? "0 0 24px rgba(255,130,0,0.3)" : "none",
        transition: "border 0.3s, box-shadow 0.3s",
        flexShrink: 0,
      }}
    >
      <Image
        src={src}
        alt={`Community member ${index + 1}`}
        fill
        sizes="300px"
        style={{
          objectFit: "cover",
          transform: hovered ? "scale(1.08)" : "scale(1)",
          transition: "transform 0.45s ease",
        }}
      />
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(255,130,0,0.15)",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.3s",
        pointerEvents: "none",
      }} />
    </motion.div>
  );
}

function LogoCard() {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 85, damping: 13, delay: 0.3 }}
      style={{
        position: "relative",
        borderRadius: "14px",
        overflow: "hidden",
        height: "280px",
        background: "rgba(255,130,0,0.07)",
        border: "1px solid rgba(255,130,0,0.4)",
        boxShadow: "0 0 36px rgba(255,130,0,0.22), inset 0 1px 0 rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Image
        src="/logo.jpg"
        alt="Healthify"
        fill
        sizes="300px"
        style={{ objectFit: "contain", padding: "24px" }}
      />
    </motion.div>
  );
}

export default function WomanCollage() {
  return (
    <section style={{ padding: "100px 80px", position: "relative", background: "transparent" }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        style={{ textAlign: "center", marginBottom: "64px" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "16px" }}>
          <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.5 }} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.3em", color: "#FF8200" }}>
            OUR COMMUNITY
          </span>
          <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.5 }} />
        </div>
        <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(3rem, 5vw, 5rem)", color: "#F5F0EB", lineHeight: 0.92 }}>
          MEET THE <span style={{ color: "#FF8200" }}>WOMEN</span>
        </h2>
      </motion.div>

      {/* Grid */}
      <div style={{ maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>

        {/* Row 1: img1 | LOGO | img2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
          <ImgCard src={IMAGES[0]} index={0} tall />
          <LogoCard />
          <ImgCard src={IMAGES[1]} index={1} tall />
        </div>

        {/* Row 2: img3 | img4 | img5 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
          <ImgCard src={IMAGES[2]} index={2} />
          <ImgCard src={IMAGES[3]} index={3} />
          <ImgCard src={IMAGES[4]} index={4} />
        </div>

        {/* Row 3: img6 | img7 | img8 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
          <ImgCard src={IMAGES[5]} index={5} />
          <ImgCard src={IMAGES[6]} index={6} />
          <ImgCard src={IMAGES[7]} index={7} />
        </div>

        {/* Row 4: img9 centered */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
          <div />
          <ImgCard src={IMAGES[8]} index={8} />
          <div />
        </div>

      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{ textAlign: "center", marginTop: "64px" }}
      >
        <button
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#080808",
            background: "#FF8200",
            border: "none",
            padding: "16px 40px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.1)")}
          onMouseLeave={e => (e.currentTarget.style.filter = "none")}
        >
          JOIN OUR COMMUNITY →
        </button>
      </motion.div>

    </section>
  );
}
