"use client";

import { useEffect, useRef } from "react";
import styles from "./marketing.module.css";

/** Night/day sky behind the hero: stars, moon/sun and two mountain ranges. */
const Parallax = () => {
  const stars = useRef<HTMLDivElement>(null);
  const orb = useRef<HTMLDivElement>(null);
  const far = useRef<HTMLDivElement>(null);
  const near = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layers: [React.RefObject<HTMLDivElement | null>, number][] = [[stars, 0.05], [orb, 0.18], [far, 0.12], [near, 0.25]];
    const onScroll = () => {
      const y = window.scrollY;
      for (const [ref, speed] of layers) {
        if (ref.current) ref.current.style.transform = `translateY(${y * speed}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className={styles.sky} />
      <div ref={stars} className={styles.stars} />
      <div ref={orb} className={styles.orb} />
      <div ref={far} className={styles.mountainFar} />
      <div ref={near} className={styles.mountainNear} />
      <div className={styles.scrim} />
    </>
  );
};

export default Parallax;
