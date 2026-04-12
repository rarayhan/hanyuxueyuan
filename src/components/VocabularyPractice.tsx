import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  PenTool, 
  Volume2, 
  Search,
  Filter,
  Star,
  CheckCircle2
} from 'lucide-react';
import HanziWriter from 'hanzi-writer';
import { Vocabulary } from '../types';
import { ALL_WORDS } from '../data/hsk_data';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

export default function VocabularyPractice() {
  const { showPinyin, setShowPinyin, t } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const writersRef = useRef<HanziWriter[]>([]);
  const writerContainerRef = useRef<HTMLDivElement>(null);

  const filteredWords = useMemo(() => {
    return ALL_WORDS.filter(word => {
      const matchesLevel = selectedLevel === 'all' || word.level === selectedLevel;
      const matchesSearch = word.character.includes(searchQuery) || 
                           word.pinyin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           word.meaning.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesLevel && matchesSearch;
    });
  }, [selectedLevel, searchQuery]);

  const currentWord = filteredWords[currentIndex];

  useEffect(() => {
    if (currentWord && writerContainerRef.current) {
      writerContainerRef.current.innerHTML = '';
      writersRef.current = [];
      
      const chars = currentWord.character.split('');
      chars.forEach(char => {
        const charContainer = document.createElement('div');
        charContainer.className = "inline-block bg-silk/30 rounded-2xl border-2 border-ink/5 p-2 m-1 shadow-inner cursor-pointer";
        writerContainerRef.current?.appendChild(charContainer);
        
        const writer = HanziWriter.create(charContainer, char, {
          width: chars.length > 2 ? 120 : 200,
          height: chars.length > 2 ? 120 : 200,
          padding: 10,
          strokeAnimationSpeed: 1,
          delayBetweenStrokes: 200,
          outlineColor: '#eee',
          strokeColor: '#e11d48', // cinnabar
          radicalColor: '#f59e0b', // gold
        });
        writersRef.current.push(writer);
        
        charContainer.onclick = () => writer.animateCharacter();
      });
    }
  }, [currentWord]);

  const animateStroke = () => {
    writersRef.current.forEach((writer, i) => {
      setTimeout(() => writer.animateCharacter(), i * 1000);
    });
  };

  const startQuiz = () => {
    writersRef.current.forEach(writer => writer.quiz());
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    if (currentIndex < filteredWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!currentWord) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Search size={48} className="text-ink/10" />
        <p className="text-xl text-ink/40 font-serif">No words found matching your criteria.</p>
        <button 
          onClick={() => { setSelectedLevel('all'); setSearchQuery(''); }}
          className="text-cinnabar font-bold hover:underline"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-ink/10 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-3xl font-serif font-bold flex items-center gap-3">
            <BookOpen className="text-cinnabar" />
            Vocabulary Practice
          </h2>
          <p className="text-ink/40 font-medium">Master HSK characters with stroke order and examples.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4, 'all'].map(level => (
            <button
              key={level}
              onClick={() => { setSelectedLevel(level as any); setCurrentIndex(0); }}
              className={cn(
                "px-6 py-2 rounded-xl font-bold transition-all border-2",
                selectedLevel === level 
                  ? "bg-cinnabar border-cinnabar text-white shadow-lg shadow-cinnabar/20" 
                  : "bg-white border-ink/5 text-ink/40 hover:border-ink/10"
              )}
            >
              {level === 'all' ? 'ALL' : `HSK ${level}`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Word List / Search */}
        <div className="lg:col-span-1 bg-white rounded-[2.5rem] border border-ink/10 shadow-sm overflow-hidden flex flex-col h-[700px]">
          <div className="p-6 border-b border-ink/5 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/20" size={18} />
              <input 
                type="text"
                placeholder="Search words..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentIndex(0); }}
                className="w-full pl-12 pr-4 py-3 bg-silk rounded-2xl border-none focus:ring-2 focus:ring-cinnabar/20 transition-all font-medium"
              />
            </div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-ink/40">
              <span>{filteredWords.length} Words found</span>
              <span>{currentIndex + 1} of {filteredWords.length}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredWords.map((word, idx) => (
              <button
                key={word.id}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "w-full p-4 rounded-2xl flex items-center justify-between transition-all group",
                  currentIndex === idx 
                    ? "bg-cinnabar/5 border-2 border-cinnabar/20" 
                    : "hover:bg-silk/50 border-2 border-transparent"
                )}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-chinese">{word.character}</span>
                  <div className="text-left">
                    {showPinyin && (
                      <div className={cn("font-bold text-sm", currentIndex === idx ? "text-cinnabar" : "text-ink")}>
                        {word.pinyin}
                      </div>
                    )}
                    <div className="text-xs text-ink/40 truncate max-w-[120px]">{word.meaning}</div>
                  </div>
                </div>
                <div className="text-[10px] font-bold bg-silk px-2 py-1 rounded-lg text-ink/40">
                  HSK {word.level}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Display */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] p-12 border border-ink/10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
              <PenTool size={300} />
            </div>

            <div className="flex flex-col md:flex-row gap-12 items-center">
              {/* Stroke Order Container */}
              <div className="space-y-6 flex flex-col items-center">
                <div 
                  ref={writerContainerRef}
                  className="flex flex-wrap justify-center gap-2"
                />
                <div className="flex gap-3">
                  <button 
                    onClick={animateStroke}
                    className="flex items-center gap-2 px-6 py-3 bg-cinnabar text-white rounded-2xl font-bold shadow-lg shadow-cinnabar/20 hover:scale-105 transition-all"
                  >
                    <PenTool size={18} />
                    Animate
                  </button>
                  <button 
                    onClick={startQuiz}
                    className="flex items-center gap-2 px-6 py-3 bg-gold text-white rounded-2xl font-bold shadow-lg shadow-gold/20 hover:scale-105 transition-all"
                  >
                    <CheckCircle2 size={18} />
                    Practice
                  </button>
                </div>
              </div>

              {/* Word Info */}
              <div className="flex-1 space-y-8 w-full">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <h1 className="text-7xl font-chinese text-ink">{currentWord.character}</h1>
                      <button 
                        onClick={() => speak(currentWord.character)}
                        className="p-3 bg-silk rounded-full text-ink/40 hover:text-cinnabar transition-colors"
                      >
                        <Volume2 size={24} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <AnimatePresence mode="wait">
                        {showPinyin && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-3xl font-bold text-cinnabar tracking-widest"
                          >
                            {currentWord.pinyin}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <button 
                        onClick={() => setShowPinyin(!showPinyin)}
                        className="p-2 text-ink/20 hover:text-ink transition-colors"
                      >
                        {showPinyin ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-jade/10 text-jade rounded-xl font-bold text-sm uppercase tracking-widest">
                    HSK {currentWord.level}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-ink/20">Meaning</div>
                  <p className="text-2xl font-serif text-ink/80 leading-relaxed">{currentWord.meaning}</p>
                </div>

                <div className="space-y-4">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-ink/20">Example Sentences</div>
                  <div className="space-y-4">
                    {currentWord.examples?.map((ex, i) => (
                      <div key={i} className="bg-silk/30 p-6 rounded-2xl border border-ink/5 space-y-2 group hover:border-cinnabar/20 transition-all">
                        <div className="text-xl font-chinese text-ink">{ex.sentence}</div>
                        {showPinyin && <div className="text-cinnabar font-bold text-sm">{ex.pinyin}</div>}
                        <div className="text-ink/50 italic font-serif">"{ex.translation}"</div>
                      </div>
                    )) || (
                      <div className="text-ink/20 italic">No examples available for this word yet.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="mt-12 pt-8 border-t border-ink/5 flex items-center justify-between">
              <button 
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-ink/5 rounded-2xl font-bold text-ink/40 hover:border-cinnabar hover:text-cinnabar disabled:opacity-20 transition-all"
              >
                <ChevronLeft size={20} />
                Previous
              </button>
              <div className="text-ink/20 font-mono font-bold">
                {currentIndex + 1} / {filteredWords.length}
              </div>
              <button 
                onClick={handleNext}
                disabled={currentIndex === filteredWords.length - 1}
                className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-ink/5 rounded-2xl font-bold text-ink/40 hover:border-cinnabar hover:text-cinnabar disabled:opacity-20 transition-all"
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
