import React, { useState } from 'react';
import { UserState, saveUserState, getTasks, getFlashcards, getGoals } from '../lib/storage';
import { translations, Language } from '../lib/i18n';
import { Globe, Palette, Check, X, Music, Download, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SettingsProps {
  userState: UserState;
  onUpdate: (newState: UserState) => void;
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ userState, onUpdate, onClose }) => {
  const [localTheme, setLocalTheme] = useState(userState.theme);
  const [localLang, setLocalLang] = useState(userState.language);
  const [localPlaylist, setLocalPlaylist] = useState(userState.preferredPlaylist || '');
  const [isExporting, setIsExporting] = useState(false);
  
  const t = translations[localLang].settings;

  const handleSave = async () => {
    const newState = { ...userState, theme: localTheme, language: localLang, preferredPlaylist: localPlaylist };
    await saveUserState(newState);
    onUpdate(newState);
    onClose();
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const [tasks, flashcards, goals] = await Promise.all([
        getTasks(),
        getFlashcards(),
        getGoals(),
      ]);

      const localSessionTodosRaw = localStorage.getItem('lumina_session_todos');
      const sessionTodos = localSessionTodosRaw ? JSON.parse(localSessionTodosRaw) : [];

      const backupData = {
        exportedAt: new Date().toISOString(),
        appName: 'Lumina Focus Space',
        userProfile: {
          xp: userState.xp,
          level: userState.level,
          streak: userState.streak,
          language: userState.language,
          theme: userState.theme,
        },
        tasks,
        flashcards,
        goals,
        sessionTodos,
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `lumina_focus_space_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export system backup', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-8 max-w-md w-full relative max-h-[90vh] overflow-y-auto custom-scrollbar"
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
        {t.title}
      </h2>

      <div className="space-y-8">
        {/* Language Selection */}
        <div className="space-y-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Globe className="w-3 h-3" /> {t.language}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['tr', 'en', 'ar'] as Language[]).map((lang) => {
              const labelMap: Record<Language, string> = {
                tr: 'Türkçe',
                en: 'English',
                ar: 'العربية'
              };
              return (
                <button
                  key={lang}
                  onClick={() => setLocalLang(lang)}
                  className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 text-center ${
                    localLang === lang 
                      ? 'border-brand-indigo bg-indigo-50 text-brand-indigo font-bold shadow-sm' 
                      : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
                  }`}
                >
                  <span className="text-xs">{labelMap[lang]}</span>
                  {localLang === lang && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Theme Selection */}
        <div className="space-y-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Palette className="w-3 h-3" /> {t.theme}
          </label>
          <div className="space-y-2">
            {(['dark', 'light', 'contrast'] as const).map((theme) => (
              <button
                key={theme}
                onClick={() => setLocalTheme(theme)}
                className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between ${
                  localTheme === theme 
                    ? 'border-brand-indigo bg-indigo-50 text-brand-indigo font-bold' 
                    : 'border-slate-100 bg-slate-50 text-slate-600'
                }`}
              >
                <span className="capitalize">{t.themes[theme]}</span>
                {localTheme === theme && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Playlist URL */}
        <div className="space-y-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Music className="w-3 h-3" /> {t.music.title}
          </label>
          <input 
            type="text" 
            value={localPlaylist}
            onChange={(e) => setLocalPlaylist(e.target.value)}
            placeholder={t.music.placeholder}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-indigo text-xs text-slate-600"
          />
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter italic">
            * Spotify embed linklerini kullanmanız önerilir.
          </p>
        </div>

        {/* Export Data */}
        <div className="space-y-4 pt-6 border-t border-slate-100">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Download className="w-3.5 h-3.5 text-slate-400" />
            {localLang === 'tr' ? 'Verileri Yedekle' : localLang === 'ar' ? 'نسخ احتياطي للبيانات' : 'Backup Data'}
          </label>
          <div className="bg-slate-50 border border-slate-100/60 rounded-2xl p-4 space-y-3">
            <p className="text-[11px] leading-relaxed text-slate-500">
              {localLang === 'tr'
                ? 'Hedeflerinizi, çalışma görevlerinizi, hafıza kartlarınızı ve seviye ilerlemenizi JSON formatında yedekleyin.'
                : localLang === 'ar'
                ? 'احتفظ بنسخة احتياطية من أهدافك ومهامك وبطاقات الذاكرة وتقدم المستوى كملف JSON.'
                : 'Backup your goals, study tasks, flashcards, and level progress as a JSON file.'}
            </p>
            <button
              onClick={handleExportData}
              disabled={isExporting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-slate-100 active:scale-98 text-slate-700 hover:text-indigo-600 border border-slate-200/80 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-75"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
              ) : (
                <Download className="w-3.5 h-3.5 text-indigo-500" />
              )}
              {isExporting ? t.exporting : t.export}
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-brand-indigo text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-98 transition-all shadow-lg shadow-indigo-200 mt-4"
        >
          {t.save}
        </button>
      </div>
    </motion.div>
  );
};
