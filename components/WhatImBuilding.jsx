'use client';

import { useRef, useCallback } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import styles from '../styles/WhatImBuilding.module.css';

// Premium SVG Icons for the cards
const RocketIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#FCD34D' }}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </svg>
);

const LaptopIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#60A5FA' }}>
    <rect width="18" height="12" x="3" y="4" rx="2" ry="2"/>
    <line x1="2" x2="22" y1="20" y2="20"/>
    <polyline points="8 10 10 12 8 14"/>
    <line x1="12" x2="16" y1="14" y2="14"/>
  </svg>
);

const WaveIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#38BDF8' }}>
    <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
    <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
    <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
  </svg>
);

const PROJECTS = [
  {
    title: "HackPulse",
    desc: "AI Hackathon Copilot that helps teams build faster and smarter.",
    status: "In Progress",
    icon: RocketIcon
  },
  {
    title: "AI Dev Workspace",
    desc: "AI-powered workspace to write, debug and improve code faster.",
    status: "In Progress",
    icon: LaptopIcon
  },
  {
    title: "AquaSentinel",
    desc: "AI Flood Prediction and Alert System for safer communities.",
    status: "In Progress",
    icon: WaveIcon
  }
];

export default function WhatImBuilding() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' });

  // Mouse parallax for the avatar
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const handleMouseMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const cy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    mouseX.set(cx * 15);
    mouseY.set(cy * 10);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.3 + i * 0.15, duration: 0.6, ease: "easeOut" }
    })
  };

  const avatarVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { delay: 0.4, duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section 
      ref={sectionRef} 
      className={styles.section}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background effects */}
      <div className={styles.bgEffects}>
        <div className={styles.glowTopRight} />
        <div className={styles.glowBottomLeft} />
        <div className={styles.noise} />
      </div>

      <div className={styles.container}>
        
        {/* Left Column: Title & Cards */}
        <motion.div 
          className={styles.leftCol}
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2 className={styles.title}>What I'm Building Now</h2>
          <p className={styles.subtitle}>Always building. Always learning.</p>

          <div className={styles.cardsContainer}>
            {PROJECTS.map((proj, i) => (
              <motion.div 
                key={proj.title}
                className={styles.card}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                <div className={styles.cardGlow} />
                
                <div className={styles.cardIconWrapper}>
                  <proj.icon />
                </div>
                
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{proj.title}</h3>
                  <p className={styles.cardDesc}>{proj.desc}</p>
                  <span className={styles.badge}>{proj.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: 3D Avatar */}
        <motion.div 
          className={styles.rightCol}
          variants={avatarVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className={styles.avatarWrapper}>
            <div className={styles.avatarGlow} />
            <motion.div 
              style={{ x: springX, y: springY, width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
              <img 
                src="/building-avatar.png" 
                alt="Shreya Raut - Building Now" 
                className={styles.avatarImg} 
                draggable={false}
              />
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
