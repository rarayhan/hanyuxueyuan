import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Trophy, X, Check, Gamepad2, Zap } from 'lucide-react';
import { Vocabulary } from '../types';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

interface WordGamesProps {
  words: Vocabulary[];
  onFinish: (xpGained: number) => void;
  onCancel: () => void;
}

export default function WordGames({ words, onFinish, onCancel }: WordGamesProps) {
  const { showPinyin, t } = useLanguage();
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'finished'>('lobby');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentWord, setCurrentWord] = useState<Vocabulary | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateRound = useCallback(() => {
    if (words.length < 4) return;
    const correct = words[Math.floor(Math.random() * words.length)];
    const distractors = words
      .filter(w => w.id !== correct.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.meaning);
    
    setCurrentWord(correct);
    setOptions([...distractors, correct.meaning].sort(() => Math.random() - 0.5));
  }, [words]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameState('playing');
    generateRound();
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('finished');
    }
  }, [gameState, timeLeft]);

  const handleAnswer = (answer: string) => {
    if (!currentWord || feedback) return;

    if (answer === currentWord.meaning) {
      setScore(prev => prev + 10);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      generateRound();
    }, 500);
  };

  if (gameState === 'lobby') {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-8 text-center">
        <div className="w-24 h-24 bg-cinnabar/10 rounded-full flex items-center justify-center text-cinnabar animate-pulse">
          <Zap size={48} fill="currentColor" />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-serif">{t.games.title}</h2>
          <p className="text-ink/60 max-w-md">{t.games.description}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={onCancel} className="px-8 py-4 bg-parchment text-ink rounded-2xl font-bold border border-ink/10 hover:bg-ink/5 transition-all">
            {t.games.back}
          </button>
          <button onClick={startGame} className="btn-cinnabar px-12 py-4 text-xl">
            {t.games.start}
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const xpGained = score;
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-8 text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-32 h-32 bg-gold/20 rounded-full flex items-center justify-center text-gold"
        >
          <Trophy size={64} />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-4xl font-serif">{t.games.gameOver}</h2>
          <p className="text-3xl font-bold text-cinnabar">{score} {t.games.points}</p>
          <p className="text-ink/60">You earned {xpGained} XP!</p>
        </div>
        <button 
          onClick={() => onFinish(xpGained)}
          className="btn-jade px-12 py-4 text-xl"
        >
          {t.games.collect}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between bg-white/50 p-4 rounded-2xl border border-ink/5">
        <div className="flex items-center gap-2 text-cinnabar font-bold">
          <Timer size={20} />
          <span className="text-2xl font-mono">{timeLeft}s</span>
        </div>
        <div className="flex items-center gap-2 text-gold font-bold">
          <Trophy size={20} />
          <span className="text-2xl font-mono">{score}</span>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-ink/5 text-center space-y-12 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="text-8xl font-chinese font-bold tracking-widest">{currentWord?.character}</div>
            {showPinyin && <div className="text-2xl text-cinnabar font-bold font-mono">{currentWord?.pinyin}</div>}
          </motion.div>
        </AnimatePresence>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(option)}
              className={cn(
                "p-6 rounded-2xl border-2 font-bold text-lg transition-all",
                feedback === 'correct' && option === currentWord?.meaning ? "bg-jade border-jade text-white" :
                feedback === 'wrong' && option !== currentWord?.meaning ? "bg-cinnabar/10 border-cinnabar/20 text-cinnabar" :
                "bg-parchment border-ink/5 hover:border-cinnabar hover:bg-white"
              )}
            >
              {option}
            </button>
          ))}
        </div>

        {feedback && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "absolute inset-0 flex items-center justify-center pointer-events-none",
              feedback === 'correct' ? "text-jade" : "text-cinnabar"
            )}
          >
            {feedback === 'correct' ? <Check size={120} strokeWidth={4} /> : <X size={120} strokeWidth={4} />}
          </motion.div>
        )}
      </div>
    </div>
  );
}
