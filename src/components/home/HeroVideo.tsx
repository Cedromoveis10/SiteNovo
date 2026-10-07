"use client";

import { useEffect, useRef, useState } from "react";
import { mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

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

    const play = () => {
      void video.play().catch(() => undefined);
    };

    play();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else video.pause();
      },
      { threshold: 0.2 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      className={cn(
        "hero-video absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700",
        ready ? "opacity-100" : "opacity-0",
      )}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={mediaUrl("/videos/hero-campeche.jpg")}
      aria-hidden="true"
      onPlaying={() => setReady(true)}
      onCanPlay={() => setReady(true)}
    >
      <source src={mediaUrl("/videos/hero-campeche.mp4")} type="video/mp4" />
    </video>
  );
}
