'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from '../styles/AIAssistant.module.css';

const SUGGESTED_CHIPS = [
  "Who is Shreya?",
  "What projects has she built?",
  "Top technical skills?",
  "Contact info?",
  "What makes her unique?"
];

// Simple SVG Send icon
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px', marginLeft: '-2px' }}>
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! I'm the AI brain of Shreya's portfolio. Ask me anything about her experience, skills, or projects!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sectionRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isInView = useInView(sectionRef, { margin: "-20%", once: true });

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (messages.length > 1 || isTyping) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMsg = { role: 'user', text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();

      setMessages(prev => [...prev, { role: 'ai', text: data.response || data.error || "Sorry, I'm having trouble thinking right now." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Network error connecting to my AI brain." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <section ref={sectionRef} className={styles.section} id="ai-assistant">
      <div className={styles.bgGrid} />
      <div className={styles.ambientGlow1} />
      <div className={styles.ambientGlow2} />

      <div className={styles.container}>

        {/* Left Area: Chat */}
        <motion.div
          className={styles.chatArea}
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className={styles.header}>
            <h2 className={styles.title}>Ask Me Anything</h2>
            <p className={styles.subtitle}>Your AI Assistant</p>
          </div>

          <div className={styles.chatBox}>
            <div ref={messagesContainerRef} className={styles.messagesContainer}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  className={`${styles.messageRow} ${msg.role === 'user' ? styles.messageRowUser : styles.messageRowAi}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`${styles.messageBubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleAi}`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  className={`${styles.messageRow} ${styles.messageRowAi}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className={`${styles.messageBubble} ${styles.bubbleAi}`}>
                    <div className={styles.typingIndicator}>
                      <motion.span className={styles.dot} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                      <motion.span className={styles.dot} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                      <motion.span className={styles.dot} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className={styles.inputArea}>
              <input
                type="text"
                className={styles.input}
                placeholder="Ask something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
              />
              <button
                className={styles.sendBtn}
                onClick={() => handleSend(input)}
                disabled={isTyping || !input.trim()}
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Area: Avatar + Chips */}
        <motion.div
          className={styles.rightArea}
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <motion.div
            className={styles.avatarWrapper}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <img src="/ai-avatar-robot.png" alt="Shreya AI Avatar" className={styles.avatarImg} draggable={false} />
          </motion.div>

          <div className={styles.chipsContainer}>
            {SUGGESTED_CHIPS.map((chip, i) => (
              <motion.button
                key={i}
                className={styles.chip}
                onClick={() => handleSend(chip)}
                disabled={isTyping}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {chip}
              </motion.button>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
