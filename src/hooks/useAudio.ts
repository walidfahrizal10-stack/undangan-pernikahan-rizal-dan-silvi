import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Pemutar musik latar. Audio baru dibuat/dimuat saat pengguna berinteraksi
 * (klik "Buka Undangan" atau tombol musik), sehingga tidak ada autoplay.
 * Jika file belum tersedia, tidak ada error yang dilempar ke pengguna.
 */
export function useAudio(src: string) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);

  const getAudio = useCallback(() => {
    if (!ref.current) {
      const a = new Audio();
      a.loop = true;
      a.preload = "none";
      a.volume = 0.7;
      a.addEventListener("play", () => setPlaying(true));
      a.addEventListener("pause", () => setPlaying(false));
      a.addEventListener("error", () => {
        setAvailable(false);
        setPlaying(false);
      });
      a.src = src;
      ref.current = a;
    }
    return ref.current;
  }, [src]);

  const play = useCallback(async () => {
    try {
      const a = getAudio();
      if (a.error) {
        setAvailable(true);
        a.load();
      }
      await a.play();
    } catch {
      // Autoplay diblokir atau file tidak tersedia: abaikan, kontrol manual tetap ada.
      setPlaying(false);
    }
  }, [getAudio]);

  const pause = useCallback(() => {
    ref.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    if (ref.current && !ref.current.paused) pause();
    else void play();
  }, [pause, play]);

  useEffect(() => {
    return () => {
      ref.current?.pause();
      ref.current = null;
    };
  }, []);

  return { playing, available, play, pause, toggle };
}
