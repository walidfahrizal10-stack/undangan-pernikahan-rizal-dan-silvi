import { Music, Pause, Play } from "lucide-react";

interface Props {
  playing: boolean;
  available: boolean;
  onToggle: () => void;
}

export default function MusicPlayer({ playing, available, onToggle }: Props) {
  const label = !available
    ? "Musik belum tersedia"
    : playing
      ? "Jeda musik"
      : "Putar musik";

  return (
    <button
      type="button"
      className={`music-player ${playing ? "is-playing" : ""} ${available ? "" : "is-unavailable"}`}
      onClick={onToggle}
      aria-label={label}
      title={label}
    >
      <Music className="music-disc" size={20} strokeWidth={1.4} aria-hidden="true" />
      <span className="music-badge" aria-hidden="true">
        {playing ? <Pause size={9} fill="currentColor" strokeWidth={0} /> : <Play size={9} fill="currentColor" strokeWidth={0} />}
      </span>
    </button>
  );
}
