"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

// Very simple markdown renderer — bold, code, lists
function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    // Code block (single line `code`)
    const processed = line.replace(/`([^`]+)`/g, (_, code) => (
      `<code class="font-mono text-[#00e5ff] bg-white/5 px-1.5 py-0.5 rounded text-[0.8em]">${code}</code>`
    ) as unknown as string);

    // Bold **text**
    const boldProcessed = processed.replace(/\*\*([^*]+)\*\*/g, (_, t) => (
      `<strong class="text-[#f0ede8] font-semibold">${t}</strong>`
    ) as unknown as string);

    if (line.startsWith("- ") || line.startsWith("• ")) {
      elements.push(
        <li key={i} className="flex gap-2 items-start text-[#c8c4be] leading-relaxed">
          <span className="text-[#00e5ff] mt-1.5 shrink-0">▸</span>
          <span dangerouslySetInnerHTML={{ __html: boldProcessed.slice(2) }} />
        </li>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p
          key={i}
          className="text-[#c8c4be] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: boldProcessed }}
        />
      );
    }
  });

  return elements;
}

export default function ChatMessage({
  role,
  content,
  isStreaming,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 16 }}
      className={clsx(
        "flex w-full gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={clsx(
          "relative max-w-[80%] md:max-w-[65%] px-4 py-3 rounded-2xl text-sm",
          isUser
            ? "bg-white/10 border border-white/10 text-[#f0ede8] rounded-tr-sm"
            : "bg-[#0d1a22] border border-[#00e5ff]/15 rounded-tl-sm",
          !isUser && "shadow-[0_0_24px_rgba(0,229,255,0.06)]"
        )}
      >
        {/* Cyan glow line for assistant */}
        {!isUser && (
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00e5ff]/30 to-transparent rounded-t-2xl" />
        )}

        <div className={clsx("space-y-1", !isUser && "text-[#c8c4be]")}>
          {isUser ? (
            <p>{content}</p>
          ) : (
            <>
              {renderMarkdown(content)}
              {isStreaming && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="inline-block w-0.5 h-4 bg-[#00e5ff] ml-0.5 align-middle"
                />
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
