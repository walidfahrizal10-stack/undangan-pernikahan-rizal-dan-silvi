import type { ReactNode } from "react";
import Reveal from "./Reveal";
import { GoldDivider } from "./Ornaments";

interface Props {
  script: string;
  title: string;
  children?: ReactNode;
  align?: "center" | "left";
}

export default function SectionTitle({ script, title, children, align = "center" }: Props) {
  return (
    <header className={`section-title section-title--${align}`}>
      <Reveal blur>
        <span className="script-accent">{script}</span>
      </Reveal>
      <Reveal delay={0.12} blur>
        <h2 className="section-heading">{title}</h2>
      </Reveal>
      <Reveal delay={0.24}>
        <GoldDivider />
      </Reveal>
      {children && (
        <Reveal delay={0.32}>
          <p className="section-lead">{children}</p>
        </Reveal>
      )}
    </header>
  );
}
