import { useCountdown } from "../hooks/useCountdown";
import FloralDecoration from "./FloralDecoration";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";
import { FrameCorners } from "./Ornaments";
import { assets } from "../data/assets";
import { wedding } from "../data/wedding";

const pad = (n: number, len = 2) => String(n).padStart(len, "0");

export default function Countdown() {
  const c = useCountdown(wedding.countdownTarget);

  const units = [
    { label: "Hari", value: pad(c.days, c.days > 99 ? 3 : 2) },
    { label: "Jam", value: pad(c.hours) },
    { label: "Menit", value: pad(c.minutes) },
    { label: "Detik", value: pad(c.seconds) },
  ];

  return (
    <section className="section countdown" aria-labelledby="countdown-title">
      <img src={assets.gunungan} alt="" className="decorative-image cd-gunungan cd-gunungan--l" aria-hidden="true" />
      <img src={assets.gunungan} alt="" className="decorative-image cd-gunungan cd-gunungan--r" aria-hidden="true" />
      <FloralDecoration src={assets.floralDecoration} className="cd-flora" float={3} duration={11} />

      <div className="container">
        <SectionTitle script="Menghitung Hari" title="Save The Date">
          RABU, 6 JANUARI 2027
        </SectionTitle>
        <span id="countdown-title" className="sr-only">
          Hitung mundur menuju hari pernikahan
        </span>

        {c.done ? (
          <Reveal>
            <div className="cd-done">
              <FrameCorners />
              <p className="cd-done-script">Hari Bahagia Telah Tiba</p>
              <p>Terima kasih atas doa dan restu Anda.</p>
            </div>
          </Reveal>
        ) : (
          <div className="cd-grid" role="timer" aria-live="off">
            {units.map((u, i) => (
              <Reveal key={u.label} delay={0.1 * i} className="cd-box">
                <span className="cd-value">{u.value}</span>
                <span className="cd-label">{u.label}</span>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
