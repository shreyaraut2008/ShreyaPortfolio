'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import styles from '../styles/ContactSection.module.css';

/* ─── Terminal typing sequence ────────────────────────────── */
const CONTACT_INFO = [
  { label: 'Email:', value: 'shreyaraut432@gmail.com', href: 'mailto:shreyaraut432@gmail.com' },
  { label: 'Email 2:', value: 'shreya08raut11@gmail.com', href: 'mailto:shreya08raut11@gmail.com' },
  { label: 'LinkedIn:', value: 'linkedin.com/in/shreya-raut-45a2b0375', href: 'https://www.linkedin.com/in/shreya-raut-45a2b0375' },
  { label: 'GitHub:', value: 'github.com/shreyaraut2008', href: 'https://github.com/shreyaraut2008' },
  { label: 'Location:', value: 'Mumbai, India' },
];

/* ─── Typing hook ───────────────────────────────────────── */
function useTerminalSequence(started) {
  const [phase, setPhase] = useState(0);
  // 0 = idle, 1 = typing "hire shreya", 2 = typing "Connecting...", 
  // 3 = show success, 4 = reveal contacts one by one, 5 = done

  const [typedHire, setTypedHire] = useState('');
  const [typedConnect, setTypedConnect] = useState('');
  const [visibleContacts, setVisibleContacts] = useState(0);

  const hireText = 'hire shreya';
  const connectText = 'Connecting...';

  useEffect(() => {
    if (!started) return;
    if (phase === 0) {
      setTimeout(() => setPhase(1), 600);
    }
  }, [started, phase]);

  // Phase 1: Type "hire shreya"
  useEffect(() => {
    if (phase !== 1) return;
    if (typedHire.length < hireText.length) {
      const t = setTimeout(() => {
        setTypedHire(hireText.slice(0, typedHire.length + 1));
      }, 60 + Math.random() * 40);
      return () => clearTimeout(t);
    } else {
      setTimeout(() => setPhase(2), 500);
    }
  }, [phase, typedHire]);

  // Phase 2: Type "Connecting..."
  useEffect(() => {
    if (phase !== 2) return;
    if (typedConnect.length < connectText.length) {
      const t = setTimeout(() => {
        setTypedConnect(connectText.slice(0, typedConnect.length + 1));
      }, 50 + Math.random() * 30);
      return () => clearTimeout(t);
    } else {
      setTimeout(() => setPhase(3), 800);
    }
  }, [phase, typedConnect]);

  // Phase 3: Show success
  useEffect(() => {
    if (phase !== 3) return;
    setTimeout(() => setPhase(4), 600);
  }, [phase]);

  // Phase 4: Reveal contacts one by one
  useEffect(() => {
    if (phase !== 4) return;
    if (visibleContacts < CONTACT_INFO.length) {
      const t = setTimeout(() => {
        setVisibleContacts(v => v + 1);
      }, 250);
      return () => clearTimeout(t);
    } else {
      setPhase(5);
    }
  }, [phase, visibleContacts]);

  return { phase, typedHire, typedConnect, visibleContacts };
}

/* ─── SVG Icons ─────────────────────────────────────────── */
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={styles.socialIcon}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={styles.socialIcon}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={styles.socialIcon}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.socialIcon}>
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

/* ─── Main Component ────────────────────────────────────── */
export default function ContactSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const cy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    mouseX.set(cx * 12);
    mouseY.set(cy * 8);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const { phase, typedHire, typedConnect, visibleContacts } = useTerminalSequence(isInView);

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
  };

  const avatarVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { delay: 0.3, duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={styles.section}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background */}
      <div className={styles.bgEffects}>
        <div className={styles.glowTop} />
        <div className={styles.glowBottom} />
        <div className={styles.noise} />
      </div>

      <div className={styles.container}>

        {/* ── LEFT: Title + Terminal ── */}
        <motion.div
          className={styles.leftCol}
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <h2 className={styles.title}>Let's Connect</h2>
          <p className={styles.subtitle}>
            Open to opportunities &amp;<br/>amazing collaborations!
          </p>

          {/* Terminal Card */}
          <div className={styles.terminal}>
            <div className={styles.terminalBody}>

              {/* > hire shreya */}
              {phase >= 1 && (
                <div className={styles.promptLine}>
                  <span className={styles.promptSymbol}>&gt;</span>
                  <span className={styles.promptText}>{typedHire}</span>
                  {phase === 1 && <span className={styles.cursor}>▋</span>}
                </div>
              )}

              {/* > Connecting... */}
              {phase >= 2 && (
                <div className={styles.promptLine}>
                  <span className={styles.promptSymbol}>&gt;</span>
                  <span className={styles.connectingText}>{typedConnect}</span>
                  {phase === 2 && <span className={styles.cursor}>▋</span>}
                </div>
              )}

              {/* > Connection established ✓ */}
              {phase >= 3 && (
                <motion.div
                  className={styles.successLine}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className={styles.successSymbol}>&gt;</span>
                  <span className={styles.successText}>Connection established</span>
                  <span className={styles.checkIcon}>✅</span>
                </motion.div>
              )}

              {/* Contact rows */}
              {phase >= 4 && (
                <div className={styles.contactRows}>
                  {CONTACT_INFO.slice(0, visibleContacts).map((item, i) => (
                    <motion.div
                      key={item.label}
                      className={styles.contactRow}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <span className={styles.contactLabel}>{item.label}</span>
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                          {item.value}
                        </a>
                      ) : (
                        <span className={styles.contactValue}>{item.value}</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Final blinking cursor */}
              {phase === 5 && (
                <div className={styles.promptLine} style={{ marginTop: '1rem' }}>
                  <span className={styles.promptSymbol}>&gt;</span>
                  <span className={styles.cursor}>▋</span>
                </div>
              )}
            </div>
          </div>

          {/* CTA Button */}
          {phase >= 5 && (
            <motion.a
              href="mailto:shreyaraut432@gmail.com"
              className={styles.ctaButton}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Let's Build Something Amazing ✨
              <span className={styles.ctaArrow}>→</span>
            </motion.a>
          )}
        </motion.div>

        {/* ── RIGHT: Avatar ── */}
        <motion.div
          className={styles.rightCol}
          variants={avatarVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <div className={styles.avatarWrapper}>
            <div className={styles.avatarGlow} />
            <motion.div
              style={{ x: springX, y: springY, width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            >
              <img
                src="/contact-avatar.png"
                alt="Shreya Raut waving"
                className={styles.avatarImg}
                draggable={false}
              />
            </motion.div>
          </div>
        </motion.div>

      </div>

      {/* ── Footer ── */}
      <motion.footer
        className={styles.footer}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className={styles.socialIcons}>
          <a href="https://github.com/shreyaraut2008" target="_blank" rel="noopener noreferrer">
            <motion.div whileHover={{ y: -3 }}><GitHubIcon /></motion.div>
          </a>
          <a href="https://www.linkedin.com/in/shreya-raut-45a2b0375" target="_blank" rel="noopener noreferrer">
            <motion.div whileHover={{ y: -3 }}><LinkedInIcon /></motion.div>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <motion.div whileHover={{ y: -3 }}><TwitterIcon /></motion.div>
          </a>
          <a href="mailto:shreyaraut432@gmail.com">
            <motion.div whileHover={{ y: -3 }}><MailIcon /></motion.div>
          </a>
        </div>
        <p className={styles.footerText}>
          Crafted with <span className={styles.heart}>❤️</span> using Next.js &amp; Tailwind CSS
          <br/>
          © 2026 Shreya Raut. All rights reserved.
        </p>
      </motion.footer>
    </section>
  );
}
