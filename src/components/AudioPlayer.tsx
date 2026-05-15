import React, { useState, useRef, useEffect } from 'react';
import { Music, Wind, Waves, Trees, Volume2, CloudRain, Disc, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, translations } from '../lib/i18n';

const SOUNDS = [
  { id: 'lofi', names: { tr: 'Lo-Fi Radyo', en: 'Lo-Fi Radio' }, icon: Music, url: 'https://stream.zeno.fm/0r0xa792kwzuv' },
  { id: 'rain', names: { tr: 'Yağmur Sesi', en: 'Rain Sounds' }, icon: CloudRain, url: 'https://www.soundjay.com/nature/rain-03.mp3' },
  { id: 'nature', names: { tr: 'Orman Sesi', en: 'Forest Sounds' }, icon: Trees, url: 'https://www.soundjay.com/nature/forest-01.mp3' },
  { id: 'wind', names: { tr: 'Rüzgar Sesi', en: 'Wind Sounds' }, icon: Wind, url: 'https://www.soundjay.com/nature/wind-01.mp3' },
];

interface AudioPlayerProps {
  language: Language;
  preferredPlaylist?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ language, preferredPlaylist }) => {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [showExternal, setShowExternal] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const t = translations[language];

  const toggleSound = (soundId: string) => {
    if (activeSound === soundId) {
      audioRef.current?.pause();
      setActiveSound(null);
    } else {
      const sound = SOUNDS.find(s => s.id === soundId);
      if (sound) {
        if (audioRef.current) {
          audioRef.current.src = sound.url;
          audioRef.current.play().catch(e => console.log("Audio play blocked", e));
        }
        setActiveSound(soundId);
        // If switching to ambient, we might want to stop the external music, but we can't easily control an iframe.
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Special handling for Spotify links to ensure they are embeddable
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    if (url.includes('spotify.com')) {
      if (url.includes('/embed')) return url;
      return url.replace('open.spotify.com/', 'open.spotify.com/embed/');
    }
    if (url.includes('music.apple.com')) {
        if (url.includes('/embed')) return url;
        return url.replace('music.apple.com', 'embed.music.apple.com');
    }
    return url;
  };

  return (
    <div className="glass-panel p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <button 
                onClick={() => setShowExternal(false)}
                className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${!showExternal ? 'text-brand-indigo' : 'text-slate-300'}`}
            >
                Ambient
            </button>
            <button 
                onClick={() => setShowExternal(true)}
                className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${showExternal ? 'text-brand-indigo' : 'text-slate-300'}`}
            >
                Cortex Music
            </button>
        </div>
        <Volume2 className="w-4 h-4 text-slate-400" />
      </div>

      <AnimatePresence mode="wait">
        {!showExternal ? (
          <motion.div 
            key="ambient"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-3">
              {SOUNDS.map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => toggleSound(sound.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                    activeSound === sound.id
                      ? 'bg-indigo-50 border-brand-indigo text-brand-indigo'
                      : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <sound.icon className={`w-5 h-5 mb-2 ${activeSound === sound.id ? 'animate-pulse' : ''}`} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{sound.names[language || 'tr']}</span>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[9px] uppercase font-black tracking-widest text-slate-400">
                <span>Amplitude</span>
                <span className="text-brand-indigo">{Math.round(volume * 100)}%</span>
              </div>
              <div className="relative h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div 
                  className="absolute top-0 left-0 h-full bg-brand-indigo transition-all" 
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="external"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            {preferredPlaylist ? (
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 relative group">
                <iframe
                  src={getEmbedUrl(preferredPlaylist) || ''}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-slate-100 rounded-2xl">
                <Disc className="w-10 h-10 text-slate-200" />
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 max-w-[150px]">
                  {t.settings.music.placeholder}
                </p>
              </div>
            )}
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                 <p className="text-[8px] font-bold text-brand-indigo uppercase tracking-tight leading-relaxed">
                   Spotify veya Apple Music linkinizi "Ayarlar" kısmından güncelleyebilirsiniz.
                 </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} loop hidden />
    </div>
  );
};
