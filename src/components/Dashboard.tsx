import React, { useState, useEffect, useRef } from 'react';
import { FileText, LayoutDashboard, Timer as TimerIcon, Brain, BookOpen, Users, Settings, Award, Target, Play, Pause, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer } from './Timer';
import { TaskBoard } from './TaskBoard';
import { Flashcards } from './Flashcards';
import { PDFViewer } from './PDFViewer';
import { GoalBoard } from './GoalBoard';
import { AudioPlayer } from './AudioPlayer';
import { NuclearMode } from './Interventions';
import { getUserState, saveUserState, UserState, getTasks } from '../lib/storage';
import { translations } from '../lib/i18n';
import { Settings as SettingsModal } from './Settings';
import { Achievements } from './Achievements';
import { SessionTodoList } from './SessionTodoList';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { AccountAuth } from './AccountAuth';
import { SessionSummaryModal } from './SessionSummaryModal';
import { LevelProgression } from './LevelProgression';

export const Dashboard: React.FC = () => {
  const [view, setView] = useState<'timer' | 'tasks' | 'goals' | 'flashcards' | 'library'>('timer');
  const [userState, setUserState] = useState<UserState | null>(null);
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [isNuclearActive, setIsNuclearActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sessionSummary, setSessionSummary] = useState<{
    show: boolean;
    tasksCompleted: number;
    xpGained: number;
    durationMinutes: number;
  } | null>(null);

  const initialCompletedCount = useRef<number>(0);

  // Lifted Timer State
  const [focusLength, setFocusLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isFocus, setIsFocus] = useState(true);

  // Sync timeLeft when lengths modify and timer is idle
  useEffect(() => {
    if (!isTimerActive) {
      setTimeLeft((isFocus ? focusLength : breakLength) * 60);
    }
  }, [focusLength, breakLength, isFocus, isTimerActive]);

  const refreshState = () => {
    getUserState().then(setUserState);
  };

  useEffect(() => {
    refreshState();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFbUser(user);
      setAuthLoaded(true);
      refreshState();
    });
    return unsubscribe;
  }, []);

  const getCompletedTasksCount = async () => {
    try {
      const mainTasks = await getTasks();
      const sessionTodosRaw = localStorage.getItem('lumina_session_todos');
      const sessionTodos = sessionTodosRaw ? JSON.parse(sessionTodosRaw) : [];

      const mainCompleted = mainTasks.filter((t: any) => t.completed).length;
      const sessionCompleted = sessionTodos.filter((t: any) => t.completed).length;

      return mainCompleted + sessionCompleted;
    } catch (e) {
      console.error("Failed to query completed tasks count", e);
      return 0;
    }
  };

  // Whenever the focus timer starts or becomes active, grab the initial completed tasks count
  useEffect(() => {
    if (isTimerActive && isFocus) {
      getCompletedTasksCount().then((count) => {
        initialCompletedCount.current = count;
      });
    }
  }, [isTimerActive, isFocus]);

  const handleTimerComplete = async (isFocusSession: boolean) => {
    if (isFocusSession && userState) {
      const currentCompleted = await getCompletedTasksCount();
      const sessionCompletedCount = Math.max(0, currentCompleted - initialCompletedCount.current);

      const newState = {
        ...userState,
        xp: userState.xp + 50,
        level: Math.floor((userState.xp + 50) / 1000) + 1,
      };
      setUserState(newState);
      await saveUserState(newState);

      setSessionSummary({
        show: true,
        tasksCompleted: sessionCompletedCount,
        xpGained: 50,
        durationMinutes: focusLength,
      });
    }
  };

  // Global background countdown ticker
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      setIsTimerActive(false);
      handleTimerComplete(isFocus);
      import('canvas-confetti').then((confettiModule) => {
        const confetti = (confettiModule.default || confettiModule) as any;
        if (isFocus) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10B981', '#6366F1']
          });
        }
      });
      setIsFocus((prev) => !prev);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timeLeft, isFocus]);

  useEffect(() => {
    if (userState?.language) {
      document.documentElement.dir = userState.language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = userState.language;
    }
  }, [userState?.language]);

  if (!userState || !authLoaded) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-indigo"></div>
      </div>
    );
  }

  if (!fbUser) {
    return (
      <AccountAuth
        language={userState.language}
        onClose={() => {}}
        onStateUpdateNeeded={refreshState}
        hideClose={true}
      />
    );
  }

  const t = translations[userState.language || 'tr'];

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
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-1 md:gap-2 bg-slate-50/80 border border-slate-100 px-2 py-1 rounded-xl">
              <span className="text-xs md:text-base">🔥</span>
              <span className="text-[9px] md:text-xs font-bold text-slate-600 whitespace-nowrap">{userState.streak} {t.header.streak}</span>
            </div>
            {fbUser ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 hover:bg-emerald-50/50 border border-transparent hover:border-emerald-100/30 p-1 rounded-2xl transition-all cursor-pointer group text-left"
                title={`${t.header.cloudSync} ${fbUser.email}`}
              >
                <div className="text-right hidden sm:block">
                  <div className="text-[9px] font-bold uppercase text-slate-400 tracking-wider group-hover:text-emerald-600 transition-colors">{t.header.level} {userState.level}</div>
                  <div className="text-[10px] font-mono font-bold text-emerald-600">{userState.xp} XP</div>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm md:text-lg shadow-inner shrink-0 relative hover:scale-[1.03] active:scale-95 transition-all">
                  {userState.avatar}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm animate-pulse"></div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-brand-indigo hover:bg-indigo-700 text-white px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-indigo-100 hover:scale-[1.03] active:scale-95 cursor-pointer flex items-center gap-1.5"
                title={t.header.cloudSignIn}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{t.header.signIn}</span>
              </button>
            )}
            <div className="flex items-center gap-1.5 md:hidden">
              <button 
                onClick={() => setShowAchievements(true)}
                className="text-slate-400 hover:text-indigo-600 p-1.5 border border-slate-100 bg-white rounded-lg active:scale-95 transition-all" 
                title={t.nav.achievements}
              >
                <Award className="w-4 h-4 text-slate-500" />
              </button>
              <button 
                onClick={() => setShowSettings(true)}
                className="text-slate-400 hover:text-indigo-600 p-1.5 border border-slate-100 bg-white rounded-lg active:scale-95 transition-all" 
                title={t.nav.settings}
              >
                <Settings className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>
        </header>

        {/* Central Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8" id="central-view-scroller">
           <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full min-h-full"
              >
                {view === 'timer' && (
                  <div className="flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-8 h-auto pb-12">
                    <div className="md:col-span-6 flex flex-col items-center justify-center min-h-[300px] md:min-h-0 bg-white/40 p-6 rounded-[2.5rem] border border-slate-100/80 shadow-sm">
                       <Timer 
                         language={userState.language} 
                         onComplete={handleTimerComplete}
                         focusLength={focusLength}
                         setFocusLength={setFocusLength}
                         breakLength={breakLength}
                         setBreakLength={setBreakLength}
                         timeLeft={timeLeft}
                         setTimeLeft={setTimeLeft}
                         isActive={isTimerActive}
                         setIsActive={setIsTimerActive}
                         isFocus={isFocus}
                         setIsFocus={setIsFocus}
                       />
                    </div>
                    <div className="md:col-span-6 flex flex-col gap-6">
                       <button onClick={() => setIsNuclearActive(!isNuclearActive)} className="w-full text-left focus:outline-none shrink-0" id="nuclear-intervention-btn">
                         <NuclearMode isActive={isNuclearActive} language={userState.language} />
                       </button>
                       <SessionTodoList language={userState.language} durationMinutes={focusLength} />
                       <AudioPlayer 
                         language={userState.language} 
                         preferredPlaylist={userState.preferredPlaylist}
                       />
                       <LevelProgression 
                         userState={userState} 
                         onUpdate={setUserState} 
                       />
                    </div>
                  </div>
                )}
                {view === 'tasks' && <div className="w-full h-full overflow-y-auto pr-1 pb-8"><TaskBoard language={userState.language} /></div>}
                {view === 'goals' && <div className="w-full h-full overflow-y-auto pr-1 pb-8"><GoalBoard language={userState.language} /></div>}
                {view === 'flashcards' && <div className="w-full h-full overflow-y-auto pr-1 pb-8"><Flashcards language={userState.language} /></div>}
                {view === 'library' && <div className="w-full h-full overflow-y-auto pr-1 pb-8"><PDFViewer language={userState.language} /></div>}
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
             <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{t.header.collectiveEnergy}</span>
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

          {showAuthModal && (
            <AccountAuth
              language={userState.language}
              onClose={() => setShowAuthModal(false)}
              onStateUpdateNeeded={refreshState}
            />
          )}

          {sessionSummary && sessionSummary.show && (
            <SessionSummaryModal
              language={userState.language || 'tr'}
              tasksCompleted={sessionSummary.tasksCompleted}
              xpGained={sessionSummary.xpGained}
              durationMinutes={sessionSummary.durationMinutes}
              onClose={() => setSessionSummary(null)}
            />
          )}
        </AnimatePresence>

        {/* Floating Mini Timer Corner Widget */}
        <AnimatePresence>
          {view !== 'timer' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setView('timer')}
              className="fixed bottom-16 right-4 md:bottom-20 md:right-8 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 z-[90] cursor-pointer border border-slate-700/50 group"
            >
              <div className="relative flex items-center justify-center">
                <span className={`w-2.5 h-2.5 rounded-full ${isTimerActive ? (isFocus ? 'bg-indigo-400 animate-ping' : 'bg-emerald-400 animate-ping') : 'bg-slate-500'}`} />
                <span className={`absolute w-2.5 h-2.5 rounded-full ${isTimerActive ? (isFocus ? 'bg-indigo-400' : 'bg-emerald-400') : 'bg-slate-500'}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {isFocus ? 'Focus' : 'Break'}
                </span>
                <span className="text-sm font-mono font-black tracking-tight leading-none text-white">
                  {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTimerActive(!isTimerActive);
                }}
                className="p-1.5 rounded-lg bg-white/15 text-white hover:bg-white/20 transition-all ml-1"
                title={isTimerActive ? 'Pause' : 'Start'}
              >
                {isTimerActive ? <Pause className="w-3.5 h-3.5 stroke-[2.5]" /> : <Play className="w-3.5 h-3.5 stroke-[2.5]" />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
