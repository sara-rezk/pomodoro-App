import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Zap, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const NuclearMode: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (isActive) {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          // In a real extension this would block, here we just track or warn
          console.log('Nükleer Mod: Sekme değiştirildi!');
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [isActive]);

  return (
    <div className={`glass-panel p-6 rounded-3xl space-y-4 border-2 transition-all ${isActive ? 'border-red-900/50 bg-red-950/20' : 'border-zinc-800'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isActive ? 'bg-red-500 text-white animate-pulse' : 'bg-zinc-800 text-zinc-400'}`}>
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest">Nükleer Mod</h3>
            <p className="text-[10px] text-zinc-500 font-medium">MUTLAK ODAK KORUMASI</p>
          </div>
        </div>
        <div className="text-xs font-mono font-bold text-red-500">
           {isActive ? 'AKTİF' : 'DEVRE DIŞI'}
        </div>
      </div>

      <p className="text-xs text-zinc-400 leading-relaxed">
        Aktifken, dikkat dağıtıcı tüm bildirimler ve otopilot gezinme engellenir. Caydırıcı görseller devreye girer.
      </p>

      {isActive && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-bold uppercase"
        >
          <Zap className="w-3 h-3" />
          Pay-to-Pass Sistemi Devreye Girdi
        </motion.div>
      )}
    </div>
  );
};

export const MindfulIntervention: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-zinc-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="w-32 h-32 rounded-full border-4 border-neon-green/30 flex items-center justify-center mb-8"
      >
        <div className="w-24 h-24 rounded-full bg-neon-green/10 flex items-center justify-center">
            <Zap className="w-12 h-12 text-neon-green" />
        </div>
      </motion.div>
      <h2 className="text-3xl font-bold mb-4 tracking-tighter">Otopilotu Durdur.</h2>
      <p className="text-zinc-400 max-w-md mb-8">
        Şu an gerçekten bu siteye girmek istiyor musun? Yoksa sadece bir refleks mi? 
        3 derin nefes al ve hedefini hatırla.
      </p>
      <div className="space-y-4 w-full max-w-xs">
        <button className="w-full bg-neon-green text-zinc-950 py-4 rounded-3xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all">
          Odağa Geri Dön
        </button>
        <button className="w-full bg-zinc-900 text-zinc-500 py-4 rounded-3xl font-bold uppercase tracking-widest text-xs hover:text-zinc-200 transition-all">
          Devam Et (50 XP Harca)
        </button>
      </div>
    </motion.div>
  );
};
