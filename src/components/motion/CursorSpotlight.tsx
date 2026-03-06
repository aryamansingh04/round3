import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "framer-motion";
import { useEffect, useMemo } from "react";

type CursorSpotlightProps = {
  className?: string;
  /**
   * Set false to disable on touch devices too.
   */
  enabled?: boolean;
};

function isCoarsePointer() {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(pointer: coarse)").matches ?? false;
}

export function CursorSpotlight({ className, enabled = true }: CursorSpotlightProps) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const background = useMotionTemplate`radial-gradient(560px circle at ${x}px ${y}px, hsla(var(--primary) / 0.18), hsla(var(--primary) / 0.05) 38%, hsla(var(--primary) / 0.0) 68%)`;
  const noise = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, hsla(var(--accent) / 0.16), hsla(var(--accent) / 0.0) 62%)`;

  const allow = useMemo(() => enabled && !reduce && !isCoarsePointer(), [enabled, reduce]);

  useEffect(() => {
    if (!allow) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [allow, x, y]);

  if (!allow) return null;

  return (
    <div className={className}>
      <motion.div
        className="pointer-events-none fixed inset-0 z-10 opacity-[0.55] mix-blend-multiply"
        style={{ background }}
      />
      <motion.div
        className="pointer-events-none fixed inset-0 z-10 opacity-[0.18] mix-blend-overlay"
        style={{ background: noise }}
      />
    </div>
  );
}

