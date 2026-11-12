import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import FloralDecoration from "./FloralDecoration";
import Photo from "./Photo";
import Reveal from "./Reveal";
import { FrameCorners, GoldDivider } from "./Ornaments";
import { assets } from "../data/assets";
import { wedding } from "../data/wedding";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const amp = reduce ? 0 : 1;
  const yCorner = useTransform(scrollYProgress, [0, 1], [0, -50 * amp]);
  const yPeacock = useTransform(scrollYProgress, [0, 1], [0, 70 * amp]);
  const yPhoto = useTransform(scrollYProgress, [0, 1], [0, -26 * amp]);

  return (
    <section id="home" ref={ref} className="hero">
      <div className="hero-batik" style={{ backgroundImage: `url(${assets.batik})` }} aria-hidden="true" />

      <FloralDecoration
        src={assets.flowerCorner}
        className="hero-deco hero-tl"
        origin="top left"
        float={6}
        duration={10}
        motionStyle={{ y: yCorner }}
      />
      <FloralDecoration
        src={assets.flowerCorner}
        className="hero-deco hero-br"
        flip="both"
        origin="bottom right"
        delay={0.3}
        float={6}
        duration={12}
        motionStyle={{ y: yCorner }}
      />

      <div className="hero-inner">
        <div className="hero-text">
          <Reveal blur>
            <p className="eyebrow">THE WEDDING OF</p>
          </Reveal>
          <Reveal delay={0.15} blur>
            <h1 className="hero-names">
              <span>Rizal</span>
              <span className="hero-amp">&amp;</span>
              <span>Silvi</span>
            </h1>
          </Reveal>
          <Reveal delay={0.3}>
            <GoldDivider />
          </Reveal>
          <Reveal delay={0.4}>
            <p className="hero-date">{wedding.dateLong}</p>
          </Reveal>
          <Reveal delay={0.5}>
            <p className="hero-note">
              Dengan penuh rasa syukur, kami mengundang Anda untuk berbagi kebahagiaan di hari pernikahan kami.
            </p>
          </Reveal>
        </div>

        <div className="hero-visual">
          <motion.div
            className="hero-photo"
            style={{ y: yPhoto }}
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="photo-arch">
              <Photo src={wedding.mainPhoto} alt="Foto Rizal dan Silvi" label="Foto utama pasangan" />
            </div>
            <FrameCorners />
          </motion.div>

          <FloralDecoration
            src={assets.peacock}
            className="hero-deco hero-peacock"
            origin="bottom center"
            delay={0.9}
            float={4}
            duration={13}
            motionStyle={{ y: yPeacock }}
          />
          <FloralDecoration
            src={assets.floralDecoration}
            className="hero-deco hero-posy"
            delay={1.2}
            float={3}
            duration={9}
          />
        </div>
      </div>
    </section>
  );
}
