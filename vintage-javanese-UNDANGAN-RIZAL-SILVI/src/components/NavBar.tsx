import { CalendarHeart, Gift, Heart, House, Image as ImageIcon, Mail } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { useEffect, useState, type MouseEvent } from "react";
import { navItems } from "../data/wedding";

const icons = {
  home: House,
  mempelai: Heart,
  acara: CalendarHeart,
  galeri: ImageIcon,
  gift: Gift,
  rsvp: Mail,
} as const;

export default function NavBar() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    const els = navItems
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setActive(en.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <nav className="navbar" aria-label="Navigasi undangan">
      <ul>
        {navItems.map((n) => {
          const Icon = icons[n.id];
          return (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                onClick={go(n.id)}
                className={active === n.id ? "is-active" : ""}
                aria-current={active === n.id ? "true" : undefined}
              >
                <Icon size={18} strokeWidth={1.4} aria-hidden="true" />
                <span>{n.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
