"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlitchTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, className, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={cn("relative inline-block font-bold", className)}
    >
      <span className="relative z-10">{text}</span>
      <span
        className="absolute top-0 left-[2px] -z-10 text-red-600 opacity-70 mix-blend-screen animate-glitch"
        aria-hidden="true"
      >
        {text}
      </span>
      <span
        className="absolute top-0 -left-[2px] -z-10 text-blue-600 opacity-50 mix-blend-screen animate-glitch"
        style={{ animationDelay: "0.1s" }}
        aria-hidden="true"
      >
        {text}
      </span>
    </motion.div>
  );
};
