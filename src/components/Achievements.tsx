import React from 'react';
import { Award, Star, Zap, Flame, Trophy, Target, Book, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { Language, translations } from '../lib/i18n';

interface AchievementsProps {
  language: Language;
  onClose: () => void;
}

export const Achievements: React.FC<AchievementsProps> = ({ language, onClose }) => {
  const tNav = translations[language || 'tr'].nav;
  const tList = translations[language || 'tr'].achievementsList;
  
  const icons = [Star, Zap, Flame, Brain, Target, Trophy, Book];
  const colors = [
    'text-amber-500',
    'text-blue-500',
    'text-orange-500',
    'text-purple-500',
    'text-emerald-500',
    'text-yellow-500',
    'text-indigo-500'
  ];
  const unlocked = [true, true, true, false, true, false, false];

  const achievements = tList.items.map((item, idx) => ({
    id: idx + 1,
    title: item.title,
    desc: item.desc,
    icon: icons[idx] || Star,
    color: colors[idx] || 'text-indigo-500',
    unlocked: unlocked[idx] ?? true
  }));

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-6 md:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto custom-scrollbar"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <Award className="w-8 h-8 text-brand-indigo" />
          {tNav.achievements}
        </h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold uppercase text-[10px] tracking-widest cursor-pointer">
          {tList.close}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {achievements.map((ach) => (
          <div 
            key={ach.id}
            className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
              ach.unlocked ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50 border-slate-100 grayscale opacity-60'
            }`}
          >
            <div className={`p-3 rounded-xl bg-slate-50 shrink-0 ${ach.unlocked ? ach.color : 'text-slate-300'}`}>
              <ach.icon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">{ach.title}</h4>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{ach.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
