"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Linkedin, Mail, MapPin } from "lucide-react";
import Avatar from "@/components/Avatar";
import ChatMessage from "@/components/ChatMessage";

const SUGGESTION_CHIPS = [
  "Show me your best projects 🚀",
  "What tools do you use?",
  "How can we collaborate?",
  "Tell me a fun fact about you 😄",
  "What's your automation superpower?",
  "Are you open to freelance work?",
];

type AvatarState = "idle" | "thinking" | "replying";

export default function Home() {
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const [showChips, setShowChips] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevIsLoadingRef = useRef(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } =
    useChat({
      api: "/api/chat",
      onFinish: () => {
        setAvatarState("replying");
        setTimeout(() => setAvatarState("idle"), 2500);
      },
      onError: () => {
        setAvatarState("idle");
      },
    });

  // Track loading transitions for avatar state
  useEffect(() => {
    if (isLoading && !prevIsLoadingRef.current) {
      setAvatarState("thinking");
    }
    prevIsLoadingRef.current = isLoading;
  }, [isLoading]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChipClick = useCallback(
    (chip: string) => {
      setShowChips(false);
      setHasStarted(true);
      append({ role: "user", content: chip });
    },
    [append]
  );

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
      setShowChips(false);
      setHasStarted(true);
      handleSubmit(e);
    },
    [input, handleSubmit]
  );

  const isStreaming = isLoading;
  const lastMessageIsAssistant =
    messages.length > 0 && messages[messages.length - 1].role === "assistant";

  return (
    <main className="mesh-bg flex flex-col min-h-[100dvh] max-h-[100dvh] overflow-hidden relative">
      {/* Top nav */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,5,5,0.95), rgba(5,5,5,0))",
        }}
      >
        <span className="font-mono text-xs tracking-[0.2em] text-[#3a3835] uppercase">
          Carlo Fonollera
        </span>
        <div className="flex items-center gap-4">
          <motion.div
            className="flex items-center gap-1.5"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            <span className="font-mono text-[10px] text-[#22c55e] tracking-widest uppercase">
              Available
            </span>
          </motion.div>
          <a
            href="https://www.linkedin.com/in/carlo-fonollera/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3a3835] hover:text-[#00e5ff] transition-colors duration-200"
          >
            <Linkedin size={15} />
          </a>
          <a
            href="mailto:carlofonollera@gmail.com"
            className="text-[#3a3835] hover:text-[#00e5ff] transition-colors duration-200"
          >
            <Mail size={15} />
          </a>
        </div>
      </motion.nav>

      {/* Center stage — avatar + intro */}
      <AnimatePresence mode="wait">
        {!hasStarted && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center flex-1 px-6 pb-4 pt-20 gap-6"
          >
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 16, delay: 0.2 }}
            >
              <Avatar state={avatarState} size={148} />
            </motion.div>

            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="text-center space-y-2"
            >
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#f0ede8]">
                Hey, I&apos;m Carlo{" "}
                <motion.span
                  animate={{ rotate: [0, 15, -5, 15, 0] }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="inline-block"
                >
                  👋
                </motion.span>
              </h1>
              <p className="font-mono text-sm text-[#8a8680] tracking-wide">
                AI Automation Specialist —{" "}
                <span className="text-[#00e5ff]">San Jose Del Monte, PH</span>
              </p>
              <p className="text-[#4a4744] text-sm max-w-[40ch] mx-auto leading-relaxed mt-1">
                10+ years automating the boring stuff so humans can focus on
                what matters.
              </p>
            </motion.div>

            {/* Suggestion chips */}
            <AnimatePresence>
              {showChips && (
                <motion.div
                  className="flex flex-wrap justify-center gap-2 max-w-md"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.07, delayChildren: 0.7 } },
                  }}
                >
                  {SUGGESTION_CHIPS.map((chip) => (
                    <motion.button
                      key={chip}
                      variants={{
                        hidden: { opacity: 0, y: 10, scale: 0.9 },
                        show: { opacity: 1, y: 0, scale: 1 },
                      }}
                      whileHover={{ scale: 1.04, borderColor: "rgba(0,229,255,0.4)" }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleChipClick(chip)}
                      className="px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[#8a8680] hover:text-[#f0ede8] text-xs font-mono tracking-wide transition-colors duration-200 cursor-pointer"
                    >
                      {chip}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat messages — shown once conversation starts */}
      <AnimatePresence>
        {hasStarted && (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col flex-1 overflow-hidden pt-16"
          >
            {/* Compact avatar header */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="flex items-center gap-3 px-6 py-3 border-b border-white/[0.04]"
            >
              <Avatar state={avatarState} size={44} />
              <div>
                <p className="text-sm font-semibold text-[#f0ede8]">Carlo Fonollera</p>
                <p className="font-mono text-[10px] text-[#00e5ff] tracking-widest uppercase">
                  {avatarState === "thinking"
                    ? "thinking..."
                    : avatarState === "replying"
                    ? "replying..."
                    : "online"}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <a
                  href="mailto:carlofonollera@gmail.com"
                  className="font-mono text-[10px] text-[#3a3835] hover:text-[#00e5ff] transition-colors flex items-center gap-1"
                >
                  <Mail size={11} />
                  Email
                </a>
                <a
                  href="https://www.linkedin.com/in/carlo-fonollera/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] text-[#3a3835] hover:text-[#00e5ff] transition-colors flex items-center gap-1"
                >
                  <Linkedin size={11} />
                  LinkedIn
                </a>
              </div>
            </motion.div>

            {/* Messages scroll area */}
            <div className="flex-1 overflow-y-auto chat-scroll px-4 md:px-8 py-5 space-y-4 max-w-3xl mx-auto w-full">
              {messages.map((m, i) => (
                <ChatMessage
                  key={m.id}
                  role={m.role as "user" | "assistant"}
                  content={m.content}
                  isStreaming={
                    isStreaming &&
                    i === messages.length - 1 &&
                    m.role === "assistant"
                  }
                />
              ))}

              {/* Typing indicator — only before first response token */}
              {isLoading && !lastMessageIsAssistant && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-[#0d1a22] border border-[#00e5ff]/15 rounded-2xl rounded-tl-sm px-4 py-3.5 flex gap-1.5 items-center shadow-[0_0_24px_rgba(0,229,255,0.06)]">
                    <span className="typing-dot w-2 h-2 rounded-full bg-[#00e5ff]/60" />
                    <span className="typing-dot w-2 h-2 rounded-full bg-[#00e5ff]/60" />
                    <span className="typing-dot w-2 h-2 rounded-full bg-[#00e5ff]/60" />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick chips in chat */}
            <AnimatePresence>
              {!isLoading && messages.length > 0 && messages.length < 10 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-2 overflow-x-auto px-4 md:px-8 pb-2 max-w-3xl mx-auto w-full no-scrollbar"
                  style={{ scrollbarWidth: "none" }}
                >
                  {SUGGESTION_CHIPS.slice(0, 4).map((chip, i) => (
                    <motion.button
                      key={chip}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.06 }}
                      whileHover={{ scale: 1.03, borderColor: "rgba(0,229,255,0.35)" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleChipClick(chip)}
                      className="shrink-0 px-3 py-1 rounded-full border border-white/08 bg-white/[0.02] text-[#4a4744] hover:text-[#8a8680] text-[11px] font-mono whitespace-nowrap transition-colors duration-200 cursor-pointer"
                    >
                      {chip}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat input — always at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: hasStarted ? 0 : 0.9, duration: 0.5 }}
        className="relative z-30 px-4 md:px-8 pb-6 pt-3 max-w-3xl mx-auto w-full"
      >
        <form onSubmit={onSubmit} className="relative">
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me anything about my projects, skills, experience…"
              disabled={isLoading}
              className="chat-input w-full bg-[#0c0c0c] border border-white/10 hover:border-white/16 focus:border-[#00e5ff]/40 rounded-2xl pl-5 pr-14 py-4 text-sm text-[#f0ede8] placeholder-[#3a3835] transition-all duration-200 font-sans disabled:opacity-50"
              style={{
                boxShadow: input
                  ? "0 0 0 1px rgba(0,229,255,0.15), 0 8px 32px rgba(0,0,0,0.4)"
                  : "0 8px 32px rgba(0,0,0,0.3)",
              }}
              autoComplete="off"
              autoFocus
            />
            <motion.button
              type="submit"
              disabled={isLoading || !input.trim()}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="absolute right-3 flex items-center justify-center w-9 h-9 rounded-xl bg-[#00e5ff] text-[#050505] disabled:opacity-30 disabled:cursor-not-allowed transition-opacity duration-200"
            >
              <Send size={15} strokeWidth={2} />
            </motion.button>
          </div>
        </form>

        {/* Footer meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex items-center justify-center gap-4 mt-3"
        >
          <span className="flex items-center gap-1 font-mono text-[10px] text-[#3a3835]">
            <MapPin size={9} />
            San Jose Del Monte, PH
          </span>
          <span className="font-mono text-[10px] text-[#3a3835]">·</span>
          <a
            href="mailto:carlofonollera@gmail.com"
            className="font-mono text-[10px] text-[#3a3835] hover:text-[#00e5ff] transition-colors"
          >
            carlofonollera@gmail.com
          </a>
          <span className="font-mono text-[10px] text-[#3a3835]">·</span>
          <span className="font-mono text-[10px] text-[#3a3835]">
            Powered by AI ✦
          </span>
        </motion.div>
      </motion.div>
    </main>
  );
}
