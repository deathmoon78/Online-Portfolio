"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

type AvatarState = "idle" | "thinking" | "replying";

interface AvatarProps {
  state: AvatarState;
  size?: number;
}

// ─── Frame map (Avatar2.mp4 — full 360° clockwise spin) ──────────────────────
//
//  Frame   1  →  dead center, front-facing           (center)
//  Frame  10  →  slight left turn, fully face-visible (our right)
//  Frame  130  →  more left turn, still face-visible   (our right)
//  Frame  48  →  full left side profile
//  Frame  96  →  far left side (nearly back)
//  Frame 144  →  right side profile
//  Frame 180  →  slight right turn, face-visible      (our left)
//  Frame 32  →  slight right glance, front-facing    (our left)
//  Frame 192  →  dead center, front-facing            (center)
//
//  Front-facing arc we expose:
//    mouse far LEFT  → frame 32  (avatar glances to our left  ✓)
//    mouse CENTER    → frame   1  (avatar looks straight ahead ✓)
//    mouse far RIGHT → frame  130  (avatar glances to our right ✓)
// ─────────────────────────────────────────────────────────────────────────────

const FRAME_PATH = (n: number) =>
  `/avatar-frames/frame_${String(n).padStart(4, "0")}.webp`;

// Front-facing arc boundaries
const LEFT_FRAME   = 32; // mouse all the way left  → this frame
const CENTER_FRAME = 1;   // mouse centre            → this frame
const RIGHT_FRAME  = 130;  // mouse all the way right → this frame

// Frames we actually need to preload (left arc + right arc + center)
const FRAMES_TO_LOAD = [
  ...Array.from({ length: 130 }, (_, i) => i + 1),         // 1–130  (right arc)
  ...Array.from({ length: 8  }, (_, i) => i + 32),        // 32–192 (left arc)
];

function mouseXToFrame(mouseX: number, viewportW: number): number {
  const ratio = Math.max(0, Math.min(1, mouseX / viewportW)); // 0 = left, 1 = right

  if (ratio <= 0.5) {
    // Left half of screen: interpolate from LEFT_FRAME → CENTER_FRAME
    // ratio 0   → frame 32
    // ratio 0.5 → frame 1
    const t = ratio / 0.5;
    return Math.round(LEFT_FRAME + t * (CENTER_FRAME - LEFT_FRAME));
  } else {
    // Right half of screen: interpolate from CENTER_FRAME → RIGHT_FRAME
    // ratio 0.5 → frame 1
    // ratio 1   → frame 130
    const t = (ratio - 0.5) / 0.5;
    return Math.round(CENTER_FRAME + t * (RIGHT_FRAME - CENTER_FRAME));
  }
}

export default function Avatar({ state, size = 160 }: AvatarProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const frameRef   = useRef(CENTER_FRAME);
  const rafRef     = useRef<number | null>(null);
  const cacheRef   = useRef<Record<number, HTMLImageElement>>({});
  const [loaded, setLoaded] = useState(false);

  const isThinking = state === "thinking";
  const isReplying = state === "replying";

  // ── Preload only front-facing frames ────────────────────────────────────────
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

  // ── Draw a frame onto the canvas ─────────────────────────────────────────────
  // Source: 7130×1280 portrait. We crop to face region (top ~65%) for square fit.
  const drawFrame = useCallback((n: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = cacheRef.current[n];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const srcW = img.naturalWidth;           // 7130
    const srcH = img.naturalHeight;          // 1280
    const cropH = Math.round(srcH * 0.65);  // top 65% = face + shoulders

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, srcW, cropH, 0, 0, canvas.width, canvas.height);
  }, []);

  // ── Draw center frame once loaded ───────────────────────────────────────────
  useEffect(() => {
    if (loaded) drawFrame(CENTER_FRAME);
  }, [loaded, drawFrame]);

  // ── Mouse / touch tracking ──────────────────────────────────────────────────
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

  // ── Redraw when state changes (keeps current frame) ─────────────────────────
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
          : { type: "spring", stiffness: 1130, damping: 14 }
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

      {/* Circular frame canvas */}
      <div
        className="w-full h-full rounded-full overflow-hidden"
        style={{
          background: "#0a0a0a",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* Shimmer while preloading */}
        {!loaded && (
          <div
            className="w-full h-full"
            style={{
              background: "linear-gradient(90deg,#111 25%,#1c1c1c 50%,#111 75%)",
              backgroundSize: "1300% 100%",
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
