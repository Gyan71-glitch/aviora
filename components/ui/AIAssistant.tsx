"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Sparkles, X, Send, Bot, User, MoreHorizontal, MessageSquare, Compass, Heart, Users, DollarSign, ArrowLeft, Trash2 } from "lucide-react";
import { ChatMessage } from "@/lib/types";
import { useAuth } from "@/lib/context/AuthContext";
import AvioraRobotSVG from "./AvioraRobotSVG";

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: string;
}

const EMOTIONAL_PRESETS = [
  { text: "Help me find a romantic getaway for a perfect escape", icon: Heart, color: "text-rose-500 bg-rose-50" },
  { text: "Recommend a serene, quiet nature retreat", icon: Compass, color: "text-emerald-500 bg-emerald-50" },
  { text: "Design a magical, worry-free trip for my family", icon: Users, color: "text-blue-500 bg-blue-50" },
  { text: "Show me hidden luxury travel gems on a budget", icon: DollarSign, color: "text-amber-500 bg-amber-50" },
];

function getResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("romantic") || q.includes("getaway") || q.includes("escape")) {
    return "💖 Romantic Escapes Selected:\n\n✨ Maldives Private Water Villa — Secluded overwater villas with private infinity pools, underwater dining, and candlelit beach dinners. Package from ₹98,000/person.\n\n✨ Santorini Sunset Suite, Greece — Cliffside luxury cave suite with a heated jacuzzi overlooking the Caldera. Package from ₹1,20,000/person.\n\nShall I search flight availability or explore accommodation options for your escape?";
  }
  if (q.includes("serene") || q.includes("nature") || q.includes("retreat")) {
    return "🌿 Serene Nature Retreats Selected:\n\n✨ Shimla Luxury Forest Resort — Wildflower Hall, nested amidst pine forests with outdoor whirlpools overlooking the Himalayas. Rates from ₹28,000/night.\n\n✨ Ubud Rainforest Sanctuary, Bali — Treehouse villas suspended over the sacred Ayung River valley with private yoga decks. Rates from ₹16,500/night.\n\nWould you like me to book a luxury forest villa stay?";
  }
  if (q.includes("family") || q.includes("magical") || q.includes("worry-free")) {
    return "👨‍👩‍👧‍👦 Family Magic Vacations:\n\n✨ Disneyland Paris & Loire Valley Castles — A hybrid of theme-park magic and beautiful historic estates with child-friendly private guides. Package from ₹1,85,000 for family of 4.\n\n✨ Singapore & Sentosa Luxury Resort — Universal Studios VIP access, S.E.A. Aquarium private tour, and beachside family suites. Package from ₹1,20,000 for family of 3.\n\nI can customize the itinerary further to match your children's ages!";
  }
  if (q.includes("budget") || q.includes("luxury") || q.includes("gems")) {
    return "💎 Affordable Luxury Gems Selected:\n\n✨ Bangkok, Thailand — 5-star luxury at 3-star prices. Stay at the Banyan Tree or Lebua with sky bar access. Flights + Luxury Stay ≈ ₹38,000/person.\n\n✨ Goa Boutique Beach Resort — Private beach access, heritage architecture, and premium spa retreats. Flights + Stay ≈ ₹18,500/person.\n\nWhich of these gems would you like to explore first?";
  }
  if (q.includes("destination") || q.includes("december") || q.includes("best")) {
    return "✈️ Top picks right now:\n\n🌟 Dubai — Warm weather, world-class luxury. Flights from ₹15,800\n\n🌸 Bali — Harvest festival season, great deals. From ₹22,000\n\n🗼 Paris — Magical winter atmosphere. From ₹48,000\n\nWould you like to explore any of these?";
  }
  if (q.includes("visa") || q.includes("dubai") || q.includes("requirement")) {
    return "🛂 Dubai Visa for Indians:\n\n• Visa on Arrival: Not available\n• Tourist Visa: 30 or 60 days\n• Cost: ₹5,500–₹7,500\n• Processing: 3–5 business days\n• Required: Passport (6+ months validity), return ticket, hotel booking\n\nShall I help find flights to Dubai?";
  }
  return "👋 I'm Aviora — your personal AI travel companion. I can help search flights, luxury hotels, custom itineraries, and visa details.\n\nWhat are you in the mood to plan today?";
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoggedIn } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Welcome to AVIORA AI! I'm your virtual travel assistant. Ask me anything about destinations, visas, or luxury trip planning!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [showMenu, setShowMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const isChatStarted = messages.length > 1;

  useEffect(() => {
    const saved = localStorage.getItem("aviora_chat_sessions");
    if (saved) {
      try {
        setSessions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved chat sessions", e);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length <= 1) return;

    setSessions((prev) => {
      let updated: ChatSession[];
      if (activeSessionId) {
        updated = prev.map((s) =>
          s.id === activeSessionId ? { ...s, messages } : s
        );
      } else {
        const newId = Date.now().toString();
        const firstUserMsg = messages.find((m) => m.role === "user")?.content || "Trip Query";
        const title = firstUserMsg.length > 28 ? firstUserMsg.substring(0, 28) + "..." : firstUserMsg;
        const newSession: ChatSession = {
          id: newId,
          title,
          messages,
          timestamp: new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setActiveSessionId(newId);
        updated = [newSession, ...prev];
      }
      localStorage.setItem("aviora_chat_sessions", JSON.stringify(updated));
      return updated;
    });
  }, [messages, activeSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleNewChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "👋 Welcome to AVIORA AI! I'm your virtual travel assistant. Ask me anything about destinations, visas, or luxury trip planning!",
        timestamp: new Date(),
      },
    ]);
    setActiveSessionId(null);
    setShowHistory(false);
    setShowMenu(false);
  };

  const handleSelectSession = (session: ChatSession) => {
    setMessages(session.messages);
    setActiveSessionId(session.id);
    setShowHistory(false);
  };

  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    localStorage.setItem("aviora_chat_sessions", JSON.stringify(updated));
    if (activeSessionId === id) {
      handleNewChat();
    }
  };

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
      <motion.div
        id="ai-assistant-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed", bottom: "28px", right: "28px", zIndex: 2000,
          cursor: "pointer",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <div className="relative group">
          <motion.div
            className="absolute -inset-2 rounded-full bg-gradient-to-r from-amber-400/40 via-amber-500/30 to-amber-300/40 blur-md"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.5, 0.85, 0.5],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-400/60 shadow-[0_10px_35px_rgba(212,175,55,0.45)] flex items-center justify-center overflow-hidden p-1.5 backdrop-blur-xl"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
          >
            <AvioraRobotSVG width={64} height={64} />
            <span className="absolute bottom-2 right-2 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-xs animate-pulse" />
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="fixed bottom-[115px] right-[28px] z-[1999] w-[390px] h-[550px] bg-white border border-slate-200/80 rounded-[28px] flex flex-col overflow-hidden shadow-[0_25px_65px_rgba(0,0,0,0.12)] font-sans"
          >
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white relative shrink-0">
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-sm tracking-widest text-slate-800 uppercase">aviora.ai</span>
                <span className="text-[9px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider">beta</span>
              </div>
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-800 transition-colors"
              >
                <MoreHorizontal size={18} />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-4 top-14 z-50 w-44 bg-white border border-slate-200/80 rounded-2xl shadow-xl py-1 flex flex-col overflow-hidden"
                    >
                      <button
                        onClick={handleNewChat}
                        className="px-4 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors border-b border-slate-100"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>New Chat</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowHistory(true);
                          setShowMenu(false);
                        }}
                        className="px-4 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                        <span>Chat History</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {showHistory ? (
              <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col text-left space-y-4">
                <div className="flex items-center gap-2 shrink-0 border-b border-slate-100 pb-3">
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-1 rounded-full hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <h3 className="font-display font-extrabold text-sm text-slate-900 uppercase tracking-wider">Chat History</h3>
                </div>

                {sessions.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <MessageSquare className="w-8 h-8 text-slate-300" />
                    <p className="text-xs font-semibold text-slate-400">No saved chats found.</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className={`group w-full border rounded-2xl p-3.5 flex items-start justify-between cursor-pointer transition-all duration-200 ${
                          activeSessionId === session.id
                            ? "bg-blue-50/40 border-blue-200"
                            : "bg-white border-slate-200/70 hover:border-slate-350 hover:bg-slate-50"
                        }`}
                        onClick={() => handleSelectSession(session)}
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="text-xs font-bold text-slate-850 truncate mb-1">
                            {session.title}
                          </p>
                          <span className="text-[10px] font-bold text-slate-400">
                            {session.timestamp}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSession(session.id);
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {!isChatStarted ? (
                  <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-start text-left space-y-6">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: [0, 8, -6, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-14 h-14 rounded-2xl bg-slate-900 border border-amber-400/50 flex items-center justify-center overflow-hidden shadow-md shrink-0"
                      >
                        <Image
                          src="/robot-avatar.png"
                          alt="Aviora AI"
                          width={48}
                          height={48}
                          unoptimized
                          className="object-contain scale-110"
                        />
                      </motion.div>
                      <div>
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Digital Companion</span>
                        <h3 className="font-display text-lg font-bold text-slate-900 leading-tight">Meet Aviora</h3>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h1 className="text-3xl font-black text-blue-600 tracking-tight leading-none">
                        Hi, {isLoggedIn && user ? user.name : "Guest"}
                      </h1>
                      <p className="text-sm font-semibold text-slate-500 leading-relaxed max-w-[90%]">
                        I'm Aviora — your personal travel assistant. Let's plan your next trip together.
                      </p>
                    </div>

                    <div className="space-y-3.5 pt-2">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">You may try asking</p>
                      
                      <div className="space-y-3">
                        {EMOTIONAL_PRESETS.map((preset) => {
                          const PresetIcon = preset.icon;
                          return (
                            <button
                              key={preset.text}
                              onClick={() => sendMessage(preset.text)}
                              className="w-full bg-white hover:bg-slate-50 border border-slate-200/70 hover:border-blue-200 rounded-2xl p-4 cursor-pointer text-left flex items-start gap-3 shadow-xs hover:shadow-md transition-all duration-200 group"
                            >
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${preset.color} transition-colors group-hover:scale-105`}>
                                <PresetIcon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 pr-2 pt-0.5">
                                <p className="text-xs font-bold text-slate-800 leading-normal group-hover:text-blue-600 transition-colors">
                                  {preset.text}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4 bg-slate-50/50">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 items-start ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden ${
                          msg.role === "user" 
                            ? "bg-slate-100 border border-slate-200" 
                            : "bg-slate-900 border border-amber-400/50"
                        }`}>
                          {msg.role === "user" ? (
                            <User size={13} className="text-slate-600" />
                          ) : (
                            <Image src="/robot-avatar.png" alt="Aviora Robot" width={28} height={28} unoptimized />
                          )}
                        </div>

                        <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-xs border ${
                          msg.role === "user"
                            ? "bg-blue-600 text-white border-blue-600 rounded-tr-none font-medium"
                            : "bg-white text-slate-800 border-slate-200/70 rounded-tl-none font-medium"
                        }`}>
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}

                    {isTyping && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-full flex-shrink-0 bg-slate-900 border border-amber-400/50 flex items-center justify-center overflow-hidden">
                          <Image src="/robot-avatar.png" alt="Aviora Robot" width={28} height={28} unoptimized />
                        </div>
                        <div className="px-4 py-3 bg-white border border-slate-200/70 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-blue-600"
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 0.75, repeat: Infinity, delay: i * 0.15 }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}

                <div className="p-4 border-t border-slate-100 bg-white shrink-0">
                  <div className="flex gap-2.5 items-center bg-slate-50 border border-slate-200/70 rounded-2xl px-3 py-2">
                    <input
                      id="ai-chat-input"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage(input);
                        }
                      }}
                      placeholder="Ask me anything..."
                      className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 font-bold outline-none border-none px-1 py-1.5"
                    />
                    <motion.button
                      onClick={() => sendMessage(input)}
                      disabled={!input.trim() || isTyping}
                      whileTap={{ scale: 0.95 }}
                      className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center transition-all ${
                        input.trim() 
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 cursor-pointer" 
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <Send size={15} />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
