import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Landmark } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import FloralDecoration from "./FloralDecoration";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";
import { FrameCorners } from "./Ornaments";
import { assets } from "../data/assets";
import { wedding } from "../data/wedding";

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy method */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export default function GiftSection() {
  const [copied, setCopied] = useState<string | null>(null);
  const [toast, setToast] = useState<{ ok: boolean; text: string } | null>(null);
  const timer = useRef<number>(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleCopy = async (number: string) => {
    const ok = await copyText(number);
    setCopied(ok ? number : null);
    setToast(
      ok
        ? { ok, text: "Nomor rekening berhasil disalin." }
        : { ok, text: "Gagal menyalin. Silakan salin nomor secara manual." },
    );
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setToast(null);
      setCopied(null);
    }, 2600);
  };

  return (
    <section id="gift" className="section gift">
      <FloralDecoration
        src={assets.flowerCorner}
        className="gift-deco gift-tr"
        flip="x"
        origin="top right"
        float={5}
        opacity={0.9}
      />
      <FloralDecoration
        src={assets.flowerCorner}
        className="gift-deco gift-bl"
        flip="y"
        origin="bottom left"
        float={5}
        duration={12}
        opacity={0.9}
      />

      <div className="container">
        <SectionTitle script="Tanda Kasih" title="Wedding Gift">
          Doa restu Anda merupakan hadiah terindah bagi kami. Namun, apabila Anda ingin memberikan tanda kasih,
          kami menyediakan tanda kasih digital berikut.
        </SectionTitle>

        <div className="gift-grid">
          {wedding.accounts.map((acc, i) => (
            <Reveal key={acc.bank} delay={i * 0.15} y={36}>
              <article className="bank-card">
                <FrameCorners />
                <div className="bank-head">
                  <Landmark size={18} strokeWidth={1.3} aria-hidden="true" />
                  <h3 className="bank-name">{acc.bank}</h3>
                </div>
                <span className="bank-chip" aria-hidden="true" />
                <p className="bank-label">Nomor Rekening</p>
                <p className="bank-number">{acc.number}</p>
                <p className="bank-label">Atas Nama</p>
                <p className="bank-holder">{acc.holder}</p>
                <button type="button" className="btn btn--ghost bank-copy" onClick={() => handleCopy(acc.number)}>
                  {copied === acc.number ? (
                    <Check size={16} strokeWidth={1.8} aria-hidden="true" />
                  ) : (
                    <Copy size={16} strokeWidth={1.6} aria-hidden="true" />
                  )}
                  SALIN NOMOR REKENING
                </button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <div className="toast-wrap" role="status" aria-live="polite">
            <motion.div
              className={`toast ${toast.ok ? "" : "toast--error"}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.35 }}
            >
              {toast.ok && <Check size={16} strokeWidth={2} aria-hidden="true" />}
              {toast.text}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
