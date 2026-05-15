import React, { useState, useEffect } from 'react';
import { FileText, LayoutDashboard, Timer as TimerIcon, Brain, BookOpen, Users, Settings, Award, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer } from './Timer';
import { TaskBoard } from './TaskBoard';
import { Flashcards } from './Flashcards';
import { VirtualLibrary } from './VirtualLibrary';
import { PDFViewer } from './PDFViewer';
import { GoalBoard } from './GoalBoard';
import { AudioPlayer } from './AudioPlayer';
import { NuclearMode } from './Interventions';
import { getUserState, saveUserState, UserState } from '../lib/storage';
import { translations } from '../lib/i18n';
import { Settings as SettingsModal } from './Settings';
import { Achievements } from './Achievements';

export const Dashboard: React.FC = () => {
  const [view, setView] = useState<'timer' | 'tasks' | 'goals' | 'flashcards' | 'library'>('timer');
  const [userState, setUserState] = useState<UserState | null>(null);
  const [isNuclearActive, setIsNuclearActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  useEffect(() => {
    getUserState().then(setUserState);
  }, []);

  if (!userState) return null;

  const t = translations[userState.language || 'tr'];

  const handleTimerComplete = async (isFocus: boolean) => {
    if (isFocus && userState) {
      const newState = {
        ...userState,
        xp: userState.xp + 50,
        level: Math.floor((userState.xp + 50) / 1000) + 1,
      };
      setUserState(newState);
      await saveUserState(newState);
    }
  };

  const navItems = [
    { id: 'timer', icon: TimerIcon, label: t.nav.focus },
    { id: 'tasks', icon: Brain, label: t.nav.tasks },
    { id: 'goals', icon: Target, label: t.nav.goals },
    { id: 'flashcards', icon: BookOpen, label: t.nav.memory },
    { id: 'library', icon: FileText, label: t.nav.library },
  ];

  return (
    <div className={`flex flex-col md:flex-row h-screen w-full overflow-hidden font-sans theme-${userState.theme || 'light'}`}>
      {/* Sidebar / Bottom Nav */}
      <nav className="w-full md:w-20 border-t md:border-t-0 md:border-r border-slate-200 flex flex-row md:flex-col items-center py-2 md:py-8 bg-white/50 backdrop-blur-md z-50 order-last md:order-first">
        <div className="hidden md:flex w-10 h-10 bg-brand-indigo rounded-xl items-center justify-center mb-12 shadow-neon transition-transform hover:scale-105 active:scale-95 cursor-pointer">
          <LayoutDashboard className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 flex flex-row md:flex-col justify-around md:justify-start w-full md:gap-8 text-slate-400">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={`p-2 md:p-1 rounded-lg transition-all duration-300 relative group flex flex-col items-center ${
                view === item.id ? 'text-brand-indigo' : 'hover:text-slate-600'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="hidden md:block absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-[10px] uppercase font-bold tracking-widest rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60]">
                {item.label}
              </span>
              <span className="md:hidden text-[8px] font-bold uppercase tracking-tighter mt-1">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="hidden md:flex mt-auto flex-col gap-6 text-slate-300">
          <button 
            onClick={() => setShowAchievements(true)}
            className="hover:text-slate-600 transition-colors" 
            title={t.nav.achievements}
          >
            <Award className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="hover:text-slate-600 transition-colors" 
            title={t.nav.settings}
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-slate-200 bg-white/30 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-2 md:gap-4 text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">
            <span className="text-brand-indigo font-black whitespace-nowrap">Lumina v4.0</span>
            <span className="h-1 w-1 bg-slate-300 rounded-full shrink-0"></span>
            <span className="truncate max-w-[100px] md:max-w-none">{view === 'timer' ? t.timer.focusMode : `${view.toUpperCase()} Engine`}</span>
          </div>
          <div className="flex items-center gap-2 md:gap-6">
            <div className="flex items-center gap-1 md:gap-2">
              <span className="text-sm md:text-base">🔥</span>
              <span className="text-[10px] md:text-sm font-bold text-slate-600 whitespace-nowrap">{userState.streak} {t.header.streak}</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">{t.header.level} {userState.level}</div>
                <div className="text-[10px] font-mono font-bold text-brand-indigo">{userState.xp} XP</div>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-lg md:text-xl shadow-inner shrink-0">
                {userState.avatar}
              </div>
            </div>
          </div>
        </header>

        {/* Central Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8">
           <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full"
              >
                {view === 'timer' && (
                  <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 h-full">
                    <div className="lg:col-span-8 flex flex-col items-center justify-center min-h-[300px] md:min-h-0">
                       <Timer language={userState.language} onComplete={handleTimerComplete} />
                    </div>
                    <div className="lg:col-span-4 flex flex-col gap-6">
                       <button onClick={() => setIsNuclearActive(!isNuclearActive)} className="w-full text-left focus:outline-none">
                         <NuclearMode isActive={isNuclearActive} />
                       </button>
                       <AudioPlayer 
                         language={userState.language} 
                         preferredPlaylist={userState.preferredPlaylist}
                       />
                    </div>
                  </div>
                )}
                {view === 'tasks' && <div className="flex items-center justify-center h-full"><TaskBoard language={userState.language} /></div>}
                {view === 'goals' && <div className="flex items-center justify-center h-full"><GoalBoard language={userState.language} /></div>}
                {view === 'flashcards' && <div className="flex items-center justify-center h-full"><Flashcards language={userState.language} /></div>}
                {view === 'library' && <div className="flex items-center justify-center h-full w-full"><PDFViewer /></div>}
              </motion.div>
            </AnimatePresence>
        </div>

        {/* Bottom Status Bar (Desktop only or very subtle on mobile) */}
        <footer className="hidden md:flex h-12 px-8 items-center justify-between border-t border-slate-200 bg-white/50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isNuclearActive ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                {isNuclearActive ? t.timer.nuclearOn : t.timer.nuclearOff}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Collective Energy:</span>
             <span className="text-[10px] font-mono text-emerald-600 font-black">4.8 kW</span>
          </div>
        </footer>

        {/* Modals for Settings & Achievements */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            >
              <SettingsModal 
                userState={userState} 
                onUpdate={setUserState} 
                onClose={() => setShowSettings(false)} 
              />
            </motion.div>
          )}

          {showAchievements && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            >
              <Achievements 
                language={userState.language} 
                onClose={() => setShowAchievements(false)} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
