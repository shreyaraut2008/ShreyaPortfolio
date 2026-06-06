'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * useHeroAutoScroll — Custom hook for cinematic auto-scroll after hero video ends.
 *
 * Features:
 * - Smooth-scrolls to target section when video ends (500ms delay)
 * - Detects manual scroll to cancel auto-scroll
 * - Skip intro button support
 * - Lenis smooth scrolling with easeInOut fallback
 * - Only triggers once per page load
 *
 * @param {Object}  options
 * @param {React.RefObject} options.videoRef   — ref to the <video> element
 * @param {string}  options.targetId           — id of the section to scroll to (default: 'about')
 * @param {number}  options.delayMs            — delay after video ends before scrolling (default: 500)
 * @param {number}  options.scrollDuration     — scroll animation duration in ms (default: 1500)
 */
export default function useHeroAutoScroll({
  videoRef,
  targetId = 'about',
  delayMs = 500,
  scrollDuration = 1500,
} = {}) {
  const [videoEnded, setVideoEnded]         = useState(false);
  const [isScrolling, setIsScrolling]       = useState(false);
  const [hasAutoScrolled, setHasAutoScrolled] = useState(false);
  const [userScrolled, setUserScrolled]     = useState(false);
  const [showSkip, setShowSkip]             = useState(true);

  const hasTriggeredRef  = useRef(false);   // prevent double-fire
  const scrollTimeoutRef = useRef(null);
  const manualScrollRef  = useRef(false);

  /* ─── Easing function (easeInOutCubic) ─────────────────── */
  const easeInOutCubic = (t) =>
    t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;

  /* ─── Smooth scroll implementation ─────────────────────── */
  const performCinematicScroll = useCallback(() => {
    const target = document.getElementById(targetId);
    if (!target || hasTriggeredRef.current) return;

    hasTriggeredRef.current = true;
    setIsScrolling(true);
    setShowSkip(false);

    // Try Lenis first
    if (typeof window !== 'undefined' && window.__lenis) {
      window.__lenis.scrollTo(target, {
        duration: scrollDuration / 1000,
        easing: easeInOutCubic,
        onComplete: () => {
          setIsScrolling(false);
          setHasAutoScrolled(true);
        },
      });
      return;
    }

    // Fallback: manual JS smooth scroll with easeInOut
    const startY = window.scrollY;
    const targetRect = target.getBoundingClientRect();
    const targetY = startY + targetRect.top;
    const distance = targetY - startY;
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / scrollDuration, 1);
      const easedProgress = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setIsScrolling(false);
        setHasAutoScrolled(true);
      }
    }

    requestAnimationFrame(step);
  }, [targetId, scrollDuration]);

  /* ─── Skip intro ───────────────────────────────────────── */
  const skipIntro = useCallback(() => {
    if (hasTriggeredRef.current) return;

    // Pause the video
    if (videoRef?.current) {
      videoRef.current.pause();
    }

    performCinematicScroll();
  }, [performCinematicScroll, videoRef]);

  /* ─── Video ended handler ──────────────────────────────── */
  useEffect(() => {
    const video = videoRef?.current;
    if (!video) return;

    const handleEnded = () => {
      setVideoEnded(true);

      // Don't auto-scroll if user already scrolled manually
      if (manualScrollRef.current || hasTriggeredRef.current) return;

      scrollTimeoutRef.current = setTimeout(() => {
        performCinematicScroll();
      }, delayMs);
    };

    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('ended', handleEnded);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [videoRef, delayMs, performCinematicScroll]);

  /* ─── Manual scroll detection ──────────────────────────── */
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = Math.abs(currentY - lastScrollY);

        // Only count as manual scroll if user scrolled significantly
        // and we haven't started auto-scrolling yet
        if (delta > 30 && !isScrolling && !hasTriggeredRef.current) {
          manualScrollRef.current = true;
          setUserScrolled(true);
          setShowSkip(false);

          // Cancel any pending auto-scroll
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
            scrollTimeoutRef.current = null;
          }
        }

        lastScrollY = currentY;
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolling]);

  /* ─── Cleanup ──────────────────────────────────────────── */
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    videoEnded,
    isScrolling,
    hasAutoScrolled,
    userScrolled,
    showSkip,
    skipIntro,
  };
}
