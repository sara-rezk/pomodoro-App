import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, CheckCircle, Clock, X, Award } from 'lucide-react';
import { Language, translations } from '../lib/i18n';

interface SessionSummaryModalProps {
  language: Language;
  tasksCompleted: number;
  xpGained: number;
  durationMinutes: number;
  onClose: () => void;
}

export const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({
  language,
  tasksCompleted,
  xpGained,
  durationMinutes,
  onClose,
}) => {
  const t = translations[language || 'tr'].summary;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="glass-panel p-6 md:p-8 max-w-md w-full relative bg-white border border-slate-100/90 shadow-2xl rounded-[2.5rem] overflow-hidden"
      >
        {/* Confetti decoration in background */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-indigo-500 to-purple-500" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebratory Icon */}
        <div className="flex flex-col items-center text-center mt-4">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.15, type: 'spring', damping: 15 }}
            className="w-16 h-16 rounded-[2rem] bg-indigo-50 border border-indigo-100 flex items-center justify-center text-brand-indigo mb-5 shadow-sm relative"
          >
            <Trophy className="w-8 h-8" />
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -top-1 -right-1 bg-yellow-400 text-white rounded-full p-1 border border-white"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </motion.div>
          </motion.div>

          {/* Celebratory Badge */}
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 px-3 py-1 bg-indigo-50/50 rounded-full border border-indigo-100/30 mb-2">
            {t.celebration}
          </span>

          <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
            {t.congrats}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mt-2 px-4">
            {t.subtitle}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-3.5 mt-8">
          {/* Stat 1: Duration */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100/60 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-500">
                <Clock className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {t.timeFocused}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {t.minFocus}
                </span>
              </div>
            </div>
            <span className="text-sm font-mono font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              {durationMinutes} {t.min}
            </span>
          </div>

          {/* Stat 2: Tasks Completed */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100/60 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-brand-indigo">
                <CheckCircle className="w-4 h-4 text-brand-indigo" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {t.tasksFinished}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {t.completedDuring}
                </span>
              </div>
            </div>
            <span className={`text-sm font-mono font-black px-2.5 py-1 rounded-lg ${
              tasksCompleted > 0 ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 bg-slate-100'
            }`}>
              {tasksCompleted}
            </span>
          </div>

          {/* Stat 3: XP Gained */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100/60 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center text-amber-500">
                <Award className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {t.xpEarned}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {t.xpSub}
                </span>
              </div>
            </div>
            <span className="text-sm font-mono font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
              +{xpGained} XP
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:shadow-slate-900/10 active:scale-98 transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          {t.closeBtn}
        </button>
      </motion.div>
    </div>
  );
};
