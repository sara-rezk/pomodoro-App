import React, { useState, useEffect } from 'react';
import { Plus, Brain, Sparkles, Loader2, ChevronRight, ChevronLeft, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flashcard, getFlashcards, saveFlashcards } from '../lib/storage';
import { translations, Language } from '../lib/i18n';

interface FlashcardProps {
  language: Language;
}

export const Flashcards: React.FC<FlashcardProps> = ({ language }) => {
  const t = translations[language || 'tr'].flashcards;
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputText, setInputText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    getFlashcards().then(setCards);
  }, []);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await response.json();
      if (data.cards) {
        const newCards: Flashcard[] = data.cards.map((c: any) => ({
          ...c,
          id: crypto.randomUUID(),
          interval: 0,
          repetition: 0,
          easeFactor: 2.5,
          nextReview: new Date().toISOString(),
        }));
        const updatedCards = [...cards, ...newCards];
        setCards(updatedCards);
        saveFlashcards(updatedCards);
        setInputText('');
      }
    } catch (error) {
      console.error('Flashcard AI Error:', error);
    } finally {
      setIsGenerating(true); // Wait, setting to true? Typo fixed to false below
      setIsGenerating(false);
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto w-full px-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Side: Stats & Generator */}
        <div className="md:col-span-4 space-y-6">
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{t.stats}</h3>
            <div className="space-y-4">
               <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.totalCount}</div>
                  <div className="text-2xl font-black text-brand-indigo">{cards.length}</div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">{t.completed}</div>
                    <div className="text-lg font-bold text-slate-700">0</div>
                 </div>
                 <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">{t.review}</div>
                    <div className="text-lg font-bold text-slate-700">{cards.length}</div>
                 </div>
               </div>
            </div>
          </div>

          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-xs font-bold flex items-center gap-2 uppercase tracking-[0.2em] text-slate-400">
              <Brain className="w-4 h-4 text-brand-indigo" />
              {t.generator}
            </h3>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.placeholder}
              className="w-full h-32 bg-slate-50 border border-slate-100 rounded-xl p-4 focus:outline-none focus:border-brand-indigo transition-colors text-xs resize-none text-slate-600"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !inputText.trim()}
              className="w-full bg-brand-indigo text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {t.generate}
            </button>
          </div>
        </div>

        {/* Right Side: Flashcard Player */}
        <div className="md:col-span-8">
          {cards.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between px-4">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">{currentIndex + 1} / {cards.length}</span>
                <div className="flex gap-4">
                  <button onClick={prevCard} className="p-2 bg-white border border-slate-100 rounded-full text-slate-400 hover:text-brand-indigo transition-colors shadow-sm"><ChevronLeft className="w-5 h-5"/></button>
                  <button onClick={nextCard} className="p-2 bg-white border border-slate-100 rounded-full text-slate-400 hover:text-brand-indigo transition-colors shadow-sm"><ChevronRight className="w-5 h-5"/></button>
                </div>
              </div>

              <motion.div
                className="relative h-96 rounded-[2.5rem] cursor-pointer perspective-1000 group"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <motion.div
                  className="w-full h-full text-center transition-all duration-700 preserve-3d"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                >
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden glass-panel flex flex-col items-center justify-center p-12">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300 mb-8">{t.probe}</span>
                    <p className="text-2xl font-bold tracking-tight text-slate-800 leading-relaxed max-w-md">{cards[currentIndex]?.question}</p>
                    <div className="mt-12 flex items-center gap-2 text-slate-400 text-[10px] uppercase font-black tracking-widest group-hover:text-brand-indigo transition-colors">
                      <RotateCw className="w-3 h-3" /> {t.flip}
                    </div>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 backface-hidden bg-brand-indigo border border-brand-indigo rounded-[2.5rem] flex flex-col items-center justify-center p-12 rotate-y-180 shadow-2xl">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 mb-8">{t.response}</span>
                    <p className="text-xl text-white leading-relaxed font-medium max-w-md">{cards[currentIndex]?.answer}</p>
                  </div>
                </motion.div>
              </motion.div>

              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((quality) => (
                  <button
                    key={quality}
                    onClick={nextCard}
                    className="bg-white border border-slate-100 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-brand-indigo hover:text-brand-indigo transition-all shadow-sm"
                  >
                    {quality === 1 ? t.difficulty.hard : quality === 2 ? t.difficulty.weak : quality === 3 ? t.difficulty.strong : t.difficulty.elite}
                  </button>
                ))}
              </div>
            </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center py-20 glass-panel border-dashed border-2 border-slate-200">
                <Brain className="w-16 h-16 text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{t.noCards}</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
