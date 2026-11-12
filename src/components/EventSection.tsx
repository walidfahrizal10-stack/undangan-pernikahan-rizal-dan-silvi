import { CalendarHeart, HeartHandshake, MapPin, PartyPopper } from "lucide-react";
import FloralDecoration from "./FloralDecoration";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";
import { FrameCorners } from "./Ornaments";
import { assets } from "../data/assets";
import { wedding } from "../data/wedding";

const icons = { akad: HeartHandshake, resepsi: PartyPopper } as const;

export default function EventSection() {
  return (
    <section id="acara" className="section event">
      <FloralDecoration
        src={assets.flowerCorner}
        className="event-deco event-tl"
        origin="top left"
        float={5}
        opacity={0.95}
      />
      <FloralDecoration
        src={assets.peacock}
        className="event-deco event-peacock"
        flip="x"
        origin="bottom left"
        float={3}
        duration={13}
      />

      <div className="container">
        <SectionTitle script="Hari Bahagia" title="Wedding Celebration" />

        <Reveal y={40}>
          <div className="event-card">
            <FrameCorners />

            <div className="event-date">
              <CalendarHeart size={20} strokeWidth={1.2} aria-hidden="true" />
              <p className="event-date-text">{wedding.dateLong}</p>
            </div>

            <div className="event-list">
              {wedding.events.map((ev, i) => {
                const Icon = icons[ev.key];
                return (
                  <div key={ev.key} className="event-item">
                    <span className="event-icon">
                      <Icon size={22} strokeWidth={1.2} aria-hidden="true" />
                    </span>
                    <h3 className="event-title">{ev.title}</h3>
                    <p className="event-time">{ev.time}</p>
                    {i === 0 && <span className="event-sep" aria-hidden="true" />}
                  </div>
                );
              })}
            </div>

            <div className="event-place">
              <MapPin size={18} strokeWidth={1.3} aria-hidden="true" />
              <p>Lokasi acara dapat dilihat melalui Google Maps</p>
              <a className="btn btn--primary" href={wedding.mapsUrl} target="_blank" rel="noopener noreferrer">
                <MapPin size={16} strokeWidth={1.6} aria-hidden="true" />
                BUKA GOOGLE MAPS
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      <img src={assets.joglo} alt="" className="decorative-image event-joglo" aria-hidden="true" loading="lazy" />
    </section>
  );
}
