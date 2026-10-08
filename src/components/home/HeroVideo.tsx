"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const LOCAL_VIDEO = "/videos/hero-campeche.mp4";
const LOCAL_POSTER = "/videos/hero-campeche.jpg";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) {
      video.pause();
      return;
    }

    const markReady = () => setReady(true);

    const tryPlay = () => {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      const playback = video.play();
      if (playback) {
        void playback.then(markReady).catch(() => undefined);
      }
    };

    tryPlay();
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("playing", markReady);

    const onVisible = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", tryPlay);
    window.addEventListener("focus", tryPlay);
    window.addEventListener("pointerdown", tryPlay, { once: true, passive: true });

    if (video.readyState >= 2) tryPlay();
    else video.load();

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("playing", markReady);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", tryPlay);
      window.removeEventListener("focus", tryPlay);
      window.removeEventListener("pointerdown", tryPlay);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className={cn(
        "hero-video absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500",
        ready ? "opacity-100" : "opacity-0",
      )}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={LOCAL_POSTER}
      aria-hidden="true"
    >
      <source src={`${LOCAL_VIDEO}#t=0.001`} type="video/mp4" />
    </video>
  );
}
