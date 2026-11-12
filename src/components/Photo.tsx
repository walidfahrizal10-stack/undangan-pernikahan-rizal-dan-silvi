import { useState } from "react";
import { Camera } from "lucide-react";

interface Props {
  src: string;
  alt: string;
  className?: string;
  lazy?: boolean;
  label?: string;
}

/** <img> with a graceful fallback if the photo file is missing. */
export default function Photo({ src, alt, className = "", lazy = false, label }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`photo-fallback ${className}`} role="img" aria-label={alt}>
        <Camera size={28} strokeWidth={1.2} />
        <span>{label ?? "Foto belum tersedia"}</span>
        <small>{src}</small>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={lazy ? "lazy" : "eager"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
