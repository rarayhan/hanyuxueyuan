import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { Zap, Trophy, Check, X, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

const SENTENCES = [
  { words: ['我', '是', '学生'], english: 'I am a student', pinyin: 'Wǒ shì xuéshēng' },
  { words: ['你', '好', '吗'], english: 'How are you?', pinyin: 'Nǐ hǎo ma?' },
  { words: ['他', '不', '是', '老师'], english: 'He is not a teacher', pinyin: 'Tā bù shì lǎoshī' },
  { words: ['我们', '去', '商店'], english: 'We go to the store', pinyin: 'Wǒmen qù shāngdiàn' },
  { words: ['她', '在', '家'], english: 'She is at home', pinyin: 'Tā zài jiā' },
  { words: ['你', '叫', '什么', '名字'], english: 'What is your name?', pinyin: 'Nǐ jiào shénme míngzì?' },
];

interface SushiPiece {
  id: string;
  text: string;
}

export default function SentenceSushi({ onFinish, onCancel }: { onFinish: (xp: number) => void, onCancel: () => void }) {
  const { showPinyin, t } = useLanguage();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [score, setScore] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [shuffledPieces, setShuffledPieces] = useState<SushiPiece[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const currentSentence = SENTENCES[currentIdx];

  const startGame = () => {
    setScore(0);
    setCurrentIdx(0);
    setGameState('playing');
    setupRound(0);
  };

  const setupRound = (idx: number) => {
    const sentence = SENTENCES[idx];
    // Fisher-Yates shuffle for better randomness
    const pieces = sentence.words.map((word, i) => ({ id: `${idx}-${i}`, text: word }));
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    setShuffledPieces(pieces);
    setFeedback(null);
  };

  const checkOrder = (newOrder: SushiPiece[]) => {
    setShuffledPieces(newOrder);
    if (newOrder.map(p => p.text).join('') === currentSentence.words.join('')) {
      setFeedback('correct');
      setScore(s => s + 30);
      setTimeout(() => {
        if (currentIdx + 1 < SENTENCES.length) {
          const nextIdx = currentIdx + 1;
          setCurrentIdx(nextIdx);
          setupRound(nextIdx);
        } else {
          setGameState('ended');
        }
      }, 2000);
    }
  };

  if (gameState === 'idle') {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 py-20">
        <div className="w-32 h-32 bg-gold/10 rounded-full flex items-center justify-center text-gold mx-auto rotate-12">
          <span className="text-6xl">🍣</span>
        </div>
        <div className="space-y-4">
          <h2 className="text-5xl font-serif">Sentence Sushi</h2>
          <p className="text-xl text-ink/40 max-w-md mx-auto">Drag the sushi pieces into the correct grammatical order!</p>
        </div>
        <div className="flex flex-col gap-4">
          <button onClick={startGame} className="btn-cinnabar px-12 py-5 text-xl">
            START SERVING
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
          <h2 className="text-5xl font-serif">Chef's Special!</h2>
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
      <div className="text-center space-y-4">
        <div className="text-3xl font-serif italic text-ink/60">"{currentSentence.english}"</div>
        <div className="text-3xl font-mono font-bold text-cinnabar">{score}</div>
      </div>

      <div className="bg-white/50 p-12 rounded-[4rem] border-4 border-dashed border-ink/5 min-h-[200px] flex items-center justify-center">
        <Reorder.Group 
          axis="x" 
          values={shuffledPieces} 
          onReorder={checkOrder}
          className="flex flex-wrap gap-4 justify-center"
        >
          {shuffledPieces.map((piece) => (
            <Reorder.Item
              key={piece.id}
              value={piece}
              className={cn(
                "px-8 py-6 bg-white rounded-2xl border-2 shadow-lg cursor-grab active:cursor-grabbing transition-all",
                feedback === 'correct' ? "border-jade bg-jade text-white" : "border-ink/5 text-ink hover:border-cinnabar"
              )}
            >
              <div className="text-4xl font-chinese">{piece.text}</div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

      <AnimatePresence>
        {feedback === 'correct' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center space-y-2"
          >
            {showPinyin && <div className="text-2xl font-mono font-bold text-cinnabar">{currentSentence.pinyin}</div>}
            <div className="text-jade font-bold uppercase tracking-widest">Perfect Order! +30 XP</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center text-ink/20 font-bold uppercase tracking-widest text-sm">
        Drag words to reorder
      </div>
    </div>
  );
}
