import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, ListTodo, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, translations } from '../lib/i18n';
import { getTasks, saveTasks, Task } from '../lib/storage';

interface SessionTodo {
  id: string;
  text: string;
  completed: boolean;
  priority?: 'high' | 'medium' | 'low';
}

interface SessionTodoListProps {
  language: Language;
  durationMinutes?: number;
}

export const SessionTodoList: React.FC<SessionTodoListProps> = ({ language, durationMinutes = 25 }) => {
  const t = translations[language].timer;
  const [todos, setTodos] = useState<SessionTodo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [importedIds, setImportedIds] = useState<Set<string>>(new Set());

  // Load session todos
  useEffect(() => {
    try {
      const stored = localStorage.getItem('lumina_session_todos');
      if (stored) {
        setTodos(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load session todos", e);
    }
  }, []);

  // Save session todos
  const saveTodos = (newTodos: SessionTodo[]) => {
    setTodos(newTodos);
    try {
      localStorage.setItem('lumina_session_todos', JSON.stringify(newTodos));
    } catch (e) {
      console.error("Failed to save session todos", e);
    }
  };

  const addTodo = () => {
    if (!inputValue.trim()) return;
    const newTodo: SessionTodo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      priority: selectedPriority
    };
    saveTodos([...todos, newTodo]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const toggleComplete = (id: string) => {
    const updated = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTodos(updated);
  };

  const deleteTodo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = todos.filter(t => t.id !== id);
    saveTodos(updated);
  };

  const importToMainTodoList = async (todo: SessionTodo, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const currentTasks = await getTasks();
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: todo.text,
        description: t.importedFromSession,
        duration: durationMinutes,
        completed: false,
        createdAt: new Date().toISOString(),
        priority: todo.priority || 'medium'
      };
      await saveTasks([...currentTasks, newTask]);
      setImportedIds(prev => {
        const next = new Set(prev);
        next.add(todo.id);
        return next;
      });
    } catch (err) {
      console.error("Failed to import task", err);
    }
  };

  const [isSuggesting, setIsSuggesting] = useState(false);

  const suggestAITasks = async () => {
    setIsSuggesting(true);
    try {
      const response = await fetch('/api/ai/suggest-session-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          durationMinutes,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI task suggestions');
      }

      const data = await response.json();
      if (data && Array.isArray(data.tasks)) {
        const newTodos = data.tasks.map((task: { text: string }) => ({
          id: crypto.randomUUID(),
          text: task.text,
          completed: false,
          priority: 'medium',
        }));
        saveTodos([...todos, ...newTodos]);
      }
    } catch (error) {
      console.error('Error suggesting AI tasks:', error);
    } finally {
      setIsSuggesting(false);
    }
  };

  const totalTasks = todos.length;
  const completedTasks = todos.filter(t => t.completed).length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="glass-panel p-4 md:p-6 flex flex-col h-auto shrink-0 space-y-4">
      <div className="flex flex-col gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-brand-indigo" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              {t.todoTitle}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={suggestAITasks}
              disabled={isSuggesting}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-indigo-100/80 bg-indigo-50/50 hover:bg-indigo-50 text-[10px] font-bold text-brand-indigo active:scale-95 transition-all disabled:opacity-50"
              title="Gemini ile mikro-görevler öner"
            >
              {isSuggesting ? (
                <Loader2 className="w-3 h-3 animate-spin text-brand-indigo" />
              ) : (
                <Sparkles className="w-3 h-3 text-brand-indigo" />
              )}
              <span>{isSuggesting ? t.aiSuggesting : t.aiSuggest}</span>
            </button>
            {totalTasks > 0 && (
              <span className="text-[10px] font-black font-mono text-brand-indigo bg-indigo-50 px-2.5 py-1 rounded-lg">
                {completedTasks}/{totalTasks} ({progressPercentage}%)
              </span>
            )}
          </div>
        </div>
        {totalTasks > 0 && (
          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-1">
            <motion.div 
              className="h-full bg-brand-indigo rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex flex-col gap-2 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.todoPlaceholder}
            className="flex-1 bg-white border border-slate-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-indigo text-xs text-slate-700 transition-all placeholder:text-slate-300 shadow-sm"
          />
          <button 
            onClick={addTodo}
            className="bg-brand-indigo text-white p-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md shrink-0 flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        {/* Priority Selector */}
        <div className="flex items-center justify-between px-1.5 py-0.5">
          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
            {t.priority}
          </span>
          <div className="flex items-center gap-1.5">
            {(['high', 'medium', 'low'] as const).map((p) => {
              const colors = {
                high: 'text-rose-600 bg-rose-50 hover:bg-rose-100 border-rose-100/50',
                medium: 'text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-100/50',
                low: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-100/50',
              };
              const activeColors = {
                high: 'text-white bg-rose-500 border-rose-500 shadow-sm shadow-rose-500/10',
                medium: 'text-white bg-amber-500 border-amber-500 shadow-sm shadow-amber-500/10',
                low: 'text-white bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-500/10',
              };
              const label = p === 'high' ? t.priorityHigh : p === 'medium' ? t.priorityMedium : t.priorityLow;

              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPriority(p)}
                  className={`px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-wider transition-all select-none ${
                    selectedPriority === p ? activeColors[p] : colors[p]
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto max-h-[220px] pr-1 space-y-2 select-none no-scrollbar">
        <AnimatePresence mode="popLayout">
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => toggleComplete(todo.id)}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                todo.completed 
                  ? 'bg-slate-50/70 border-slate-100 text-slate-400 line-through grayscale border-l-4 border-l-slate-300' 
                  : `bg-white text-slate-700 hover:shadow-sm hover:border-slate-200 ${
                      todo.priority === 'high' 
                        ? 'border-rose-100 border-l-4 border-l-rose-500' 
                        : todo.priority === 'low' 
                        ? 'border-emerald-100 border-l-4 border-l-emerald-500' 
                        : 'border-amber-100 border-l-4 border-l-amber-500'
                    }`
              }`}
            >
              <div className="flex items-center gap-3 truncate pr-2">
                <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                  todo.completed 
                    ? 'bg-emerald-500 border-emerald-500 text-white animate-none' 
                    : 'border-slate-300 group-hover:border-slate-400'
                }`}>
                  {todo.completed && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="text-xs font-bold tracking-tight truncate">{todo.text}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button 
                  onClick={(e) => importToMainTodoList(todo, e)}
                  disabled={importedIds.has(todo.id)}
                  className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                    importedIds.has(todo.id)
                      ? 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100/50'
                      : 'text-slate-300 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                  title={importedIds.has(todo.id) ? t.addedToTasks : t.addToTasks}
                >
                  <ListTodo className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
                <button 
                  onClick={(e) => deleteTodo(todo.id, e)}
                  className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors shrink-0"
                  title={t.deleteTask}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {todos.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 border border-dashed border-slate-100 rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-300">
              Görev Planlanmadı
            </p>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
              Bu seans için birkaç küçük hedef belirleyin!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
