'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from '../styles/SkillsGalaxy.module.css';

// SVG Icons
const ReactIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#61DAFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.nodeIcon}>
    <circle cx="12" cy="12" r="2" fill="#61DAFB"></circle>
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)"></ellipse>
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(150 12 12)"></ellipse>
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(90 12 12)"></ellipse>
  </svg>
);

const NodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#68A063" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.nodeIcon}>
    <path d="M12 2L2 8l10 6 10-6-10-6z" fill="#68A063" fillOpacity="0.2" />
    <path d="M2 16l10 6 10-6" />
    <path d="M12 14v10" />
    <path d="M2 8v8M22 8v8" />
  </svg>
);

const NextIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.nodeIcon}>
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="M15 15l-4-5H9v8h2v-4.5l3.5 4.5H16V9h-2v6z" fill="#FFFFFF" />
  </svg>
);

const MongoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#47A248" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.nodeIcon}>
    <path d="M12 2c0 0-4 4-4 10s4 10 4 10 4-4 4-10-4-10-4-10z" fill="#47A248" fillOpacity="0.3" />
  </svg>
);

const PythonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#3776AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.nodeIcon}>
    <path d="M12 2c-4 0-4 3-4 3v2h4v2H6s-4 0-4 4 0 4 4 4h2v-2s0-3 3-3h3s3 0 3-3V6s0-4-4-4z" fill="#FFD43B" fillOpacity="0.8" stroke="none" />
    <path d="M12 22c4 0 4-3 4-3v-2h-4v-2h6s4 0 4-4 0-4-4-4h-2v2s0 3-3 3h-3s-3 0-3 3v5s0 4 4 4z" fill="#3776AB" fillOpacity="0.8" stroke="none" />
  </svg>
);

const AiIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#FF6F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.nodeIcon}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12h20" />
  </svg>
);

const ORBITS = [
  {
    radius: 0,
    speed: 0,
    skills: [
      { id: 'aiml', name: 'AI / ML', angle: 0, icon: AiIcon, desc: 'Machine Learning Models' }
    ]
  },
  {
    radius: 180,
    speed: 35,
    skills: [
      { id: 'node', name: 'Node.js', angle: 180, icon: NodeIcon, desc: 'Backend Architecture' },
      { id: 'next', name: 'Next.js', angle: 0, icon: NextIcon, desc: 'Fullstack Framework' }
    ]
  },
  {
    radius: 320,
    speed: 50,
    skills: [
      { id: 'react', name: 'React', angle: 270, icon: ReactIcon, large: true, desc: 'Frontend Mastery' },
      { id: 'mongo', name: 'MongoDB', angle: 135, icon: MongoIcon, desc: 'NoSQL Database' },
      { id: 'python', name: 'Python', angle: 45, icon: PythonIcon, desc: 'Data & Scripting' }
    ]
  }
];

function OrbitingNode({ skill, radius, speed, isInView }) {
  const isCenter = radius === 0;
  const duration = speed;

  return (
    <motion.div 
      className={styles.orbitWrapper}
      initial={{ rotate: skill.angle }}
      animate={!isCenter && isInView ? { rotate: skill.angle - 360 } : { rotate: skill.angle }}
      transition={{ duration, ease: "linear", repeat: Infinity }}
    >
      <motion.div 
        className={styles.nodeCounterRotate}
        style={{ x: radius }}
        initial={{ rotate: -skill.angle }}
        animate={!isCenter && isInView ? { rotate: -(skill.angle - 360) } : { rotate: -skill.angle }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {/* Undo the 65deg tilt of the parent galaxy to perfectly face the camera */}
        <div style={{ transform: 'rotateX(-65deg)' }}>
          <div className={`${styles.node} ${skill.large ? styles.nodeLarge : ''}`}>
            <skill.icon />
            <span className={styles.nodeName}>{skill.name}</span>
            <div className={styles.tooltip}>{skill.desc}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SkillsGalaxy() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { margin: "-20%" });

  return (
    <section ref={sectionRef} className={styles.section} id="skills">
      
      <div className={styles.header}>
        <motion.h2 
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }}
        >
          My Tech Galaxy
        </motion.h2>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Hover over a skill to explore
        </motion.p>
      </div>

      <motion.div 
        className={styles.bottomText}
        initial={{ opacity: 0, x: -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        I build scalable, intelligent and<br/>beautiful web experiences.
      </motion.div>

      <motion.div 
        className={styles.galaxy3d}
        initial={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%", rotateX: 65 }}
        animate={isInView ? { opacity: 1, scale: 1, x: "-50%", y: "-50%", rotateX: 65 } : { opacity: 0, scale: 0.8, x: "-50%", y: "-50%", rotateX: 65 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {/* Render orbit rings */}
        {ORBITS.filter(o => o.radius > 0).map((orbit, i) => (
          <div 
            key={`ring-${i}`}
            className={styles.orbitRing}
            style={{
              width: orbit.radius * 2,
              height: orbit.radius * 2,
            }}
          />
        ))}

        {/* Render nodes */}
        {ORBITS.map(orbit => (
          orbit.skills.map((skill, index) => (
            <OrbitingNode 
              key={`${skill.id}-${index}`} 
              skill={skill} 
              radius={orbit.radius} 
              speed={orbit.speed} 
              isInView={isInView}
            />
          ))
        ))}
      </motion.div>

    </section>
  );
}
