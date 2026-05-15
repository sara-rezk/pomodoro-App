import React, { useState } from 'react';
import { UserState, saveUserState } from '../lib/storage';
import { translations, Language } from '../lib/i18n';
import { Globe, Palette, Check, X, Music } from 'lucide-react';
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
  
  const t = translations[localLang].settings;

  const handleSave = async () => {
    const newState = { ...userState, theme: localTheme, language: localLang, preferredPlaylist: localPlaylist };
    await saveUserState(newState);
    onUpdate(newState);
    onClose();
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
          <div className="grid grid-cols-2 gap-3">
            {(['tr', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLocalLang(lang)}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                  localLang === lang 
                    ? 'border-brand-indigo bg-indigo-50 text-brand-indigo font-bold' 
                    : 'border-slate-100 bg-slate-50 text-slate-600'
                }`}
              >
                {lang === 'tr' ? 'Türkçe' : 'English'}
                {localLang === lang && <Check className="w-4 h-4" />}
              </button>
            ))}
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
