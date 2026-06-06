'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import styles from '../styles/AboutMe.module.css';

/* ─── Terminal data ─────────────────────────────────────── */
const TERMINAL_LINES = [
  { label: 'Name',     value: 'Shreya Raut' },
  { label: 'Role',     value: 'Full Stack Developer' },
  { label: 'Location', value: 'Mumbai, India' },
  { label: 'Focus',    value: 'AI + Web Development' },
  { label: 'Mission',  value: 'Building products that\n            solve real problems' },
];

const STATS = [
  { number: '2+',  label: 'Years Learning' },
  { number: '5+', label: 'Projects Built' },
  { number: '15+',  label: 'Hackathons' },
  { number: '∞',   label: 'Curiosity' },
];

/* ─── Typing hook ───────────────────────────────────────── */
function useTypingEffect(lines, started) {
  const [displayed, setDisplayed] = useState([]);
  const [current,   setCurrent]   = useState(0);
  const [charIdx,   setCharIdx]   = useState(0);
  const [done,      setDone]      = useState(false);

  useEffect(() => {
    if (!started) return;
    if (done) return;
    if (current >= lines.length) { setDone(true); return; }

    const fullText = `${lines[current].label}: ${lines[current].value}`;

    if (charIdx < fullText.length) {
      const speed = 28 + Math.random() * 22;
      const t = setTimeout(() => setCharIdx(c => c + 1), speed);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setDisplayed(d => [...d, fullText]);
        setCurrent(c => c + 1);
        setCharIdx(0);
      }, 280);
      return () => clearTimeout(t);
    }
  }, [started, current, charIdx, done, lines]);

  const activeText = done
    ? null
    : current < lines.length
      ? `${lines[current].label}: ${lines[current].value}`.slice(0, charIdx)
      : null;

  return { displayed, activeText, done };
}

/* ─── Floating particles ────────────────────────────────── */
function Particles({ count = 38 }) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      duration: 8 + Math.random() * 16,
      delay: Math.random() * 8,
      opacity: 0.15 + Math.random() * 0.35,
    }))
  ).current;

  return (
    <div className={styles.particles} aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className={styles.particle}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Render a terminal line (finished or active) ───────── */
function TerminalLineContent({ text }) {
  if (!text.includes(':')) {
    return <span className={styles.terminalKey}>{text}</span>;
  }
  const colonIdx = text.indexOf(':');
  const key = text.slice(0, colonIdx);
  const val = text.slice(colonIdx + 2); // skip ": "

  return (
    <>
      <span className={styles.terminalKey}>{key}</span>
      <span className={styles.terminalColon}>:&nbsp;</span>
      <span className={styles.terminalVal}>{val}</span>
    </>
  );
}

/* ─── Main Component ────────────────────────────────────── */
export default function AboutMe() {
  const sectionRef = useRef(null);
  const isInView   = useInView(sectionRef, { once: true, margin: '-10%' });

  /* Mouse-follow parallax */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 18 });

  const handleMouseMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
    const cy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
    mouseX.set(cx * 14);
    mouseY.set(cy * 10);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const { displayed, activeText, done } = useTypingEffect(TERMINAL_LINES, isInView);

  const avatarVariants = {
    hidden:  { x: 110, opacity: 0 },
    visible: { x: 0,    opacity: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
  };

  const terminalVariants = {
    hidden:  { x: -60, opacity: 0 },
    visible: { x: 0,   opacity: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 } },
  };

  const headingVariants = {
    hidden:  { y: 30, opacity: 0 },
    visible: { y: 0,  opacity: 1, transition: { duration: 0.8, ease: 'easeOut', delay: 0.15 } },
  };

  const statsVariants = (i) => ({
    hidden:  { y: 40, opacity: 0 },
    visible: { y: 0,  opacity: 1, transition: { duration: 0.65, ease: 'easeOut', delay: 0.2 + i * 0.12 } },
  });

  return (
    <section
      ref={sectionRef}
      id="about"
      className={styles.section}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background layers */}
      <div className={styles.bgGradient}   aria-hidden="true" />
      <div className={styles.bgGrid}       aria-hidden="true" />
      <div className={styles.spotlight}    aria-hidden="true" />
      <Particles />

      {/* Eyebrow / Layout matching */}
      <div className={styles.navHeader}>
        <span className={styles.navLogo}>&lt; About Me</span>
      </div>

      <div className={styles.container}>

        {/* ── LEFT: Content ── */}
        <div className={styles.contentCol}>

          {/* Heading — matches reference: italic "Hello! I'm" + bold "Shreya Raut" */}
          <motion.div
            variants={headingVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <h2 className={styles.heading}>
              <span className={styles.helloLine}>Hello! I&apos;m</span>
              <span className={styles.nameLine}>Shreya Raut</span>
            </h2>
            <p className={styles.subheading}>
              Full Stack Developer &nbsp;|&nbsp; AI Enthusiast
            </p>
          </motion.div>

          {/* Terminal card — developer profile */}
          <motion.div
            className={styles.terminal}
            variants={terminalVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <div className={styles.terminalBody}>
              {/* Prompt: > Developer Profile */}
              <p className={styles.terminalPrompt}>
                <span className={styles.promptSymbol}>&gt;&nbsp;</span>
                <span className={styles.promptCmd}>Developer Profile</span>
              </p>

              {/* Output lines */}
              <div className={styles.terminalOutput}>
                {displayed.map((line, i) => (
                  <div key={i} className={styles.terminalLine}>
                    <TerminalLineContent text={line} />
                  </div>
                ))}

                {/* Currently typing line */}
                {activeText && (
                  <div className={styles.terminalLine}>
                    <span className={styles.terminalActive}>
                      <TerminalLineContent text={activeText} />
                    </span>
                    <span className={styles.cursor} aria-hidden="true">_</span>
                  </div>
                )}

                {/* Done — show blinking cursor on empty prompt */}
                {done && (
                  <div className={styles.terminalLine} style={{ marginTop: '0.8rem' }}>
                    <span className={styles.promptSymbol}>&gt;&nbsp;</span>
                    <span className={styles.cursor} aria-hidden="true">_</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Stats row ── */}
          <div className={styles.statsRow}>
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                className={styles.statCard}
                variants={statsVariants(i)}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                whileHover={{ scale: 1.07, y: -4 }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              >
                <span className={styles.statNumber}>{stat.number}</span>
                <span className={styles.statLabel}>{stat.label}</span>
                <div className={styles.statGlow} aria-hidden="true" />
              </motion.div>
            ))}
          </div>

        </div>

        {/* ── RIGHT: Avatar ── */}
        <motion.div
          className={styles.avatarCol}
          variants={avatarVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <div className={styles.avatarGlow} aria-hidden="true" />
          <div className={styles.glassRing} aria-hidden="true" />

          <motion.div
            className={styles.avatarWrapper}
            style={{ x: springX, y: springY }}
            animate={{ y: [0, -14, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
          >
            <img
              src="/about-avatar-new.png"
              alt="Shreya Raut Avatar"
              className={styles.avatarImg}
              draggable="false"
            />
            <div className={styles.avatarShimmer} aria-hidden="true" />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
