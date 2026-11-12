import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import FloralDecoration from "./FloralDecoration";
import Photo from "./Photo";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";
import { assets } from "../data/assets";
import { wedding } from "../data/wedding";

export default function GallerySection() {
  const photos = wedding.gallery;
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setActive((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active, close, step]);

  return (
    <section id="galeri" className="section gallery">
      <FloralDecoration
        src={assets.floralDecoration}
        className="gallery-deco gallery-deco--top"
        float={3}
        duration={12}
        opacity={0.85}
      />

      <div className="container container--wide">
        <SectionTitle script="Galeri" title="Our Moments" />

        <div className="gallery-grid">
          {photos.map((p, i) => (
            <Reveal key={p.src} delay={i * 0.12} y={34} className={`gallery-item gallery-item--${i + 1}`}>
              <button
                type="button"
                className="gallery-btn"
                onClick={() => setActive(i)}
                aria-label={`Perbesar foto ${i + 1}`}
              >
                <Photo src={p.src} alt={p.alt} lazy label={`Foto galeri ${i + 1}`} />
                <span className="gallery-zoom" aria-hidden="true">
                  <ZoomIn size={20} strokeWidth={1.4} />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Pratinjau foto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={close}
          >
            <button type="button" className="lb-btn lb-close" onClick={close} aria-label="Tutup">
              <X size={22} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              className="lb-btn lb-prev"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              aria-label="Foto sebelumnya"
            >
              <ChevronLeft size={26} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              className="lb-btn lb-next"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              aria-label="Foto berikutnya"
            >
              <ChevronRight size={26} strokeWidth={1.5} />
            </button>

            <AnimatePresence mode="wait">
              <motion.figure
                key={active}
                className="lb-figure"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Photo src={photos[active].src} alt={photos[active].alt} className="lb-img" label={`Foto galeri ${active + 1}`} />
                <figcaption>
                  {active + 1} / {photos.length}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
