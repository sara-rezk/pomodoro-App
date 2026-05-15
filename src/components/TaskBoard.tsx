import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, getTasks, saveTasks } from '../lib/storage';

import { translations, Language } from '../lib/i18n';

interface TaskBoardProps {
  language: Language;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ language }) => {
  const t = translations[language || 'tr'].tasks;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    getTasks().then(setTasks);
  }, []);

  const addTask = (title: string, description: string = '', duration: number = 25) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      duration,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const removeTask = (id: string) => {
    const updatedTasks = tasks.filter((t) => t.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handleAIDecomposition = async () => {
    if (!newGoal.trim()) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: newGoal }),
      });
      const data = await response.json();
      if (data.tasks) {
        const newTasks: Task[] = data.tasks.map((t: any) => ({
          ...t,
          id: crypto.randomUUID(),
          completed: false,
          createdAt: new Date().toISOString(),
        }));
        const updatedTasks = [...newTasks, ...tasks];
        setTasks(updatedTasks);
        saveTasks(updatedTasks);
        setNewGoal('');
      }
    } catch (error) {
      console.error('AI Error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const priorityWeight = { high: 0, medium: 1, low: 2, undefined: 3 };
    return (priorityWeight[a.priority || 'undefined'] || 3) - (priorityWeight[b.priority || 'undefined'] || 3);
  });

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      <div className="glass-panel p-4 space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder={t.placeholder}
            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-indigo transition-colors text-[10px] uppercase font-bold tracking-widest text-slate-600"
            onKeyDown={(e) => e.key === 'Enter' && handleAIDecomposition()}
          />
          <button
            onClick={handleAIDecomposition}
            disabled={isAnalyzing || !newGoal.trim()}
            className="bg-brand-indigo text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2 shadow-neon whitespace-nowrap"
          >
            {isAnalyzing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {t.decompose}
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {sortedTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-4 rounded-xl bg-white border border-slate-100 flex items-center justify-between group transition-all duration-300 shadow-sm ${
                task.completed ? 'opacity-40 grayscale' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                    task.completed
                      ? 'bg-brand-indigo border-brand-indigo text-white'
                      : 'border-slate-200 hover:border-brand-indigo'
                  }`}
                >
                  {task.completed && <Check className="w-3 h-3" />}
                </button>
                <div className="flex flex-col text-left">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {task.title}
                  </span>
                  {task.description && (
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{task.description}</span>
                  )}
                  {task.priority && (
                    <div className="flex gap-1 mt-1">
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        task.priority === 'high' ? 'bg-red-50 text-red-500 border-red-100' :
                        task.priority === 'medium' ? 'bg-amber-50 text-amber-500 border-amber-100' :
                        'bg-slate-50 text-slate-400 border-slate-100'
                      }`}>
                        {t.priority[task.priority]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                  {task.duration}M
                </span>
                <button
                  onClick={() => removeTask(task.id)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="text-center py-20 bg-white/50 border border-slate-200 border-dashed rounded-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">{t.noTasks}</p>
          </div>
        )}
      </div>
    </div>
  );
};
