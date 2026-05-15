import React, { useState, useEffect } from 'react';
import { Target, Plus, Calendar, TrendingUp, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Goal, getGoals, saveGoals } from '../lib/storage';
import { translations, Language } from '../lib/i18n';

interface GoalBoardProps {
  language: Language;
}

export const GoalBoard: React.FC<GoalBoardProps> = ({ language }) => {
  const t = translations[language || 'tr'].goals;
  const commonT = translations[language || 'tr'].nav;
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', targetHours: 10, deadline: '', category: 'Akademik' });

  useEffect(() => {
    getGoals().then(setGoals);
  }, []);

  const addGoal = () => {
    if (!newGoal.title) return;
    const goal: Goal = {
      id: crypto.randomUUID(),
      ...newGoal,
      currentHours: 0,
    };
    const updated = [...goals, goal];
    setGoals(updated);
    saveGoals(updated);
    setShowAdd(false);
    setNewGoal({ title: '', targetHours: 10, deadline: '', category: 'Akademik' });
  };

  const removeGoal = (id: string) => {
    const updated = goals.filter(g => g.id !== id);
    setGoals(updated);
    saveGoals(updated);
  };

  const updateProgress = (id: string, amount: number) => {
    const updated = goals.map(g => 
      g.id === id ? { ...g, currentHours: Math.min(g.targetHours, g.currentHours + amount) } : g
    );
    setGoals(updated);
    saveGoals(updated);
  };

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight text-slate-800">{commonT.goals}</h2>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-brand-indigo text-white px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-neon"
        >
          <Plus className="w-4 h-4" /> {t.add}
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-panel p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-8">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">{t.title}</label>
                <input 
                  type="text" 
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand-indigo text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">{t.hours}</label>
                <input 
                  type="number" 
                  value={newGoal.targetHours}
                  onChange={(e) => setNewGoal({ ...newGoal, targetHours: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand-indigo text-sm"
                />
              </div>
              <button 
                onClick={addGoal}
                className="bg-brand-indigo text-white py-2 rounded-xl font-bold text-xs uppercase tracking-widest"
              >
                {t.add}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progress = (goal.currentHours / goal.targetHours) * 100;
          return (
            <motion.div 
              key={goal.id}
              layout
              className="glass-panel p-6 flex flex-col gap-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-brand-indigo flex items-center justify-center">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{goal.title}</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{goal.category}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeGoal(goal.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>İlerleme</span>
                  <span className="text-brand-indigo">{goal.currentHours} / {goal.targetHours} Saat</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-brand-indigo rounded-full"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <button 
                  onClick={() => updateProgress(goal.id, 1)}
                  className="flex-1 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-white hover:text-brand-indigo hover:border-brand-indigo transition-all"
                >
                  +1 {t.hours}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl">
          <TrendingUp className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{t.noGoals}</p>
        </div>
      )}
    </div>
  );
};
