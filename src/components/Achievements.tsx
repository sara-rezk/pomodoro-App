import React from 'react';
import { Award, Star, Zap, Flame, Trophy, Target, Book, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { Language, translations } from '../lib/i18n';

interface AchievementsProps {
  language: Language;
  onClose: () => void;
}

export const Achievements: React.FC<AchievementsProps> = ({ language, onClose }) => {
  const t = translations[language || 'tr'].nav;
  
  const achievements = [
    { id: 1, title: 'Early Bird', desc: 'Study before 7 AM', icon: Star, color: 'text-amber-500', unlocked: true },
    { id: 2, title: 'Deep Diver', desc: 'Complete 4 focus sessions', icon: Zap, color: 'text-blue-500', unlocked: true },
    { id: 3, title: 'On Fire', desc: 'Maintain a 5-day streak', icon: Flame, color: 'text-orange-500', unlocked: true },
    { id: 4, title: 'Synthesizer', desc: 'Create 50 AI Flashcards', icon: Brain, color: 'text-purple-500', unlocked: false },
    { id: 5, title: 'Strategic Thinker', desc: 'Decompose 10 complex tasks', icon: Target, color: 'text-emerald-500', unlocked: true },
    { id: 6, title: 'The Architect', desc: 'Complete a long-term goal', icon: Trophy, color: 'text-yellow-500', unlocked: false },
    { id: 7, title: 'Polymath', desc: 'Upload 5 documents to library', icon: Book, color: 'text-indigo-500', unlocked: false },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-8 max-w-2xl w-full"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <Award className="w-8 h-8 text-brand-indigo" />
          {t.achievements}
        </h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold uppercase text-[10px] tracking-widest">Kapat</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {achievements.map((ach) => (
          <div 
            key={ach.id}
            className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
              ach.unlocked ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50 border-slate-100 grayscale opacity-60'
            }`}
          >
            <div className={`p-3 rounded-xl bg-slate-50 ${ach.unlocked ? ach.color : 'text-slate-300'}`}>
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
