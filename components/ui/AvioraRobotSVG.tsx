"use client";

import { motion } from "framer-motion";

interface AvioraRobotSVGProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function AvioraRobotSVG({ className, width = 120, height = 120 }: AvioraRobotSVGProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      className={className}
      style={{ overflow: "visible" }}
    >
      {/* ─── DEFINE SHADOWS AND GRADIENTS ─── */}
      <defs>
        {/* Glow Filters */}
        <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="drop-shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000" floodOpacity="0.4" />
        </filter>

        {/* Metallic Gold Gradient */}
        <linearGradient id="metallic-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D061" />
          <stop offset="30%" stopColor="#DFB73C" />
          <stop offset="70%" stopColor="#B8960C" />
          <stop offset="100%" stopColor="#8A6E05" />
        </linearGradient>

        {/* Shiny White Ceramic Gradient */}
        <radialGradient id="white-ceramic" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </radialGradient>

        {/* Dark Inner Visor Gradient */}
        <linearGradient id="dark-visor" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        {/* Cyan Neon Glow Gradient */}
        <linearGradient id="cyan-neon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>

      {/* ─── MAIN SHADOW WRAPPER ─── */}
      <g filter="url(#drop-shadow)">
        
        {/* ─── ROBOT BODY & BASE ─── */}
        <motion.g
          animate={{
            y: [0, 3, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Hands Bobbing */}
          {/* Left Hand */}
          <motion.ellipse
            cx="32"
            cy="150"
            rx="10"
            ry="14"
            fill="url(#white-ceramic)"
            stroke="url(#metallic-gold)"
            strokeWidth="1.5"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Right Hand */}
          <motion.ellipse
            cx="168"
            cy="150"
            rx="10"
            ry="14"
            fill="url(#white-ceramic)"
            stroke="url(#metallic-gold)"
            strokeWidth="1.5"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />

          {/* Torso/Body */}
          <rect
            x="55"
            y="120"
            width="90"
            height="65"
            rx="32"
            fill="url(#white-ceramic)"
            stroke="url(#metallic-gold)"
            strokeWidth="2.5"
          />

          {/* Torso Inner Panel */}
          <rect
            x="70"
            y="132"
            width="60"
            height="40"
            rx="18"
            fill="url(#dark-visor)"
          />

          {/* Glowing Chest Core (Pulse) */}
          <motion.circle
            cx="100"
            cy="152"
            r="12"
            fill="url(#cyan-neon)"
            filter="url(#cyan-glow)"
            animate={{
              opacity: [0.7, 1, 0.7],
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Gold Neck Coils */}
          <line x1="85" y1="110" x2="115" y2="110" stroke="url(#metallic-gold)" strokeWidth="4" strokeLinecap="round" />
          <line x1="88" y1="116" x2="112" y2="116" stroke="url(#metallic-gold)" strokeWidth="4" strokeLinecap="round" />
        </motion.g>

        {/* ─── ROBOT HEAD (TILTING & MOVING) ─── */}
        <motion.g
          style={{ originX: "100px", originY: "115px" }}
          animate={{
            rotate: [-4, 6, -5, -4],
            y: [0, -2, 1, 0],
          }}
          transition={{
            duration: 4.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Antennae */}
          {/* Left Antenna */}
          <path
            d="M 65 50 Q 50 30 35 25"
            fill="none"
            stroke="url(#metallic-gold)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <motion.circle
            cx="35"
            cy="25"
            r="5"
            fill="url(#cyan-neon)"
            filter="url(#cyan-glow)"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* Right Antenna */}
          <path
            d="M 135 50 Q 150 30 165 25"
            fill="none"
            stroke="url(#metallic-gold)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <motion.circle
            cx="165"
            cy="25"
            r="5"
            fill="url(#cyan-neon)"
            filter="url(#cyan-glow)"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* Main Head Structure */}
          <ellipse
            cx="100"
            cy="75"
            rx="56"
            ry="46"
            fill="url(#white-ceramic)"
            stroke="url(#metallic-gold)"
            strokeWidth="3"
          />

          {/* Glass Visor Screen */}
          <ellipse
            cx="100"
            cy="75"
            rx="46"
            ry="34"
            fill="url(#dark-visor)"
          />

          {/* Face Elements */}
          {/* Eyes (Blinking Animation) */}
          <motion.ellipse
            cx="80"
            cy="72"
            rx="8"
            ry="8"
            fill="url(#cyan-neon)"
            filter="url(#cyan-glow)"
            animate={{
              scaleY: [1, 1, 0.1, 1, 1],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              repeatDelay: 2.2,
            }}
          />
          <motion.ellipse
            cx="120"
            cy="72"
            rx="8"
            ry="8"
            fill="url(#cyan-neon)"
            filter="url(#cyan-glow)"
            animate={{
              scaleY: [1, 1, 0.1, 1, 1],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              repeatDelay: 2.2,
            }}
          />

          {/* Smiling Mouth */}
          <path
            d="M 92 84 Q 100 90 108 84"
            fill="none"
            stroke="url(#cyan-neon)"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#cyan-glow)"
          />

          {/* Cheek Glows */}
          <ellipse cx="68" cy="80" rx="4" ry="2" fill="#22D3EE" opacity="0.35" filter="url(#cyan-glow)" />
          <ellipse cx="132" cy="80" rx="4" ry="2" fill="#22D3EE" opacity="0.35" filter="url(#cyan-glow)" />
        </motion.g>
      </g>
    </svg>
  );
}
