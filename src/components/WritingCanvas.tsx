import React, { useRef, useEffect, useState } from 'react';
import { cn } from '../lib/utils';
import { RotateCcw, Play, Eye, CheckCircle2, Save } from 'lucide-react';
import HanziWriter from 'hanzi-writer';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { OFFLINE_HANZI_DATA } from '../data/offline_hanzi';

interface WritingCanvasProps {
  character: string;
  className?: string;
}

interface SavedAttempt {
  char: string;
  date: Date;
  mistakes: number;
}

export default function WritingCanvas({ character, className }: WritingCanvasProps) {
  const writersRef = useRef<HanziWriter[]>([]);
  const writerContainerRef = useRef<HTMLDivElement>(null);
  
  const quizWritersRef = useRef<HanziWriter[]>([]);
  const quizContainerRef = useRef<HTMLDivElement>(null);

  const [showGuide, setShowGuide] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [savedAttempts, setSavedAttempts] = useState<SavedAttempt[]>([]);
  const [currentMistakes, setCurrentMistakes] = useState(0);

  // HanziWriter Stroke Order Logic
  useEffect(() => {
    if (!writerContainerRef.current) return;

    // Clear previous writers
    writerContainerRef.current.innerHTML = '';
    writersRef.current = [];
    
    const chars = character.split('');
    const charSize = chars.length > 3 ? 40 : chars.length > 2 ? 60 : chars.length > 1 ? 100 : 150;

    chars.forEach((char) => {
      const charDiv = document.createElement('div');
      charDiv.style.display = 'inline-block';
      charDiv.style.margin = '2px';
      writerContainerRef.current?.appendChild(charDiv);

      const writer = HanziWriter.create(charDiv, char, {
        width: charSize,
        height: charSize,
        padding: 5,
        strokeColor: '#C41E3A',
        outlineColor: 'rgba(26, 26, 26, 0.07)',
        drawingColor: '#1A1A1A',
        showOutline: true,
        showCharacter: false,
        charDataLoader: (char, onComplete, onError) => {
          if (OFFLINE_HANZI_DATA[char]) {
            onComplete(OFFLINE_HANZI_DATA[char]);
          } else {
            fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${char}.json`)
              .then(res => res.json())
              .then(onComplete)
              .catch(onError);
          }
        }
      });
      writersRef.current.push(writer);
    });
  }, [character]);

  // HanziWriter Quiz Logic
  useEffect(() => {
    if (!quizContainerRef.current) return;

    quizContainerRef.current.innerHTML = '';
    quizWritersRef.current = [];
    setIsSuccess(false);
    setCurrentMistakes(0);
    
    const chars = character.split('');
    const charSize = chars.length > 1 ? 150 : 300; // slightly smaller if multiple
    let completedCount = 0;
    let totalMistakes = 0;

    chars.forEach((char) => {
      const quizDiv = document.createElement('div');
      quizDiv.style.display = 'inline-block';
      quizDiv.style.margin = '4px';
      quizDiv.style.border = '1px dashed rgba(196, 30, 58, 0.2)';
      quizDiv.style.borderRadius = '12px';
      quizDiv.style.cursor = 'crosshair';
      quizContainerRef.current?.appendChild(quizDiv);

      const quizWriter = HanziWriter.create(quizDiv, char, {
        width: charSize,
        height: charSize,
        showCharacter: false,
        showOutline: showGuide,
        showHintAfterMisses: 3,
        highlightOnComplete: true,
        padding: 10,
        strokeColor: '#1A1A1A',
        drawingColor: '#1A1A1A',
        drawingWidth: 12,
        outlineColor: showGuide ? 'rgba(26, 26, 26, 0.1)' : 'rgba(26, 26, 26, 0)',
        charDataLoader: (char, onComplete, onError) => {
          if (OFFLINE_HANZI_DATA[char]) {
            onComplete(OFFLINE_HANZI_DATA[char]);
          } else {
            fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${char}.json`)
              .then(res => res.json())
              .then(onComplete)
              .catch(onError);
          }
        }
      });
      
      quizWriter.quiz({
        onMistake: () => {
          totalMistakes++;
          setCurrentMistakes(totalMistakes);
        },
        onComplete: () => {
          completedCount++;
          if (completedCount === chars.length) {
            handleSuccess(totalMistakes);
          }
        }
      });
      
      quizWritersRef.current.push(quizWriter);
    });
  }, [character, showGuide]);

  const handleSuccess = (mistakes: number) => {
    setIsSuccess(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C41E3A', '#D4AF37', '#2E8B57']
    });
  };

  const saveAttempt = () => {
    setSavedAttempts(prev => [{
      char: character,
      date: new Date(),
      mistakes: currentMistakes
    }, ...prev]);
    resetQuiz();
  };

  const resetQuiz = () => {
    setIsSuccess(false);
    setCurrentMistakes(0);
    quizWritersRef.current.forEach(writer => {
      writer.quiz(); // restarts the quiz
    });
  };

  const animateStroke = () => {
    const animateSequence = async () => {
      for (const writer of writersRef.current) {
        await writer.animateCharacter();
      }
    };
    animateSequence();
  };

  return (
    <div className={cn("flex flex-col items-center gap-8", className)}>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Stroke Order Guide */}
        <div className="flex flex-col items-center gap-4">
          <div className="text-xs font-bold uppercase tracking-widest text-ink/40">Stroke Order</div>
          <div className="ink-glass p-4 rounded-xl bg-white/40 flex items-center justify-center min-w-[180px] min-h-[180px]">
            <div ref={writerContainerRef} className="flex flex-wrap justify-center items-center gap-2" />
          </div>
          <button
            onClick={animateStroke}
            className="flex items-center gap-2 px-4 py-2 bg-cinnabar text-white rounded-lg hover:bg-cinnabar/90 transition-all shadow-lg shadow-cinnabar/20 font-bold text-sm"
          >
            <Play size={16} fill="currentColor" />
            Animate
          </button>
        </div>

        {/* Practice Area (Quiz Mode) */}
        <div className="flex flex-col items-center gap-4">
          <div className="text-xs font-bold uppercase tracking-widest text-ink/40">Practice Area</div>
          <div className="relative ink-glass p-4 rounded-xl bg-white min-h-[320px] flex items-center justify-center">
            
            <AnimatePresence>
              {isSuccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-4"
                >
                  <div className="w-20 h-20 bg-jade text-white rounded-full flex items-center justify-center shadow-lg shadow-jade/30">
                    <CheckCircle2 size={40} />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-serif font-bold text-ink">Perfect!</h3>
                    <p className="text-ink/60 font-medium">Mistakes: {currentMistakes}</p>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={resetQuiz}
                      className="px-4 py-2 bg-white border border-ink/10 rounded-lg hover:bg-parchment transition-colors text-sm font-bold text-ink"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={saveAttempt}
                      className="flex items-center gap-2 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors text-sm font-bold shadow-lg shadow-gold/20"
                    >
                      <Save size={16} />
                      Save Attempt
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={quizContainerRef} className="flex flex-wrap justify-center items-center gap-2 relative z-10" />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={resetQuiz}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-ink/10 rounded-lg hover:bg-parchment transition-colors text-sm font-medium"
            >
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              onClick={() => setShowGuide(!showGuide)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors text-sm font-medium",
                showGuide ? "bg-ink text-parchment border-ink" : "bg-white text-ink border-ink/10"
              )}
            >
              <Eye size={16} />
              {showGuide ? "Hide Guide" : "Show Guide"}
            </button>
          </div>
        </div>
      </div>

      {/* Saved Attempts */}
      {savedAttempts.length > 0 && (
        <div className="w-full max-w-2xl mt-8 pt-8 border-t border-ink/10">
          <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
            <Save size={20} className="text-gold" />
            Saved Attempts
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {savedAttempts.map((attempt, idx) => (
              <div key={idx} className="bg-silk p-4 rounded-xl border border-ink/5 flex flex-col items-center gap-2">
                <span className="text-4xl font-chinese text-ink">{attempt.char}</span>
                <div className="text-center">
                  <div className="text-xs font-bold text-ink/40">{attempt.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div className={cn(
                    "text-xs font-bold mt-1",
                    attempt.mistakes === 0 ? "text-jade" : "text-cinnabar"
                  )}>
                    {attempt.mistakes === 0 ? 'Flawless' : `${attempt.mistakes} mistakes`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
