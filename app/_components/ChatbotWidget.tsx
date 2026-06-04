"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

const WELCOME = "Hey! 👋 I'm Healthify's AI assistant. Ask me anything — membership plans, classes, trainers, or what makes us different. I'm here to help!";

export default function ChatbotWidget() {
  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const abortRef   = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  const send = useCallback(async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setLoading(true);

    const history = messages.map(({ role, content }) => ({ role, content }));
    const updated: Message[] = [
      ...messages,
      { role: "user" as const, content: q },
      { role: "assistant" as const, content: "", streaming: true },
    ];
    setMessages(updated);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...history, { role: "user", content: q }],
        }),
        signal: ctrl.signal,
      });

      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: text, streaming: true };
          return copy;
        });
      }

      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: text };
        return copy;
      });
    } catch (err: unknown) {
      if ((err as Error).name === "AbortError") return;
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Sorry, I ran into an issue. You can reach us directly at +91 94742 87111 or on WhatsApp!",
        };
        return copy;
      });
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [input, loading, messages]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      <style>{`
        @keyframes pulse-cta {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,130,0,0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(255,130,0,0); }
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .hfy-chat-btn {
          animation: pulse-cta 2.5s ease-in-out infinite;
          transition: transform 0.2s ease, filter 0.2s ease;
        }
        .hfy-chat-btn:hover {
          transform: translateY(-3px);
          filter: drop-shadow(0 8px 20px rgba(255,130,0,0.45));
          animation: none;
        }
        .hfy-input::placeholder { color: rgba(245,240,235,0.3); }
        .hfy-input:focus { border-color: #FF8200 !important; outline: none; }
        .hfy-send:hover:not(:disabled) { filter: brightness(1.12); }
        .hfy-msg-area::-webkit-scrollbar { width: 3px; }
        .hfy-msg-area::-webkit-scrollbar-track { background: transparent; }
        .hfy-msg-area::-webkit-scrollbar-thumb { background: rgba(255,130,0,0.2); border-radius: 2px; }
        .hfy-cursor { display:inline-block; width:2px; height:12px; background:#FF8200; margin-left:2px; vertical-align:middle; animation: blink 0.8s step-end infinite; }
      `}</style>

      {/* ── Toggle button + bubble ── */}
      <div style={{ position: "fixed", bottom: "24px", left: "24px", zIndex: 999, display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="hfy-chat-btn"
          aria-label={open ? "Close chat" : "Open chat"}
          style={{
            position: "relative", width: "56px", height: "56px",
            background: "linear-gradient(135deg, #FF8200, #cc7000)",
            borderRadius: "16px", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}
        >
          {!open && (
            <span style={{
              position: "absolute", top: "-5px", right: "-5px",
              width: "14px", height: "14px", background: "#22c55e",
              borderRadius: "50%", border: "2.5px solid #0d0d0d", zIndex: 1,
            }} />
          )}
          {open ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 26 26" fill="none">
              <rect x="1" y="1" width="24" height="18" rx="5" fill="white" fillOpacity="0.95"/>
              <path d="M11 19h4l-2 4.5z" fill="white" fillOpacity="0.95"/>
              <line x1="5.5" y1="7.5"  x2="20.5" y2="7.5"  stroke="rgba(255,130,0,0.85)" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="5.5" y1="12.5" x2="16.5" y2="12.5" stroke="rgba(255,130,0,0.85)" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          )}
        </button>

        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.9 }}
              transition={{ delay: 0.8, duration: 0.22 }}
              onClick={() => setOpen(true)}
              style={{
                position: "relative", background: "#111",
                border: "1px solid rgba(255,130,0,0.2)", borderRadius: "14px",
                padding: "10px 16px", cursor: "pointer",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}
            >
              <div style={{ position: "absolute", left: -7, top: "50%", transform: "translateY(-50%)", width: 0, height: 0, borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderRight: "7px solid rgba(255,130,0,0.2)" }} />
              <div style={{ position: "absolute", left: -5, top: "50%", transform: "translateY(-50%)", width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderRight: "6px solid #111" }} />
              <p style={{ color: "white", fontSize: "12px", fontWeight: 600, fontFamily: "var(--font-body)", whiteSpace: "nowrap", margin: 0 }}>Chat with us!</p>
              <p style={{ color: "#FF8200", fontSize: "10px", fontWeight: 500, fontFamily: "var(--font-body)", whiteSpace: "nowrap", margin: "2px 0 0" }}>Available 24/7</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Chat window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{
              position: "fixed", bottom: "96px", left: "24px", zIndex: 999,
              width: "360px", maxWidth: "calc(100vw - 32px)",
              height: "500px", maxHeight: "calc(100vh - 120px)",
              background: "#0F0F0F",
              border: "1px solid rgba(255,130,0,0.2)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(255,130,0,0.08)",
              display: "flex", flexDirection: "column", overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{
              height: "60px", background: "#FF8200", padding: "0 20px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexShrink: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 1L18.66 6V14L10 19L1.34 14V6Z" fill="#080808"/>
                  <text x="10" y="13.5" textAnchor="middle" fill="#FF8200" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">H</text>
                </svg>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", color: "#080808", letterSpacing: "0.1em", lineHeight: 1 }}>
                    HEALTHIFY AI
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
                    <span style={{ fontSize: "9px", color: "#080808", fontFamily: "var(--font-body)", fontWeight: 600 }}>
                      {loading ? "Typing…" : "Online"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", lineHeight: 0 }}
                aria-label="Close chat"
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M1 1l11 11M12 1L1 12" stroke="#080808" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              className="hfy-msg-area"
              style={{
                flex: 1, overflowY: "auto", padding: "16px",
                display: "flex", flexDirection: "column", gap: "10px",
                background: "#0F0F0F",
              }}
            >
              {messages.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "86%",
                    padding: "10px 14px",
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    fontWeight: msg.role === "user" ? 500 : 400,
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.65",
                    borderRadius: "2px",
                    ...(msg.role === "user"
                      ? { background: "#FF8200", color: "#080808" }
                      : { background: "#1A1A1A", color: "#F5F0EB", border: "1px solid rgba(255,130,0,0.15)" }
                    ),
                  }}>
                    {msg.content}
                    {msg.streaming && msg.content.length > 0 && (
                      <span className="hfy-cursor" />
                    )}
                    {/* Action CTAs for last assistant message */}
                    {msg.role === "assistant" && !msg.streaming && i === messages.length - 1 && (
                      <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
                        {/* WhatsApp CTA */}
                        {(msg.content.toLowerCase().includes("whatsapp") || msg.content.toLowerCase().includes("+91")) && (
                          <a
                            href="https://wa.me/919474287111"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "flex", alignItems: "center", gap: "6px",
                              background: "#25D366", color: "white", fontSize: "11px", fontWeight: 600,
                              padding: "6px 10px", width: "fit-content", fontFamily: "var(--font-body)",
                              borderRadius: "2px", textDecoration: "none",
                            }}
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.532 5.845L.057 23.547a.5.5 0 0 0 .609.61l5.805-1.527A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                            </svg>
                            Chat on WhatsApp
                          </a>
                        )}
                        {/* Contact page CTA for offers/membership queries */}
                        {(msg.content.toLowerCase().includes("offer") || msg.content.toLowerCase().includes("contact") || msg.content.toLowerCase().includes("quarterly") || msg.content.toLowerCase().includes("annual")) && (
                          <a
                            href="/contact"
                            style={{
                              display: "flex", alignItems: "center", gap: "6px",
                              background: "rgba(255,130,0,0.12)", color: "#FF8200",
                              border: "1px solid rgba(255,130,0,0.3)",
                              fontSize: "11px", fontWeight: 600,
                              padding: "6px 10px", width: "fit-content", fontFamily: "var(--font-body)",
                              borderRadius: "2px", textDecoration: "none",
                            }}
                          >
                            🎁 See Current Offers →
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading dots when waiting for first token */}
              {loading && messages[messages.length - 1]?.content === "" && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{
                    background: "#1A1A1A", border: "1px solid rgba(255,130,0,0.15)",
                    padding: "12px 16px", display: "flex", gap: "5px", alignItems: "center",
                  }}>
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: d * 0.2 }}
                        style={{ width: 5, height: 5, borderRadius: "50%", background: "#FF8200", display: "block" }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{
              background: "#141414", borderTop: "1px solid rgba(255,130,0,0.15)",
              padding: "12px 16px", display: "flex", gap: "8px", flexShrink: 0,
            }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask me anything…"
                className="hfy-input"
                style={{
                  flex: 1, background: "#1A1A1A",
                  border: "1px solid rgba(255,130,0,0.2)",
                  color: "#F5F0EB", fontFamily: "var(--font-body)",
                  fontSize: "13px", padding: "10px 14px",
                  borderRadius: 0, transition: "border-color 0.2s",
                }}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="hfy-send"
                style={{
                  background: "#FF8200", color: "#080808", border: "none",
                  padding: "10px 16px", cursor: "pointer", fontSize: "18px",
                  lineHeight: 1, fontWeight: 700,
                  opacity: loading || !input.trim() ? 0.35 : 1,
                  transition: "filter 0.15s, opacity 0.15s",
                }}
              >
                →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
