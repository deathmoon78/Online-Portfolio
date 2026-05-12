"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

type AvatarState = "idle" | "thinking" | "replying";

interface AvatarProps {
  state: AvatarState;
  size?: number;
}

// ─── Frame map (manually verified) ───────────────────────────────────────────
//  The video is a full 360° clockwise spin.
//
//  Frame   1  →  dead center, front-facing
//  Frame  32  →  turned to HIS right (mouse LEFT  → looks left  ✓)
//  Frame 130  →  turned to HIS left  (mouse RIGHT → looks right ✓)
//
//  The right arc (frame 1 → 130) goes BACKWARDS through the sequence:
//    1 → 192 → 191 → ... → 130
//  because going forwards (1 → 2 → ... → 130) passes through the back of head.
//
//  mouse LEFT   (0)   → frame  32   (via frames 32 → 1)
//  mouse CENTER (0.5) → frame   1
//  mouse RIGHT  (1)   → frame 130   (via frames 192 → 130)
// ─────────────────────────────────────────────────────────────────────────────

const TOTAL_FRAMES = 192;
const FRAME_PATH = (n: number) =>
  `/avatar-frames/frame_${String(n).padStart(4, "0")}.webp`;

const LEFT_FRAME   = 48;  // mouse far left
const CENTER_FRAME = 1;   // mouse center
const RIGHT_FRAME  = 130; // mouse far right (reached going backwards: 192→130)

// Preload left arc (1–32) + right arc (130–192)
const FRAMES_TO_LOAD = [
  ...Array.from({ length: 48 }, (_, i) => i + 1),          // 1–32
  ...Array.from({ length: 63 }, (_, i) => i + 130),         // 130–192
];

function mouseXToFrame(mouseX: number, viewportW: number): number {
  const ratio = Math.max(0, Math.min(1, mouseX / viewportW)); // 0=left, 1=right

  if (ratio <= 0.5) {
    // Left half: frames go 32 → 1 as mouse moves left → center
    // ratio 0   → frame 32
    // ratio 0.5 → frame 1
    const t = ratio / 0.5; // 0→1
    return Math.round(LEFT_FRAME + t * (CENTER_FRAME - LEFT_FRAME));
  } else {
    // Right half: frames go 192 → 130 as mouse moves center → right
    // We use 192 as the "center" anchor (same pose as frame 1) and go down to 130
    // ratio 0.5 → frame 192 (≈ frame 1, front-facing)
    // ratio 1   → frame 130
    const t = (ratio - 0.5) / 0.5; // 0→1
    return Math.round(TOTAL_FRAMES + t * (RIGHT_FRAME - TOTAL_FRAMES));
  }
}

export default function Avatar({ state, size = 160 }: AvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef(CENTER_FRAME);
  const rafRef    = useRef<number | null>(null);
  const cacheRef  = useRef<Record<number, HTMLImageElement>>({});
  const [loaded, setLoaded] = useState(false);

  const isThinking = state === "thinking";
  const isReplying = state === "replying";

  // ── Preload frames ───────────────────────────────────────────────────────────
  useEffect(() => {
    let completed = 0;
    const total = FRAMES_TO_LOAD.length;

    for (const n of FRAMES_TO_LOAD) {
      const img = new Image();
      img.src = FRAME_PATH(n);
      img.onload = img.onerror = () => {
        cacheRef.current[n] = img;
        completed++;
        if (completed === total) setLoaded(true);
      };
    }
  }, []);

  // ── Draw frame onto canvas ───────────────────────────────────────────────────
  // Source: 720×1280 portrait — crop top 65% to get face + shoulders in square
  const drawFrame = useCallback((n: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = cacheRef.current[n];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const srcW  = img.naturalWidth;
    const srcH  = img.naturalHeight;
    const cropH = Math.round(srcH * 0.65);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, srcW, cropH, 0, 0, canvas.width, canvas.height);
  }, []);

  // ── Draw center frame once loaded ────────────────────────────────────────────
  useEffect(() => {
    if (loaded) drawFrame(CENTER_FRAME);
  }, [loaded, drawFrame]);

  // ── Mouse + touch tracking ───────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;

    const onMouseMove = (e: MouseEvent) => {
      const next = mouseXToFrame(e.clientX, window.innerWidth);
      if (next === frameRef.current) return;
      frameRef.current = next;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => drawFrame(next));
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const next = mouseXToFrame(t.clientX, window.innerWidth);
      if (next === frameRef.current) return;
      frameRef.current = next;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => drawFrame(next));
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove",  onTouchMove,  { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove",  onTouchMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loaded, drawFrame]);

  // ── Redraw on state change ───────────────────────────────────────────────────
  useEffect(() => {
    if (loaded) drawFrame(frameRef.current);
  }, [state, loaded, drawFrame]);

  return (
    <motion.div
      className="relative select-none"
      style={{ width: size, height: size }}
      animate={
        state === "idle"
          ? { y: [0, -3, 0] }
          : state === "thinking"
          ? { rotate: -5, y: -3 }
          : { rotate: 2, y: -1 }
      }
      transition={
        state === "idle"
          ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
          : { type: "spring", stiffness: 120, damping: 14 }
      }
    >
      {/* Glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          boxShadow: isThinking
            ? [
                "0 0 28px rgba(0,229,255,0.18)",
                "0 0 56px rgba(0,229,255,0.38)",
                "0 0 28px rgba(0,229,255,0.18)",
              ]
            : isReplying
            ? "0 0 48px rgba(0,229,255,0.32)"
            : "0 0 22px rgba(0,229,255,0.10)",
        }}
        transition={{ duration: 1.5, repeat: isThinking ? Infinity : 0 }}
      />

      {/* Circular canvas */}
      <div
        className="w-full h-full rounded-full overflow-hidden"
        style={{
          background: "#0a0a0a",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {!loaded && (
          <div
            className="w-full h-full"
            style={{
              background: "linear-gradient(90deg,#111 25%,#1c1c1c 50%,#111 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s linear infinite",
            }}
          />
        )}
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="w-full h-full"
          style={{ display: loaded ? "block" : "none" }}
        />
      </div>

      {/* Thinking dots */}
      {isThinking && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]"
              animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.18,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Status dot */}
      <motion.div
        className="absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-[#050505]"
        animate={{
          backgroundColor: isThinking
            ? ["#00e5ff", "#0077ff", "#00e5ff"]
            : isReplying
            ? "#00e5ff"
            : "#22c55e",
        }}
        transition={{ duration: 1, repeat: isThinking ? Infinity : 0 }}
      />
    </motion.div>
  );
}
