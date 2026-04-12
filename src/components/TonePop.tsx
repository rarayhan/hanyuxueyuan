import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Volume2, Zap, Heart, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

const TONES = [
  { mark: 'ā', tone: 1, label: 'First' },
  { mark: 'á', tone: 2, label: 'Second' },
  { mark: 'ǎ', tone: 3, label: 'Third' },
  { mark: 'à', tone: 4, label: 'Fourth' },
];

const WORDS = [
  { char: '妈', pinyin: 'mā', tone: 1 },
  { char: '麻', pinyin: 'má', tone: 2 },
  { char: '马', pinyin: 'mǎ', tone: 3 },
  { char: '骂', pinyin: 'mà', tone: 4 },
  { char: '你', pinyin: 'nǐ', tone: 3 },
  { char: '好', pinyin: 'hǎo', tone: 3 },
  { char: '我', pinyin: 'wǒ', tone: 3 },
  { char: '是', pinyin: 'shì', tone: 4 },
  { char: '不', pinyin: 'bù', tone: 4 },
  { char: '人', pinyin: 'rén', tone: 2 },
];

export default function TonePop({ onFinish, onCancel }: { onFinish: (xp: number) => void, onCancel: () => void }) {
  const { t } = useLanguage();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentWord, setCurrentWord] = useState(WORDS[0]);
  const [balloons, setBalloons] = useState<{ id: number, tone: number, x: number, speed: number, progress: number }[]>([]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    window.speechSynthesis.speak(utterance);
  };

  const spawnBalloon = useCallback(() => {
    const id = Date.now();
    const tone = Math.floor(Math.random() * 4) + 1;
    const x = Math.random() * 80 + 10; // 10% to 90%
    const speed = Math.random() * 2 + 1;
    setBalloons(prev => [...prev, { id, tone, x, speed, progress: 0 }]);
  }, []);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setGameState('playing');
    const firstWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(firstWord);
    speak(firstWord.char);
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnInterval = setInterval(spawnBalloon, 1500);
    const moveInterval = setInterval(() => {
      setBalloons(prev => {
        const next = prev.map(b => ({ ...b, progress: b.progress + (b.speed * 0.5) }));
        // Check for missed balloons (progress > 100)
        const missed = next.filter(b => b.progress > 100);
        if (missed.length > 0) {
          setLives(l => Math.max(0, l - missed.length));
        }
        return next.filter(b => b.progress <= 100);
      });
    }, 50);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
    };
  }, [gameState, spawnBalloon]);

  useEffect(() => {
    if (lives === 0 && gameState === 'playing') {
      setGameState('ended');
    }
  }, [lives, gameState]);

  const popBalloon = (id: number, tone: number) => {
    if (tone === currentWord.tone) {
      setScore(s => s + 10);
      const nextWord = WORDS[Math.floor(Math.random() * WORDS.length)];
      setCurrentWord(nextWord);
      speak(nextWord.char);
    } else {
      setLives(l => Math.max(0, l - 1));
    }
    setBalloons(prev => prev.filter(b => b.id !== id));
  };

  if (gameState === 'idle') {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 py-20">
        <div className="w-32 h-32 bg-cinnabar/10 rounded-full flex items-center justify-center text-cinnabar mx-auto animate-bounce">
          <Zap size={64} fill="currentColor" />
        </div>
        <div className="space-y-4">
          <h2 className="text-5xl font-serif">Tone Pop</h2>
          <p className="text-xl text-ink/40 max-w-md mx-auto">Listen to the character and pop the balloon with the correct tone mark!</p>
        </div>
        <div className="flex flex-col gap-4">
          <button onClick={startGame} className="btn-cinnabar px-12 py-5 text-xl">
            START GAME
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
          <h2 className="text-5xl font-serif">Game Over!</h2>
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
    <div className="relative h-[600px] bg-silk/30 rounded-[3rem] border-2 border-ink/5 overflow-hidden">
      {/* HUD */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-4 bg-white/80 backdrop-blur px-6 py-3 rounded-2xl border border-ink/5 shadow-sm">
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <Heart 
                key={i} 
                size={20} 
                className={cn(i < lives ? "text-cinnabar fill-cinnabar" : "text-ink/10")} 
              />
            ))}
          </div>
          <div className="w-px h-4 bg-ink/10" />
          <div className="text-xl font-mono font-bold text-cinnabar">{score}</div>
        </div>

        <div className="bg-white/80 backdrop-blur px-8 py-4 rounded-3xl border-2 border-cinnabar shadow-xl text-center">
          <div className="text-4xl font-chinese mb-1">{currentWord.char}</div>
          <button 
            onClick={() => speak(currentWord.char)}
            className="p-2 bg-cinnabar/10 text-cinnabar rounded-full hover:bg-cinnabar hover:text-white transition-all"
          >
            <Volume2 size={20} />
          </button>
        </div>
      </div>

      {/* Game Area */}
      <div className="absolute inset-0">
        <AnimatePresence>
          {balloons.map(balloon => (
            <motion.button
              key={balloon.id}
              initial={{ y: 600, x: `${balloon.x}%` }}
              animate={{ y: -100 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 10 / balloon.speed, ease: "linear" }}
              onClick={() => popBalloon(balloon.id, balloon.tone)}
              className={cn(
                "absolute w-20 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg",
                balloon.tone === 1 ? "bg-cinnabar" :
                balloon.tone === 2 ? "bg-gold" :
                balloon.tone === 3 ? "bg-jade" :
                "bg-ink"
              )}
            >
              {TONES[balloon.tone - 1].mark}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-white/20" />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
