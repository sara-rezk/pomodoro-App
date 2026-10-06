import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

import { translations, Language } from '../lib/i18n';

interface TimerProps {
  language: Language;
  onComplete: (isFocus: boolean) => void;
  focusLength: number;
  setFocusLength: (len: number) => void;
  breakLength: number;
  setBreakLength: (len: number) => void;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  isFocus: boolean;
  setIsFocus: (isFocus: boolean) => void;
}

export const Timer: React.FC<TimerProps> = ({ 
  language,
  focusLength,
  setFocusLength,
  breakLength,
  setBreakLength,
  timeLeft,
  setTimeLeft,
  isActive,
  setIsActive,
  isFocus,
  setIsFocus,
  onComplete,
}) => {
  const t = translations[language || 'tr'].timer;

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft((isFocus ? focusLength : breakLength) * 60);
  }, [isFocus, focusLength, breakLength, setIsActive, setTimeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentMaxTime = (isFocus ? focusLength : breakLength) * 60;
  const progress = (timeLeft / currentMaxTime) * 100;
  const circumference = 1131; // 2 * PI * 180

  return (
    <div className="flex flex-col items-center justify-center space-y-10">
      <div className="relative w-80 h-80 flex items-center justify-center">
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle
            cx="160"
            cy="160"
            r="150"
            stroke="#E2E8F0"
            strokeWidth="4"
            fill="transparent"
          />
          <motion.circle
            cx="160"
            cy="160"
            r="150"
            stroke="#6366F1"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={942}
            initial={{ strokeDashoffset: 942 }}
            animate={{ strokeDashoffset: 942 - (942 * (100 - progress)) / 100 }}
            transition={{ duration: 1, ease: 'linear' }}
            strokeLinecap="round"
            className="neon-glow"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={isFocus ? 'focus' : 'break'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-slate-400 mb-2"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em] leading-none">
                {isFocus ? t.work : t.break}
              </span>
            </motion.div>
          </AnimatePresence>
          <span className="text-8xl font-black tracking-tighter text-slate-800 leading-none">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 w-full max-w-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTimer}
            className="px-10 py-5 bg-brand-indigo text-white font-black rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-neon uppercase text-xs tracking-widest"
          >
            {isActive ? t.pause : t.start}
          </button>

          <button
            onClick={resetTimer}
            className="p-5 rounded-3xl bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        <div className="w-full glass-panel p-4 flex justify-around">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 mb-2">{t.work}</span>
            <input 
              type="number" 
              value={focusLength}
              onChange={(e) => setFocusLength(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-12 text-center font-bold text-indigo-600 bg-transparent border-b border-indigo-200 focus:outline-none"
            />
          </div>
          <div className="w-px h-8 bg-slate-100 my-auto" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 mb-2">{t.break}</span>
            <input 
              type="number" 
              value={breakLength}
              onChange={(e) => setBreakLength(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-12 text-center font-bold text-emerald-500 bg-transparent border-b border-emerald-200 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
