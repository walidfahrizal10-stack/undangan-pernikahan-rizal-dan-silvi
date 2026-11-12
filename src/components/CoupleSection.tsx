import FloralDecoration from "./FloralDecoration";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";
import { assets } from "../data/assets";
import { wedding } from "../data/wedding";

type Person = typeof wedding.groom | typeof wedding.bride;

function PersonCard({ person, side }: { person: Person; side: "groom" | "bride" }) {
  return (
    <Reveal className={`person person--${side}`} y={36}>
      <div className="monogram" aria-hidden="true">
        <FloralDecoration
          src={assets.floralDecoration}
          className="monogram-flora"
          flip={side === "bride" ? "x" : undefined}
          float={3}
          duration={10}
          delay={0.2}
        />
        <span className="monogram-ring">
          <span className="monogram-letter">{person.initial}</span>
        </span>
      </div>
      <p className="person-nick">{person.nickname}</p>
      <h3 className="person-name">{person.fullName}</h3>
      <p className="person-parent-label">{person.title}</p>
      <p className="person-parent">Informasi orang tua belum dicantumkan.</p>
    </Reveal>
  );
}

export default function CoupleSection() {
  return (
    <section id="mempelai" className="section couple">
      <FloralDecoration
        src={assets.flowerCorner}
        className="couple-deco couple-tr"
        flip="x"
        origin="top right"
        float={5}
        opacity={0.9}
      />
      <FloralDecoration
        src={assets.flowerCorner}
        className="couple-deco couple-bl"
        flip="y"
        origin="bottom left"
        float={5}
        duration={11}
        opacity={0.9}
      />

      <div className="container">
        <SectionTitle script="Mempelai" title="The Bride & The Groom" />

        <div className="couple-grid">
          <PersonCard person={wedding.groom} side="groom" />
          <Reveal className="couple-amp" delay={0.2}>
            <span aria-hidden="true">&amp;</span>
          </Reveal>
          <PersonCard person={wedding.bride} side="bride" />
        </div>
      </div>
    </section>
  );
}
