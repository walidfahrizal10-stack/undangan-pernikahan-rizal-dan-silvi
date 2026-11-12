import { motion, useReducedMotion, type MotionStyle } from "framer-motion";

interface Props {
  src: string;
  className?: string;
  /** Mirror the illustration */
  flip?: "x" | "y" | "both";
  /** Reveal delay (seconds) */
  delay?: number;
  /** Floating amplitude in px (0 = static) */
  float?: number;
  /** Seconds per float cycle */
  duration?: number;
  /** transform-origin used by the "bloom" reveal (e.g. "top left") */
  origin?: string;
  /** Extra motion styles, e.g. parallax x/y motion values */
  motionStyle?: MotionStyle;
  opacity?: number;
}

const FLIPS = {
  x: "scaleX(-1)",
  y: "scaleY(-1)",
  both: "scale(-1, -1)",
} as const;

/**
 * Transparent PNG illustration with a soft "bloom" reveal, optional gentle floating
 * and parallax. The PNG files are real RGBA, so nothing is blended or masked in CSS.
 */
export default function FloralDecoration({
  src,
  className = "",
  flip,
  delay = 0,
  float = 0,
  duration = 9,
  origin = "center",
  motionStyle,
  opacity = 1,
}: Props) {
  const reduce = useReducedMotion();

  return (
    <div
      className={`deco ${className}`}
      style={{ transform: flip ? FLIPS[flip] : undefined }}
      aria-hidden="true"
    >
      <motion.div
        className="deco-inner"
        style={{ transformOrigin: origin, ...motionStyle }}
        initial={reduce ? false : { opacity: 0, scale: 0.88 }}
        whileInView={{ opacity, scale: 1 }}
        viewport={{ once: true, amount: 0.02 }}
        transition={{ duration: 2.2, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.img
          src={src}
          alt=""
          draggable={false}
          decoding="async"
          className="decorative-image"
          animate={
            float && !reduce
              ? { y: [0, -float, 0], rotate: [0, float / 7, 0] }
              : undefined
          }
          transition={{ duration, repeat: Infinity, ease: "easeInOut", delay: delay + 1 }}
        />
      </motion.div>
    </div>
  );
}
