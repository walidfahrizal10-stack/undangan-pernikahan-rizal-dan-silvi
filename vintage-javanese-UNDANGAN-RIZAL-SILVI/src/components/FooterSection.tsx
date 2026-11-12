import FloralDecoration from "./FloralDecoration";
import Reveal from "./Reveal";
import { GoldDivider } from "./Ornaments";
import { assets } from "../data/assets";
import { wedding } from "../data/wedding";

export default function FooterSection() {
  return (
    <footer className="footer">
      <FloralDecoration
        src={assets.flowerCorner}
        className="ft-deco ft-tl"
        origin="top left"
        float={4}
        opacity={0.9}
      />
      <FloralDecoration
        src={assets.flowerCorner}
        className="ft-deco ft-tr"
        flip="x"
        origin="top right"
        float={4}
        duration={11}
        opacity={0.9}
      />
      <img src={assets.joglo} alt="" className="decorative-image ft-joglo" aria-hidden="true" loading="lazy" />

      <div className="footer-inner">
        <Reveal>
          <p className="eyebrow">TERIMA KASIH</p>
        </Reveal>
        <Reveal delay={0.15} blur>
          <p className="footer-names">Rizal &amp; Silvi</p>
        </Reveal>
        <Reveal delay={0.25}>
          <GoldDivider />
        </Reveal>
        <Reveal delay={0.35}>
          <p className="footer-text">
            Merupakan kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan
            doa restu.
          </p>
          <p className="footer-full">
            {wedding.groom.fullName} &amp; {wedding.bride.fullName}
          </p>
          <p className="footer-date">{wedding.dateLong}</p>
        </Reveal>
      </div>
    </footer>
  );
}
