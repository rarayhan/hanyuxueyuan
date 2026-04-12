import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Trophy, RefreshCw, Check, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

const COMBINATIONS = [
  { radicals: ['亻', '尔'], result: '你', pinyin: 'nǐ', meaning: 'you' },
  { radicals: ['女', '子'], result: '好', pinyin: 'hǎo', meaning: 'good' },
  { radicals: ['讠', '吾'], result: '语', pinyin: 'yǔ', meaning: 'language' },
  { radicals: ['氵', '气'], result: '汽', pinyin: 'qì', meaning: 'steam/gas' },
  { radicals: ['宀', '豕'], result: '家', pinyin: 'jiā', meaning: 'home/family' },
  { radicals: ['艹', '采'], result: '菜', pinyin: 'cài', meaning: 'vegetable/dish' },
  { radicals: ['口', '马'], result: '吗', pinyin: 'ma', meaning: 'question particle' },
  { radicals: ['日', '月'], result: '明', pinyin: 'míng', meaning: 'bright' },
];

export default function RadicalReactor({ onFinish, onCancel }: { onFinish: (xp: number) => void, onCancel: () => void }) {
  const { showPinyin, t } = useLanguage();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [score, setScore] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedRadicals, setSelectedRadicals] = useState<string[]>([]);
  const [pool, setPool] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const currentCombo = COMBINATIONS[currentIdx];

  const startGame = () => {
    setScore(0);
    setCurrentIdx(0);
    setGameState('playing');
    setupRound(0);
  };

  const setupRound = (idx: number) => {
    const combo = COMBINATIONS[idx];
    const otherRadicals = COMBINATIONS
      .filter((_, i) => i !== idx)
      .flatMap(c => c.radicals)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
    
    setPool([...combo.radicals, ...otherRadicals].sort(() => Math.random() - 0.5));
    setSelectedRadicals([]);
    setFeedback(null);
  };

  const selectRadical = (radical: string) => {
    if (feedback) return;
    
    const newSelected = [...selectedRadicals, radical];
    setSelectedRadicals(newSelected);

    if (newSelected.length === 2) {
      const isCorrect = newSelected.every(r => currentCombo.radicals.includes(r));
      if (isCorrect) {
        setFeedback('correct');
        setScore(s => s + 20);
        setTimeout(() => {
          if (currentIdx + 1 < COMBINATIONS.length) {
            setCurrentIdx(prev => prev + 1);
            setupRound(currentIdx + 1);
          } else {
            setGameState('ended');
          }
        }, 1500);
      } else {
        setFeedback('wrong');
        setTimeout(() => {
          setSelectedRadicals([]);
          setFeedback(null);
        }, 1000);
      }
    }
  };

  if (gameState === 'idle') {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 py-20">
        <div className="w-32 h-32 bg-jade/10 rounded-full flex items-center justify-center text-jade mx-auto rotate-12">
          <RefreshCw size={64} className="animate-spin-slow" />
        </div>
        <div className="space-y-4">
          <h2 className="text-5xl font-serif">Radical Reactor</h2>
          <p className="text-xl text-ink/40 max-w-md mx-auto">Combine the correct radicals to form the target character!</p>
        </div>
        <div className="flex flex-col gap-4">
          <button onClick={startGame} className="btn-cinnabar px-12 py-5 text-xl">
            START REACTOR
          </button>
          <button onClick={onCancel} className="text-ink/40 font-bold hover:text-ink transition-colors">
            BACK
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'ended') {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 py-20">
        <div className="w-32 h-32 bg-gold/10 rounded-full flex items-center justify-center text-gold mx-auto">
          <Trophy size={64} fill="currentColor" />
        </div>
        <div className="space-y-2">
          <h2 className="text-5xl font-serif">Mission Complete!</h2>
          <p className="text-3xl font-bold text-cinnabar">{score} Points</p>
        </div>
        <button 
          onClick={() => onFinish(score)}
          className="btn-cinnabar px-12 py-5 text-xl w-full"
        >
          COLLECT REWARDS
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-10">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-serif font-bold text-ink/40">
          Target: <span className="text-ink">{currentCombo.meaning.toUpperCase()}</span>
        </div>
        <div className="text-3xl font-mono font-bold text-cinnabar">{score}</div>
      </div>

      <div className="flex flex-col items-center gap-12">
        {/* Result Area */}
        <div className="relative">
          <div className={cn(
            "w-64 h-64 rounded-[3rem] border-4 flex items-center justify-center transition-all duration-500",
            feedback === 'correct' ? "bg-jade border-jade text-white" :
            feedback === 'wrong' ? "bg-cinnabar/10 border-cinnabar text-cinnabar" :
            "bg-white border-ink/5 shadow-2xl text-ink/10"
          )}>
            <AnimatePresence mode="wait">
              {feedback === 'correct' ? (
                <motion.div 
                  key="result"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="text-center"
                >
                  <div className="text-9xl font-chinese">{currentCombo.result}</div>
                  {showPinyin && <div className="text-xl font-mono font-bold mt-2">{currentCombo.pinyin}</div>}
                </motion.div>
              ) : (
                <div className="flex gap-4">
                  {selectedRadicals.map((r, i) => (
                    <motion.div 
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-6xl font-chinese text-ink"
                    >
                      {r}
                    </motion.div>
                  ))}
                  {selectedRadicals.length === 0 && <div className="text-9xl font-chinese">?</div>}
                </div>
              )}
            </AnimatePresence>
          </div>
          
          {feedback === 'correct' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-jade font-bold uppercase tracking-widest"
            >
              Excellent! +20 XP
            </motion.div>
          )}
        </div>

        {/* Radical Pool */}
        <div className="grid grid-cols-3 gap-6 w-full">
          {pool.map((radical, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => !selectedRadicals.includes(radical) && selectRadical(radical)}
              disabled={selectedRadicals.includes(radical) || feedback === 'correct'}
              className={cn(
                "h-32 rounded-3xl border-2 flex items-center justify-center text-5xl font-chinese transition-all shadow-sm",
                selectedRadicals.includes(radical) ? "bg-silk border-ink/10 text-ink/20" : "bg-white border-ink/5 text-ink hover:border-cinnabar"
              )}
            >
              {radical}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
