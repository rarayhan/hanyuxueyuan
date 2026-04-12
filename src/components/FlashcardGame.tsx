import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Vocabulary, SRSData } from '../types';
import { cn, removePinyinTones } from '../lib/utils';
import { Play, Eye, EyeOff, ChevronRight, ChevronLeft, RotateCcw, Check, X, AlertCircle, Info, RefreshCw, PenTool, Layers } from 'lucide-react';
import HanziWriter from 'hanzi-writer';
import { useLanguage } from '../contexts/LanguageContext';

interface FlashcardGameProps {
  words: Vocabulary[];
  onFinish: (results: Record<string, 'easy' | 'hard' | 'difficult'>) => void;
  onCancel: () => void;
}

export default function FlashcardGame({ words, onFinish, onCancel }: FlashcardGameProps) {
  const { showPinyin, setShowPinyin } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showTones, setShowTones] = useState(true);
  const [showCharacter, setShowCharacter] = useState(true);
  const [showOutline, setShowOutline] = useState(true);
  const [results, setResults] = useState<Record<string, 'easy' | 'hard' | 'difficult'>>({});
  const writersRef = useRef<HanziWriter[]>([]);
  const writerContainerRef = useRef<HTMLDivElement>(null);

  const currentWord = words[currentIndex];

  useEffect(() => {
    if (!writerContainerRef.current || !currentWord) return;

    writerContainerRef.current.innerHTML = '';
    writersRef.current = [];

    const chars = currentWord.character.split('');
    const charSize = chars.length > 3 ? 60 : chars.length > 2 ? 80 : chars.length > 1 ? 120 : 200;

    chars.forEach((char) => {
      const charDiv = document.createElement('div');
      charDiv.style.display = 'inline-block';
      charDiv.style.margin = '4px';
      writerContainerRef.current?.appendChild(charDiv);
      
      const writer = HanziWriter.create(charDiv, char, {
        width: charSize,
        height: charSize,
        padding: 5,
        strokeColor: '#C41E3A',
        outlineColor: 'rgba(26, 26, 26, 0.05)',
        showOutline: true,
      });
      writersRef.current.push(writer);
    });

    // Initial sync of visibility
    writersRef.current.forEach(writer => {
      if (showCharacter) writer.showCharacter();
      else writer.hideCharacter();
      if (showOutline) writer.showOutline();
      else writer.hideOutline();
    });
  }, [currentWord, currentIndex]);

  useEffect(() => {
    writersRef.current.forEach(writer => {
      if (showCharacter) writer.showCharacter();
      else writer.hideCharacter();
    });
  }, [showCharacter]);

  useEffect(() => {
    writersRef.current.forEach(writer => {
      if (showOutline) writer.showOutline();
      else writer.hideOutline();
    });
  }, [showOutline]);

  const handleFeedback = (difficulty: 'easy' | 'hard' | 'difficult') => {
    const newResults = { ...results, [currentWord.id]: difficulty };
    setResults(newResults);

    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      onFinish(newResults);
    }
  };

  const animateStroke = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const animateSequence = async () => {
      for (const writer of writersRef.current) {
        await writer.animateCharacter();
      }
    };
    
    animateSequence();
  };

  const displayPinyin = showTones ? currentWord.pinyin : removePinyinTones(currentWord.pinyin);

  return (
    <div className="fixed inset-0 bg-parchment z-50 flex flex-col items-center p-4 md:p-8">
      {/* Header */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-8">
        <button onClick={onCancel} className="text-ink/40 hover:text-ink flex items-center gap-2 font-bold transition-colors">
          <ChevronLeft size={20} />
          Exit Session
        </button>
        <div className="flex flex-col items-end">
          <div className="text-xs font-bold uppercase tracking-widest text-ink/40">Progress</div>
          <div className="text-xl font-serif">{currentIndex + 1} / {words.length}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-2xl h-1.5 bg-ink/5 rounded-full mb-12 overflow-hidden">
        <motion.div 
          className="h-full bg-cinnabar"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
        />
      </div>

      {/* Flashcard Container */}
      <div className="flex-1 w-full max-w-2xl flex flex-col items-center justify-center gap-8">
        <motion.div 
          className="w-full aspect-[4/5] md:aspect-[3/2] relative perspective-1000 cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Side */}
          <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-ink/5 flex flex-col items-center justify-center p-8 backface-hidden">
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
              <div className="flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowCharacter(!showCharacter); }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-2",
                    showCharacter ? "bg-ink text-white border-ink" : "bg-white text-ink/40 border-ink/10"
                  )}
                >
                  <PenTool size={14} />
                  Hanzi
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowOutline(!showOutline); }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-2",
                    showOutline ? "bg-jade text-white border-jade" : "bg-white text-ink/40 border-ink/10"
                  )}
                >
                  <Layers size={14} />
                  Outline
                </button>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowTones(!showTones); }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                    showTones ? "bg-cinnabar text-white border-cinnabar" : "bg-white text-ink/40 border-ink/10"
                  )}
                  title={showTones ? "Hide Tones" : "Show Tones"}
                >
                  {showTones ? "Tones On" : "Tones Off"}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowPinyin(!showPinyin); }}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    showPinyin ? "bg-parchment text-ink" : "text-ink/20 hover:bg-parchment"
                  )}
                >
                  {showPinyin ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 w-full">
              <div ref={writerContainerRef} className="mb-4 flex flex-wrap justify-center items-center gap-2 min-h-[150px] w-full" />
              
              <AnimatePresence mode="wait">
                {showPinyin && (
                  <motion.div 
                    key={displayPinyin}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-2xl font-bold text-cinnabar"
                  >
                    {displayPinyin}
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                onClick={animateStroke}
                className="flex items-center gap-2 px-6 py-3 bg-parchment rounded-xl hover:bg-ink hover:text-parchment transition-all font-bold text-sm"
              >
                <Play size={16} fill="currentColor" />
                Stroke Animation
              </button>
            </div>

            <div className="absolute bottom-8 text-ink/20 text-sm font-bold uppercase tracking-widest">
              Tap to reveal meaning
            </div>
          </div>

          {/* Back Side */}
          <div 
            className="absolute inset-0 bg-ink text-parchment rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 backface-hidden"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="text-6xl font-serif mb-4">{currentWord.character}</div>
            <div className="text-2xl font-bold text-cinnabar mb-6">{displayPinyin}</div>
            <div className="text-3xl text-center max-w-md mb-8">{currentWord.meaning}</div>
            
            {currentWord.examples && currentWord.examples.length > 0 && (
              <div className="bg-white/10 p-6 rounded-2xl w-full">
                <div className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2">Example</div>
                <div className="text-xl mb-1">{currentWord.examples[0].sentence}</div>
                <div className="text-sm opacity-60">{currentWord.examples[0].translation}</div>
              </div>
            )}

            <div className="absolute bottom-8 text-parchment/20 text-sm font-bold uppercase tracking-widest">
              Tap to see character
            </div>
          </div>
        </motion.div>

        {/* Feedback Buttons */}
        <div className="w-full grid grid-cols-3 gap-4">
          <button 
            onClick={() => handleFeedback('difficult')}
            className="flex flex-col items-center gap-2 p-4 bg-white border border-ink/10 rounded-2xl hover:border-cinnabar hover:bg-cinnabar/5 transition-all group"
          >
            <div className="p-3 bg-parchment rounded-xl group-hover:bg-cinnabar group-hover:text-white transition-colors">
              <RefreshCw size={24} />
            </div>
            <span className="font-bold text-sm">Review Again</span>
          </button>

          <button 
            onClick={() => handleFeedback('hard')}
            className="flex flex-col items-center gap-2 p-4 bg-white border border-ink/10 rounded-2xl hover:border-gold hover:bg-gold/5 transition-all group"
          >
            <div className="p-3 bg-parchment rounded-xl group-hover:bg-gold group-hover:text-white transition-colors">
              <Info size={24} />
            </div>
            <span className="font-bold text-sm">New</span>
          </button>

          <button 
            onClick={() => handleFeedback('easy')}
            className="flex flex-col items-center gap-2 p-4 bg-white border border-ink/10 rounded-2xl hover:border-jade hover:bg-jade/5 transition-all group"
          >
            <div className="p-3 bg-parchment rounded-xl group-hover:bg-jade group-hover:text-white transition-colors">
              <Check size={24} />
            </div>
            <span className="font-bold text-sm">I Know</span>
          </button>
        </div>
      </div>
    </div>
  );
}
