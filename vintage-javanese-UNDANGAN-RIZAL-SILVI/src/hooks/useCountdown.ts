import { useEffect, useState } from "react";

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function calc(target: number): CountdownState {
  const diff = target - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: false,
  };
}

export function useCountdown(targetIso: string): CountdownState {
  const target = new Date(targetIso).getTime();
  const [state, setState] = useState<CountdownState>(() => calc(target));

  useEffect(() => {
    setState(calc(target));
    const id = window.setInterval(() => {
      const next = calc(target);
      setState(next);
      if (next.done) window.clearInterval(id);
    }, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return state;
}
