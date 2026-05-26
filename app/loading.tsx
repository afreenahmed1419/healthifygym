export default function Loading() {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: "2px",
      zIndex: 9999,
      background: "linear-gradient(to right, transparent, #FF8200, #FF8200, transparent)",
      animation: "loading-bar 0.8s ease-in-out infinite",
    }}>
      <style>{`
        @keyframes loading-bar {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
      `}</style>
    </div>
  );
}
