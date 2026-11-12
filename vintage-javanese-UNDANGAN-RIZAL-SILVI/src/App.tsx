import { AnimatePresence, MotionConfig } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import OpeningScreen from "./components/OpeningScreen";
import HeroSection from "./components/HeroSection";
import CoupleSection from "./components/CoupleSection";
import Countdown from "./components/Countdown";
import EventSection from "./components/EventSection";
import GallerySection from "./components/GallerySection";
import GiftSection from "./components/GiftSection";
import RSVPSection from "./components/RSVPSection";
import GuestbookSection from "./components/GuestbookSection";
import FooterSection from "./components/FooterSection";
import MusicPlayer from "./components/MusicPlayer";
import NavBar from "./components/NavBar";
import { useAudio } from "./hooks/useAudio";
import { getGuestName } from "./hooks/useGuestName";
import { wedding } from "./data/wedding";

export default function App() {
  const [opened, setOpened] = useState(false);
  const guestName = useMemo(() => getGuestName(), []);
  const hasGuest = new URLSearchParams(window.location.search).has("to");
  const audio = useAudio(wedding.music);

  // Lock scroll while the opening screen is visible
  useEffect(() => {
    document.documentElement.style.overflow = opened ? "" : "hidden";
    document.body.style.overflow = opened ? "" : "hidden";
  }, [opened]);

  // Warm up the main photo while the guest reads the opening screen
  useEffect(() => {
    const img = new Image();
    img.src = wedding.mainPhoto;
  }, []);

  const handleOpen = useCallback(() => {
    void audio.play(); // user gesture -> allowed by browsers
    setOpened(true);
  }, [audio]);

  // Once opened, jump to the main section of the invitation
  useEffect(() => {
    if (!opened) return;
    window.scrollTo({ top: 0, behavior: "auto" });
    document.getElementById("home")?.scrollIntoView({ behavior: "auto", block: "start" });
  }, [opened]);

  const formName = hasGuest ? guestName : "";

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {!opened && <OpeningScreen key="opening" guestName={guestName} onOpen={handleOpen} />}
      </AnimatePresence>

      {opened && (
        <>
          <main className="invitation">
            <HeroSection />
            <CoupleSection />
            <Countdown />
            <EventSection />
            <GallerySection />
            <GiftSection />
            <RSVPSection guestName={formName} />
            <GuestbookSection guestName={formName} />
            <FooterSection />
          </main>
          <NavBar />
          <MusicPlayer playing={audio.playing} available={audio.available} onToggle={audio.toggle} />
        </>
      )}
    </MotionConfig>
  );
}
