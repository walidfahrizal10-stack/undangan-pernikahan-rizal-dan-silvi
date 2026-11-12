import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { MailOpen } from "lucide-react";
import { useEffect } from "react";
import FloralDecoration from "./FloralDecoration";
import { assets } from "../data/assets";
import { wedding } from "../data/wedding";

interface Props {
  guestName: string;
  onOpen: () => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 18, filter: "blur(5px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 1.2, delay, ease },
});

export default function OpeningScreen({ guestName, onOpen }: Props) {
  const reduce = useReducedMotion();

  // Very soft pointer parallax for the leaves / flowers
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 40, damping: 18 });
  const sy = useSpring(py, { stiffness: 40, damping: 18 });
  const tlX = useTransform(sx, (v) => v * 14);
  const tlY = useTransform(sy, (v) => v * 10);
  const brX = useTransform(sx, (v) => v * -12);
  const brY = useTransform(sy, (v) => v * -9);
  const pkX = useTransform(sx, (v) => v * 8);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth - 0.5) * 2);
      py.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py, reduce]);

  return (
    <motion.div
      className="opening"
      role="dialog"
      aria-label="Pembuka undangan pernikahan"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06, filter: "blur(6px)" }}
      transition={{ duration: 1.2, ease }}
    >
      <div className="opening-wash" aria-hidden="true" />

      <FloralDecoration
        src={assets.flowerCorner}
        className="op-deco op-tl"
        origin="top left"
        delay={0.5}
        float={7}
        duration={10}
        motionStyle={{ x: tlX, y: tlY }}
      />
      <FloralDecoration
        src={assets.flowerCorner}
        className="op-deco op-br"
        flip="both"
        origin="bottom right"
        delay={0.8}
        float={6}
        duration={11}
        motionStyle={{ x: brX, y: brY }}
      />
      <FloralDecoration
        src={assets.peacock}
        className="op-deco op-peacock"
        flip="x"
        origin="bottom center"
        delay={1.2}
        float={4}
        duration={12}
        motionStyle={{ x: pkX }}
      />

      <div className="opening-frame" aria-hidden="true" />

      <div className="opening-content">
        <motion.img
          src={assets.gunungan}
          alt=""
          className="decorative-image op-gunungan"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, delay: 0.9, ease }}
        />

        <motion.p className="op-eyebrow" {...reveal(1.4)}>
          THE WEDDING OF
        </motion.p>

        <motion.h1 className="op-names" {...reveal(1.7)}>
          <span>{wedding.groom.fullName}</span>
          <span className="op-amp">&amp;</span>
          <span>{wedding.bride.fullName}</span>
        </motion.h1>

        <motion.p className="op-date" {...reveal(2.0)}>
          {wedding.dateShort}
        </motion.p>

        <motion.div className="op-guest" {...reveal(2.3)}>
          <p>Kepada Yth.</p>
          <p className="op-guest-name">{guestName}</p>
          <p>Anda diundang ke acara pernikahan kami.</p>
        </motion.div>

        <motion.button type="button" className="btn btn--primary op-btn" onClick={onOpen} {...reveal(2.7)}>
          <MailOpen size={16} strokeWidth={1.6} aria-hidden="true" />
          BUKA UNDANGAN
        </motion.button>
      </div>
    </motion.div>
  );
}
