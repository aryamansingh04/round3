import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.35 });

  if (reduce) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-50 h-[3px] w-full origin-left bg-[linear-gradient(90deg,hsla(var(--primary)/0.65),hsla(var(--accent)/0.60))]"
      style={{ scaleX }}
    />
  );
}

