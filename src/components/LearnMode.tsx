import React, { useState } from 'react';
import { Vocabulary } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, BookOpen, Play, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { cn, removePinyinTones } from '../lib/utils';
import WritingCanvas from './WritingCanvas';
import { useLanguage } from '../contexts/LanguageContext';

interface LearnModeProps {
  words: Vocabulary[];
  onFinish: () => void;
  onCancel: () => void;
}

export default function LearnMode({ words, onFinish, onCancel }: LearnModeProps) {
  const { showPinyin } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTones, setShowTones] = useState(true);
  const currentWord = words[currentIndex];

  const nextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish();
    }
  };

  const prevWord = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const displayPinyin = showTones ? currentWord.pinyin : removePinyinTones(currentWord.pinyin);

  return (
    <div className="fixed inset-0 bg-parchment z-50 flex flex-col items-center p-4 md:p-8 overflow-y-auto">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <button onClick={onCancel} className="text-ink/40 hover:text-ink flex items-center gap-2 font-bold transition-colors">
          <ChevronLeft size={20} />
          Exit Learning
        </button>
        <div className="flex flex-col items-end">
          <div className="text-xs font-bold uppercase tracking-widest text-ink/40">Learning Mode</div>
          <div className="text-xl font-serif">{currentIndex + 1} / {words.length}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-4xl h-1.5 bg-ink/5 rounded-full mb-12 overflow-hidden">
        <motion.div 
          className="h-full bg-jade"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
        />
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Word Info Card */}
        <motion.div 
          key={`info-${currentWord.id}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-ink/5 space-y-8 relative"
        >
          <div className="absolute top-6 right-6">
            <button 
              onClick={() => setShowTones(!showTones)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                showTones ? "bg-cinnabar text-white border-cinnabar" : "bg-white text-ink/40 border-ink/10"
              )}
            >
              {showTones ? "Tones On" : "Tones Off"}
            </button>
          </div>

          <div className="text-center space-y-4">
            <div className="text-8xl font-serif text-ink">{currentWord.character}</div>
            {showPinyin && <div className="text-3xl font-bold text-cinnabar">{displayPinyin}</div>}
            <div className="text-2xl text-ink/60">{currentWord.meaning}</div>
          </div>

          {currentWord.examples && currentWord.examples.length > 0 && (
            <div className="space-y-4 pt-8 border-t border-ink/5">
              <div className="flex items-center gap-2 text-jade font-bold uppercase tracking-widest text-xs">
                <BookOpen size={16} />
                Example Sentence
              </div>
              {currentWord.examples.map((ex, i) => (
                <div key={i} className="bg-parchment/50 p-6 rounded-2xl space-y-2">
                  <div className="text-2xl leading-relaxed">{ex.sentence}</div>
                  <div className="text-ink/60 italic">{ex.translation}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Writing Practice */}
        <motion.div 
          key={`writing-${currentWord.id}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-ink/5"
        >
          <WritingCanvas character={currentWord.character} className="w-full" />
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/80 backdrop-blur-md p-4 rounded-full shadow-2xl border border-ink/5">
        <button 
          onClick={prevWord}
          disabled={currentIndex === 0}
          className="p-4 rounded-full hover:bg-parchment disabled:opacity-20 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="h-8 w-px bg-ink/10" />
        
        <button 
          onClick={nextWord}
          className="px-8 py-4 bg-jade text-white rounded-full font-bold flex items-center gap-2 hover:bg-jade/90 transition-all shadow-lg shadow-jade/20"
        >
          {currentIndex === words.length - 1 ? (
            <>
              <CheckCircle2 size={20} />
              Finish Learning
            </>
          ) : (
            <>
              Next Word
              <ChevronRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
