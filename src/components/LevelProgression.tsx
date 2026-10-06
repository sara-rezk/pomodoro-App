import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Award, Star, ChevronRight, Zap, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserState, saveUserState } from '../lib/storage';
import { translations } from '../lib/i18n';

interface LevelProgressionProps {
  userState: UserState;
  onUpdate: (state: UserState) => void;
}

export const LevelProgression: React.FC<LevelProgressionProps> = ({ userState, onUpdate }) => {
  const language = userState.language || 'tr';
  const theme = userState.theme || 'light';
  const isContrast = theme === 'contrast';
  const isDark = theme === 'dark';

  // Calculate level based on XP formula: 1000 XP per level
  const totalXp = userState.xp || 0;
  const computedLevel = Math.floor(totalXp / 1000) + 1;
  const currentLevelXp = totalXp % 1000;
  const nextLevelXpNeeded = 1000;
  const progressPercentage = Math.min(100, Math.floor((currentLevelXp / nextLevelXpNeeded) * 100));
  
  // Ref to track level and avoid double confetti triggers on load, only triggering when it actually increases
  const prevLevelRef = useRef<number>(computedLevel);

  // Trigger grand confetti effect on actual level-up
  useEffect(() => {
    if (computedLevel > prevLevelRef.current) {
      triggerConfetti();
      prevLevelRef.current = computedLevel;
    } else {
      // Keep ref in sync if it changes externally
      prevLevelRef.current = computedLevel;
    }
  }, [computedLevel]);

  const triggerConfetti = () => {
    // Grand celebration cascade
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 110 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Confetti fountains
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const t = translations[language || 'tr'].progression;

  // Get Rank / Title based on Level
  const getRankInfo = (level: number) => {
    const rankTitle = level <= 2 
      ? t.ranks.novice 
      : level <= 4 
      ? t.ranks.ranger 
      : level <= 7 
      ? t.ranks.synthesizer 
      : level <= 10 
      ? t.ranks.grandmaster 
      : t.ranks.emperor;

    if (isContrast) {
      return { name: rankTitle, color: 'text-white font-black', bg: 'bg-black', border: 'border-white border-2', icon: '⭐' };
    }
    
    if (level <= 2) return { name: rankTitle, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50/60 dark:bg-indigo-950/30', border: 'border-indigo-100 dark:border-indigo-900/50', icon: '🌱' };
    if (level <= 4) return { name: rankTitle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50/60 dark:bg-emerald-950/30', border: 'border-emerald-100 dark:border-emerald-900/50', icon: '⚡' };
    if (level <= 7) return { name: rankTitle, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50/60 dark:bg-teal-950/30', border: 'border-teal-100 dark:border-teal-900/50', icon: '🧠' };
    if (level <= 10) return { name: rankTitle, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50/60 dark:bg-amber-950/30', border: 'border-amber-100 dark:border-amber-900/50', icon: '🔥' };
    return { name: rankTitle, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50/60 dark:bg-rose-950/30', border: 'border-rose-100 dark:border-rose-900/50', icon: '👑' };
  };

  const rank = getRankInfo(computedLevel);

  // Fixed milestones within the level
  const milestones = [
    { targetXp: 250, label: t.milestones.catalyst, desc: '+15% focus power' },
    { targetXp: 500, label: t.milestones.acoustic, desc: 'Sync ambient channels' },
    { targetXp: 750, label: t.milestones.safeguard, desc: 'Extend focus timers' },
    { targetXp: 1000, label: t.milestones.ascension, desc: 'Rank & avatar upgrade' },
  ];

  // Handle XP injection to simulate levelling up
  const handleAddXp = async () => {
    const additionalXp = 150;
    const finalXp = totalXp + additionalXp;
    const finalLevel = Math.floor(finalXp / 1000) + 1;
    
    const updatedState = {
      ...userState,
      xp: finalXp,
      level: finalLevel,
    };
    
    onUpdate(updatedState);
    await saveUserState(updatedState);
  };

  // SVG dimensions
  const size = 180;
  const strokeWidth = 12;
  const center = size / 2;
  const r = center - strokeWidth;
  const c = 2 * Math.PI * r;
  const offset = c - (progressPercentage / 100) * c;

  // Let us dynamically decide SVG gradient/stroke stops
  const stopColor1 = isContrast ? '#ffff00' : '#4f46e5';
  const stopColor2 = isContrast ? '#ffffff' : '#06b6d4';
  const stopColor3 = isContrast ? '#ffffff' : '#10b981';

  let primaryBtnClasses = "";
  let secondaryBtnClasses = "";

  if (isContrast) {
    primaryBtnClasses = "flex-1 py-1.5 md:py-2 px-3 bg-white hover:bg-neutral-200 text-black border-2 border-white rounded-xl font-black text-[10px] uppercase tracking-wider shadow-sm active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer";
    secondaryBtnClasses = "py-1.5 md:py-2 px-3 bg-black hover:bg-neutral-900 text-white border-2 border-white rounded-xl font-black text-[10px] uppercase tracking-wider active:scale-95 transition-all text-center flex items-center justify-center gap-1 cursor-pointer";
  } else if (isDark) {
    primaryBtnClasses = "flex-1 py-1.5 md:py-2 px-3 bg-brand-indigo hover:bg-indigo-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider shadow-sm hover:scale-[1.02] active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer";
    secondaryBtnClasses = "py-1.5 md:py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition-all text-center flex items-center justify-center gap-1 cursor-pointer";
  } else {
    primaryBtnClasses = "flex-1 py-1.5 md:py-2 px-3 bg-brand-indigo hover:bg-indigo-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider shadow-sm hover:scale-[1.02] active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer";
    secondaryBtnClasses = "py-1.5 md:py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition-all text-center flex items-center justify-center gap-1 cursor-pointer";
  }

  return (
    <div className="w-full glass-panel p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden shrink-0">
      {/* Visual background gradient accents */}
      {!isContrast && (
        <>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/10 dark:bg-indigo-950/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-emerald-100/10 dark:bg-emerald-950/10 rounded-full blur-xl pointer-events-none" />
        </>
      )}

      {/* Title Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm">{rank.icon}</span>
            <h3 className="font-sans font-black tracking-tight text-primary text-base md:text-lg leading-tight">
              {t.title}
            </h3>
          </div>
          <p className="text-[11px] text-secondary font-medium leading-relaxed mt-1">
            {t.subtitle}
          </p>
        </div>
        <div className={`px-2.5 py-1 text-[9px] md:text-[10px] uppercase font-black tracking-widest leading-none rounded-xl border ${rank.bg} ${rank.border} ${rank.color} shrink-0`}>
          {rank.name}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Circle Progress Display */}
        <div className="md:col-span-6 flex flex-col items-center justify-center relative py-2">
          <div className="relative w-[180px] h-[180px] flex items-center justify-center">
            {/* SVG Background and Dynamic Progress Overlay */}
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
              {/* Outer stroke track ring - color dependent on theme */}
              <circle
                cx={center}
                cy={center}
                r={r}
                fill="none"
                stroke={isContrast ? '#ffffff' : isDark ? '#1e293b' : '#f1f5f9'}
                strokeWidth={strokeWidth}
              />
              {/* Gradient & Dash Path */}
              <motion.circle
                cx={center}
                cy={center}
                r={r}
                fill="none"
                stroke="url(#levelProgressionGradient)"
                strokeWidth={strokeWidth}
                strokeDasharray={c}
                initial={{ strokeDashoffset: c }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, ease: 'easeOut' }}
                strokeLinecap="round"
              />
              {/* Define dynamic line gradient inside SVG */}
              <defs>
                <linearGradient id="levelProgressionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={stopColor1} />
                  <stop offset="50%" stopColor={stopColor2} />
                  <stop offset="100%" stopColor={stopColor3} />
                </linearGradient>
              </defs>
            </svg>

            {/* Centered Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[9px] md:text-[10px] font-black tracking-widest uppercase text-secondary">
                {t.levelLabel}
              </span>
              <motion.span 
                key={computedLevel}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl md:text-5xl font-extrabold text-primary tracking-tighter leading-none my-1"
              >
                {computedLevel}
              </motion.span>
              <div className={`flex items-center gap-1.5 mt-0.5 px-2 py-0.5 rounded-full border ${
                isContrast 
                  ? 'bg-black border-white text-white' 
                  : isDark 
                    ? 'bg-slate-900/60 border-slate-800' 
                    : 'bg-slate-50 border-slate-100'
              }`}>
                <span className="text-[10px] font-mono font-black text-brand-indigo leading-none">
                  {currentLevelXp}
                </span>
                <span className="text-[9px] text-secondary font-bold">/</span>
                <span className="text-[10px] font-mono text-secondary font-bold leading-none">
                  {nextLevelXpNeeded} XP
                </span>
              </div>
            </div>
          </div>

          <div className="text-center mt-3">
            <span className="text-[10px] font-bold text-secondary block">
              {1000 - currentLevelXp} XP {t.remaining}
            </span>
          </div>
        </div>

        {/* Milestones Information & Control list */}
        <div className="md:col-span-6 flex flex-col justify-center gap-3 w-full">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary border-b border-dashed border-primary pb-1.5 flex items-center gap-1.5">
            <StarsIcon className="w-3.5 h-3.5 text-brand-indigo shrink-0" />
            <span>{t.milestonesTitle}</span>
          </h4>

          <div className="flex flex-col gap-2">
            {milestones.map((milestone) => {
              const checkedPercent = (milestone.targetXp / nextLevelXpNeeded) * 100;
              const isUnlocked = currentLevelXp >= milestone.targetXp;
              
              // Let us theme colors for milestones:
              let milestoneClasses = "";
              let iconClasses = "";
              let tagClasses = "";

              if (isContrast) {
                milestoneClasses = isUnlocked
                  ? "bg-black border-2 border-white text-white font-bold"
                  : "bg-black border border-white/40 text-white/50";
                iconClasses = isUnlocked 
                  ? "bg-white text-black font-black" 
                  : "bg-black text-white/40 border border-white/40";
                tagClasses = "bg-white text-black font-mono text-[9px] font-black shrink-0 px-1.5 py-0.5 rounded";
              } else if (isDark) {
                milestoneClasses = isUnlocked
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-slate-900/40 border-slate-800/80 text-slate-400";
                iconClasses = isUnlocked
                  ? "bg-emerald-500/20 text-emerald-400 font-bold"
                  : "bg-slate-800 text-slate-500";
                tagClasses = "bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[9px] font-black shrink-0 px-1.5 py-0.5 rounded";
              } else {
                // Light theme
                milestoneClasses = isUnlocked
                  ? "bg-emerald-50/55 border-emerald-100/80 text-emerald-800"
                  : "bg-slate-50/50 border-slate-100/80 text-slate-500";
                iconClasses = isUnlocked
                  ? "bg-emerald-100 text-emerald-600 font-bold"
                  : "bg-slate-100 text-slate-400";
                tagClasses = "bg-white border border-slate-100 text-slate-600 font-mono text-[9px] font-[800] shrink-0 px-1.5 py-0.5 rounded-md shadow-2xs";
              }
              
              return (
                <div 
                  key={milestone.targetXp} 
                  className={`flex items-center justify-between p-2 rounded-xl border text-left transition-all text-xs ${milestoneClasses}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] shrink-0 ${iconClasses}`}>
                      {isUnlocked ? '✓' : '★'}
                    </div>
                    <div className="flex flex-col leading-none">
                      <span className="text-[10px] font-bold">{milestone.label}</span>
                      <span className="text-[9px] text-secondary font-medium mt-0.5">{milestone.desc}</span>
                    </div>
                  </div>
                  <span className={tagClasses}>
                    {milestone.targetXp} XP
                  </span>
                </div>
              );
            })}
          </div>

          {/* Simulate controls */}
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              onClick={handleAddXp}
              className={primaryBtnClasses}
            >
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span>{t.simulateXp}</span>
            </button>
            
            <button
              onClick={triggerConfetti}
              className={secondaryBtnClasses}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
              <span>{t.testConfetti}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Help sub-icons
const StarsIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
  </svg>
);
