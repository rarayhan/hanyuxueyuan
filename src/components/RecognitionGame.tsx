import React, { useState, useEffect, useRef } from 'react';
import { Vocabulary, SRSData, WordStatus } from '../types';
import { HSK_VOCAB } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Timer, Zap, Flame } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

interface RecognitionGameProps {
  mode: 'flash' | 'speed' | 'instant';
  onFinish: (results: { vocabId: string; time: number; correct: boolean }[]) => void;
}

export default function RecognitionGame({ mode, onFinish }: RecognitionGameProps) {
  const { showPinyin } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [results, setResults] = useState<{ vocabId: string; time: number; correct: boolean }[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(mode === 'speed' ? 1.5 : 10);
  const [isFlashVisible, setIsFlashVisible] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const quizVocab = useRef([...HSK_VOCAB].sort(() => Math.random() - 0.5).slice(0, 10));
  const currentVocab = quizVocab.current[currentIndex];

  useEffect(() => {
    if (currentVocab) {
      const otherOptions = HSK_VOCAB
        .filter(v => v.id !== currentVocab.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(v => v.meaning);
      setOptions([...otherOptions, currentVocab.meaning].sort(() => Math.random() - 0.5));
      setStartTime(Date.now());
      setTimeLeft(mode === 'speed' ? 1.5 : 10);
      setIsFlashVisible(true);

      if (mode === 'instant') {
        setTimeout(() => setIsFlashVisible(false), 800);
      }
    }
  }, [currentIndex, mode]);

  useEffect(() => {
    if (selectedOption || currentIndex >= quizVocab.current.length) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          handleSelect(''); // Timeout
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, selectedOption]);

  const handleSelect = (option: string) => {
    if (selectedOption) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const endTime = Date.now();
    const timeTaken = endTime - startTime;
    const correct = option === currentVocab.meaning;

    setSelectedOption(option || 'TIMEOUT');
    setIsCorrect(correct);

    if (correct) {
      setCombo(c => c + 1);
    } else {
      setCombo(0);
    }

    setResults(prev => [...prev, { vocabId: currentVocab.id, time: timeTaken, correct }]);

    setTimeout(() => {
      if (currentIndex < quizVocab.current.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        onFinish([...results, { vocabId: currentVocab.id, time: timeTaken, correct }]);
      }
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-ink/10">
            <Timer size={18} className={cn(timeLeft < 0.5 ? "text-cinnabar animate-pulse" : "text-ink/40")} />
            <span className="font-mono font-bold">{timeLeft.toFixed(1)}s</span>
          </div>
          {combo > 1 && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1 px-4 py-2 bg-gold/10 text-gold rounded-full border border-gold/20 font-bold"
            >
              <Zap size={18} />
              {combo} COMBO
            </motion.div>
          )}
        </div>
        <div className="text-sm font-bold text-ink/40 uppercase tracking-widest">
          {currentIndex + 1} / {quizVocab.current.length}
        </div>
      </div>

      <div className="mb-12 text-center h-48 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {isFlashVisible ? (
            <motion.div
              key="char"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="text-9xl font-serif text-ink"
            >
              {currentVocab.character}
            </motion.div>
          ) : (
            <motion.div
              key="hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-4xl text-ink/20 font-serif italic"
            >
              ?
            </motion.div>
          )}
        </AnimatePresence>
        {mode !== 'instant' && showPinyin && (
           <div className="mt-4 text-xl text-ink/40 font-medium">{currentVocab.pinyin}</div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(option)}
            disabled={!!selectedOption}
            className={cn(
              "p-6 rounded-2xl text-center transition-all duration-200 border-2 font-bold text-lg",
              selectedOption === option
                ? isCorrect
                  ? "bg-jade text-white border-jade shadow-lg shadow-jade/20"
                  : "bg-cinnabar text-white border-cinnabar shadow-lg shadow-cinnabar/20"
                : selectedOption && option === currentVocab.meaning
                  ? "bg-jade/10 border-jade text-jade"
                  : "bg-white border-ink/5 hover:border-ink/20 text-ink"
            )}
          >
            {option}
          </button>
        ))}
      </div>

      {mode === 'speed' && (
        <div className="mt-12 text-center">
          <p className="text-ink/40 text-sm font-medium">SPEED MODE: Answer in under 1.5s to keep your streak!</p>
        </div>
      )}
    </div>
  );
}
