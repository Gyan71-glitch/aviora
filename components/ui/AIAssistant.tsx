"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, User } from "lucide-react";
import { ChatMessage } from "@/lib/types";

const PRESETS = [
  "Best destinations for December?",
  "Visa for Dubai from India?",
  "Plan a 7-day Paris trip",
  "Budget trip under ₹50,000?",
];

function getResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("destination") || q.includes("december") || q.includes("best")) {
    return "✈️ Top picks right now:\n\n🌟 Dubai — Warm weather, world-class luxury. Flights from ₹15,800\n\n🌸 Bali — Harvest festival season, great deals. From ₹22,000\n\n🗼 Paris — Magical winter atmosphere. From ₹48,000\n\nWould you like to explore any of these?";
  }
  if (q.includes("visa") || q.includes("dubai") || q.includes("requirement")) {
    return "🛂 Dubai Visa for Indians:\n\n• Visa on Arrival: Not available\n• Tourist Visa: 30 or 60 days\n• Cost: ₹5,500–₹7,500\n• Processing: 3–5 business days\n• Required: Passport (6+ months validity), return ticket, hotel booking\n\nShall I help find flights to Dubai?";
  }
  if (q.includes("paris") || q.includes("plan") || q.includes("7-day") || q.includes("itinerary")) {
    return "🗼 7-Day Paris Itinerary:\n\nDay 1: Eiffel Tower & Champ de Mars\nDay 2: Louvre Museum & Tuileries\nDay 3: Versailles Day Trip\nDay 4: Montmartre & Sacré-Cœur\nDay 5: Seine River Cruise\nDay 6: Marais District & Le Marais\nDay 7: Shopping & Departure\n\n💰 Estimated budget: ₹1,50,000–₹2,50,000\n\nReady to book your Paris flight?";
  }
  if (q.includes("budget") || q.includes("50,000") || q.includes("cheap") || q.includes("affordable")) {
    return "💰 Best Budget Destinations under ₹50,000:\n\n🏖️ Bangkok — Flight + 5 nights ≈ ₹35,000\n🌴 Bali — Flight + 5 nights villa ≈ ₹45,000\n✈️ Dubai — Flight + 4 nights ≈ ₹48,000\n🌏 Singapore — Flight + 3 nights ≈ ₹42,000\n\nAll prices per person. Want me to search for deals?";
  }
  if (q.includes("hotel") || q.includes("stay") || q.includes("resort")) {
    return "🏨 Top Luxury Hotels:\n\n⭐⭐⭐⭐⭐ Burj Al Arab, Dubai — ₹45,000/night\n⭐⭐⭐⭐⭐ Four Seasons George V, Paris — ₹68,000/night\n⭐⭐⭐⭐⭐ Ritz-Carlton Maldives — ₹92,000/night\n\nLooking for budget-friendly stays too? I can help!";
  }
  return "👋 Hi! I'm your AVIORA travel assistant. I can help with:\n\n• Best destinations\n• Visa & travel requirements\n• Trip planning & itineraries\n• Budget estimation\n• Hotel recommendations\n\nWhat would you like to explore today?";
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Welcome to AVIORA AI! I'm here to help you plan your perfect journey. Ask me anything about destinations, visas, or trip planning!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(
      () => {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: getResponse(text),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
      },
      900 + Math.random() * 700
    );
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        id="ai-assistant-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed", bottom: "32px", right: "32px", zIndex: 2000,
          width: "60px", height: "60px", borderRadius: "50%",
          background: "linear-gradient(135deg, #D4AF37, #B8960C)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 32px rgba(212,175,55,0.4)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={
          isOpen
            ? {}
            : {
                boxShadow: [
                  "0 8px 32px rgba(212,175,55,0.35)",
                  "0 8px 40px rgba(212,175,55,0.65)",
                  "0 8px 32px rgba(212,175,55,0.35)",
                ],
              }
        }
        transition={isOpen ? {} : { duration: 2.2, repeat: Infinity }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <X size={24} color="#071426" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <Sparkles size={24} color="#071426" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", bottom: "42px", right: "100px", zIndex: 2000,
              background: "rgba(7,20,38,0.92)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(212,175,55,0.25)", borderRadius: "8px",
              padding: "6px 14px", fontSize: "12px", color: "rgba(255,255,255,0.85)",
              fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap", pointerEvents: "none",
            }}
          >
            AI Travel Assistant ✦
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            style={{
              position: "fixed", bottom: "104px", right: "32px", zIndex: 1999,
              width: "384px", height: "530px",
              background: "rgba(7,20,38,0.97)", backdropFilter: "blur(24px)",
              border: "1px solid rgba(212,175,55,0.18)", borderRadius: "20px",
              display: "flex", flexDirection: "column", overflow: "hidden",
              boxShadow: "0 24px 80px rgba(0,0,0,0.65)",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "16px 20px", borderBottom: "1px solid rgba(212,175,55,0.12)",
              display: "flex", alignItems: "center", gap: "12px",
              background: "rgba(212,175,55,0.06)",
            }}>
              <div style={{
                width: "38px", height: "38px", borderRadius: "50%",
                background: "linear-gradient(135deg, #D4AF37, #B8960C)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Sparkles size={18} color="#071426" />
              </div>
              <div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "17px", fontWeight: 600, color: "white", lineHeight: 1 }}>AVIORA AI</p>
                <p style={{ fontSize: "10px", color: "var(--gold)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "2px" }}>Your Travel Intelligence</p>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px" }}>
                <motion.div
                  style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4CAF50" }}
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", fontFamily: "'Inter', sans-serif" }}>Online</span>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: "flex",
                    flexDirection: msg.role === "user" ? "row-reverse" : "row",
                    gap: "8px", alignItems: "flex-start",
                  }}
                >
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                    background: msg.role === "user" ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg, #D4AF37, #B8960C)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {msg.role === "user" ? <User size={13} color="white" /> : <Bot size={13} color="#071426" />}
                  </div>
                  <div style={{
                    maxWidth: "82%", padding: "10px 14px",
                    borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                    background: msg.role === "user" ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.05)",
                    border: msg.role === "user" ? "1px solid rgba(212,175,55,0.2)" : "1px solid rgba(255,255,255,0.07)",
                    fontSize: "13px", lineHeight: 1.65, color: "rgba(255,255,255,0.88)",
                    fontFamily: "'Inter', sans-serif", whiteSpace: "pre-line",
                  }}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #D4AF37, #B8960C)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Bot size={13} color="#071426" />
                  </div>
                  <div style={{
                    padding: "10px 16px", borderRadius: "14px 14px 14px 4px",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)",
                    display: "flex", gap: "5px", alignItems: "center",
                  }}>
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--gold)" }}
                        animate={{ y: [0, -7, 0] }}
                        transition={{ duration: 0.75, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Presets */}
            <div style={{ padding: "0 14px 8px", display: "flex", gap: "5px", flexWrap: "wrap" }}>
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  style={{
                    padding: "4px 10px", borderRadius: "12px",
                    background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)",
                    color: "rgba(255,255,255,0.65)", fontSize: "11px",
                    fontFamily: "'Inter', sans-serif", cursor: "pointer",
                    transition: "all 0.2s ease", whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,175,55,0.18)"; e.currentTarget.style.color = "#D4AF37"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(212,175,55,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{
              padding: "12px 16px",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "flex", gap: "10px", alignItems: "center",
            }}>
              <input
                id="ai-chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                placeholder="Ask about destinations, visas, trips..."
                style={{
                  flex: 1, background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px", padding: "10px 14px",
                  color: "white", fontSize: "13px",
                  fontFamily: "'Inter', sans-serif", outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.45)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              <motion.button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: "38px", height: "38px", borderRadius: "10px", flexShrink: 0,
                  background: input.trim() ? "linear-gradient(135deg, #D4AF37, #B8960C)" : "rgba(255,255,255,0.08)",
                  border: "none", cursor: input.trim() ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
              >
                <Send size={15} color={input.trim() ? "#071426" : "rgba(255,255,255,0.25)"} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
