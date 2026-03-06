import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useMemo, useRef } from "react";

type MagneticProps = {
  children: React.ReactNode;
  className?: string;
  strength?: number; // px
};

export function Magnetic({ children, className, strength = 14 }: MagneticProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.3 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.3 });

  const allow = useMemo(() => !reduce, [reduce]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={allow ? { x, y } : undefined}
      onPointerMove={(e) => {
        if (!allow || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        mx.set((dx / rect.width) * strength);
        my.set((dy / rect.height) * strength);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

