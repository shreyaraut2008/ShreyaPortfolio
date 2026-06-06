'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '../styles/VideoIntro.module.css';
import useHeroAutoScroll from '../hooks/useHeroAutoScroll';

const CinematicLayer = dynamic(() => import('./CinematicLayer'), { ssr: false });

export default function VideoIntro() {
  const videoRef = useRef(null);
  const bgVideoRef = useRef(null);
  const heroRef = useRef(null);
  const nameFirstRef = useRef(null);
  const nameLastRef = useRef(null);
  const taglineRef = useRef(null);
  const roleRef = useRef(null);
  const scrollRef = useRef(null);
  const soundHintRef = useRef(null);
  const overlayRef = useRef(null);

  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [soundHint, setSoundHint] = useState(true);

  const {
    isScrolling,
    hasAutoScrolled,
    userScrolled,
    showSkip,
    skipIntro,
  } = useHeroAutoScroll({
    videoRef: videoRef,
    targetId: 'about',
    delayMs: 500,
    scrollDuration: 1500,
  });

  // Auto-hide sound hint
  useEffect(() => {
    const t = setTimeout(() => setSoundHint(false), 4500);
    return () => clearTimeout(t);
  }, []);

  // GSAP entrance animations
  useEffect(() => {
    let ctx;

    async function initGSAP() {
      const g = await import('gsap');
      const gsap = g.gsap || g.default;
      const st = await import('gsap/ScrollTrigger');
      const ScrollTrigger = st.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay: 0.3 });

        // Fade in overlay (lift the veil)
        tl.to(overlayRef.current, {
          opacity: 0,
          duration: 1.8,
          ease: 'power2.inOut',
        });

        // Tagline
        tl.fromTo(
          taglineRef.current,
          { opacity: 0, y: 24, letterSpacing: '0.4em' },
          { opacity: 1, y: 0, letterSpacing: '0.22em', duration: 1.1, ease: 'power3.out' },
          '-=0.8'
        );

        // First name
        tl.fromTo(
          nameFirstRef.current,
          { opacity: 0, y: 60, skewY: 4 },
          { opacity: 1, y: 0, skewY: 0, duration: 1.2, ease: 'expo.out' },
          '-=0.6'
        );

        // Last name
        tl.fromTo(
          nameLastRef.current,
          { opacity: 0, y: 60, skewY: 4 },
          { opacity: 1, y: 0, skewY: 0, duration: 1.2, ease: 'expo.out' },
          '-=0.9'
        );

        // Role
        tl.fromTo(
          roleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
          '-=0.5'
        );

        // Scroll indicator
        tl.fromTo(
          scrollRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.3'
        );

        // Parallax on scroll
        gsap.to(heroRef.current, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }, heroRef);
    }

    initGSAP();

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    setSoundHint(false);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    playing ? v.pause() : v.play();
    setPlaying(!playing);
  };

  const scrollToNext = () => {
    const next = document.getElementById('about');
    if (next) next.scrollIntoView({ behavior: 'smooth' });
    else window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section ref={heroRef} className={styles.hero}>
      {/* Initial black cover (lifted by GSAP) */}
      <div ref={overlayRef} className={styles.initCover} />

      {/* Ambient blurred background video */}
      <div className={styles.bgVideoWrap}>
        <video
          ref={bgVideoRef}
          className={styles.bgVideo}
          src="/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* Cinematic gradient overlays */}
      <div className={styles.gradientBottom} />
      <div className={styles.gradientTop} />
      <div className={styles.gradientLeft} />
      <div className={styles.vignette} />

      {/* Foreground video */}
      <div className={styles.fgVideoWrap}>
        <video
          ref={videoRef}
          className={styles.fgVideo}
          src="/hero-video.mp4"
          autoPlay
          loop
          playsInline
        />
      </div>

      {/* Three.js cinematic layer */}
      <CinematicLayer />

      {/* Hero content */}
      <div className={styles.content}>
        <p ref={taglineRef} className={styles.tagline}>
          Creative Developer &nbsp;·&nbsp; Digital Craftsperson
        </p>

        <div className={styles.nameBlock}>
          <h1 ref={nameFirstRef} className={styles.nameFirst}>Shreya</h1>
          <h1 ref={nameLastRef} className={styles.nameLast}>Raut</h1>
        </div>

        <p ref={roleRef} className={styles.role}>
          Website Developer &nbsp;&mdash;&nbsp; Turning ideas into immersive digital experiences
        </p>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button
          className={styles.controlBtn}
          onClick={togglePlay}
          aria-label={playing ? 'Pause video' : 'Play video'}
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4l14 8-14 8V4z"/>
            </svg>
          )}
        </button>

        <button
          className={styles.controlBtn}
          onClick={toggleMute}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <line x1="23" y1="9" x2="17" y2="15"/>
              <line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          )}
        </button>
      </div>

      {/* Sound hint badge */}
      {soundHint && (
        <div ref={soundHintRef} className={styles.soundHint}>
          <span className={styles.soundDot} />
          Tap for sound
        </div>
      )}

      {/* Scroll indicator */}
      <button
        ref={scrollRef}
        className={`${styles.scrollIndicator} ${hasAutoScrolled || isScrolling || userScrolled ? styles.hidden : ''}`}
        onClick={scrollToNext}
        aria-label="Scroll to next section"
      >
        <span className={styles.scrollLabel}>Scroll</span>
        <span className={styles.scrollLine} />
      </button>

      {/* Skip Intro button */}
      {showSkip && !isScrolling && !userScrolled && !hasAutoScrolled && (
        <button
          className={styles.skipBtn}
          onClick={skipIntro}
          aria-label="Skip Intro"
        >
          Skip Intro
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}>
            <polyline points="13 17 18 12 13 7"></polyline>
            <polyline points="6 17 11 12 6 7"></polyline>
          </svg>
        </button>
      )}
    </section>
  );
}
