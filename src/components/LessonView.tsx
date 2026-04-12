import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  MessageSquare, 
  Headphones, 
  Mic, 
  PenTool, 
  Type, 
  Layers, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Play,
  GraduationCap,
  Star
} from 'lucide-react';
import { Lesson, Vocabulary } from '../types';
import { ALL_WORDS } from '../data/hsk_data';
import { cn } from '../lib/utils';
import WritingCanvas from './WritingCanvas';
import FlashcardGame from './FlashcardGame';
import { useLanguage } from '../contexts/LanguageContext';

interface LessonViewProps {
  lesson: Lesson;
  onBack: () => void;
  onFinishQuiz: (results: Record<string, 'easy' | 'hard' | 'difficult'>) => void;
}

type Section = 'vocabulary' | 'reading' | 'listening' | 'speaking' | 'grammar' | 'characters' | 'flashcards' | 'practice';

import AISpeakingPartner from './AISpeakingPartner';

export default function LessonView({ lesson, onBack, onFinishQuiz }: LessonViewProps) {
  const { showPinyin, t } = useLanguage();
  const [activeSection, setActiveSection] = useState<Section>('vocabulary');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  const SECTIONS: { id: Section; label: string; icon: any }[] = [
    { id: 'vocabulary', label: t.study.words, icon: BookOpen },
    { id: 'reading', label: t.dashboard.skills.reading, icon: MessageSquare },
    { id: 'listening', label: t.dashboard.skills.listening, icon: Headphones },
    { id: 'speaking', label: t.dashboard.skills.speaking, icon: Mic },
    { id: 'grammar', label: t.study.grammar, icon: Type },
    { id: 'characters', label: t.dashboard.skills.writing, icon: PenTool },
    { id: 'flashcards', label: t.games.inkSprint, icon: Layers },
    { id: 'practice', label: t.mock.title, icon: CheckCircle2 },
  ];

  const playAudio = (url?: string, index?: number) => {
    if (!url) {
      setAudioError(t.common.comingSoon);
      setTimeout(() => setAudioError(null), 3000);
      return;
    }
    setPlayingIndex(index ?? null);
    const audio = new Audio(url);
    audio.play().catch(() => {
      setAudioError(t.common.error);
      setPlayingIndex(null);
    });
    audio.onended = () => setPlayingIndex(null);
  };

  const lessonWords = useMemo(() => 
    ALL_WORDS.filter(w => lesson.wordIds.includes(w.id)),
    [lesson.wordIds]
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'vocabulary':
        return (
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-silk rounded-2xl flex items-center justify-center text-ink/40 shadow-inner">
                <BookOpen size={24} />
              </div>
              <h3 className="text-3xl font-serif font-bold">{t.study.words}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {lessonWords.map(word => (
                <div key={word.id} className="bg-silk/30 p-8 rounded-[2rem] border border-ink/5 shadow-sm flex items-center justify-between group hover:border-cinnabar/20 transition-all">
                  <div className="space-y-1">
                    <div className="text-4xl font-serif mb-2 text-ink group-hover:text-cinnabar transition-colors">{word.character}</div>
                    {showPinyin && <div className="text-cinnabar font-bold tracking-widest uppercase text-sm">{word.pinyin}</div>}
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-xl font-serif text-ink/80">{word.meaning}</div>
                    <div className="text-xs font-bold text-ink/20 uppercase tracking-widest">HSK {word.level}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'reading':
        return (
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-silk rounded-2xl flex items-center justify-center text-ink/40 shadow-inner">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-3xl font-serif font-bold">Reading Dialogues</h3>
            </div>
            {lesson.dialogues?.map((dialogue, i) => (
              <div key={i} className="bg-parchment/30 p-10 rounded-[3rem] border border-ink/5 shadow-sm space-y-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-cinnabar/20" />
                <div className="text-3xl leading-relaxed whitespace-pre-line font-serif text-ink">{dialogue.chinese}</div>
                {showPinyin && <div className="text-cinnabar font-bold whitespace-pre-line text-lg tracking-wide">{dialogue.pinyin}</div>}
                <div className="text-ink/60 italic whitespace-pre-line border-t border-ink/10 pt-8 text-xl font-serif">"{dialogue.english}"</div>
              </div>
            )) || <div className="text-center py-20 text-ink/40">{t.common.comingSoon}</div>}
          </div>
        );
      case 'listening':
        return (
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-silk rounded-2xl flex items-center justify-center text-ink/40 shadow-inner">
                  <Headphones size={24} />
                </div>
                <h3 className="text-3xl font-serif font-bold">Listening Practice</h3>
              </div>
              <AnimatePresence>
                {audioError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-cinnabar text-sm font-bold bg-cinnabar/10 px-6 py-3 rounded-2xl border border-cinnabar/20"
                  >
                    {audioError}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {lesson.dialogues?.map((dialogue, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-ink/10 shadow-sm flex items-center justify-between group hover:border-cinnabar hover:shadow-xl transition-all">
                  <div className="space-y-2">
                    <div className="text-2xl font-serif text-ink group-hover:text-cinnabar transition-colors">{dialogue.chinese.split('\n')[0]}...</div>
                    <div className="text-ink/40 font-medium">{dialogue.english.split('\n')[0]}...</div>
                  </div>
                  <button 
                    onClick={() => playAudio(dialogue.audioUrl, i)}
                    className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-lg",
                      playingIndex === i 
                        ? "bg-cinnabar text-white scale-110" 
                        : "bg-silk text-ink/40 group-hover:bg-cinnabar group-hover:text-white"
                    )}
                  >
                    <Play size={28} fill="currentColor" />
                  </button>
                </div>
              )) || (
                <div className="text-center py-20 text-ink/40">
                  <Headphones size={64} className="mx-auto mb-6 opacity-10" />
                  <p className="text-xl font-serif">No audio dialogues available for this lesson yet.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'speaking':
        return (
          <div className="h-[600px]">
            <AISpeakingPartner />
          </div>
        );
      case 'grammar':
        return (
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-silk rounded-2xl flex items-center justify-center text-ink/40 shadow-inner">
                <Type size={24} />
              </div>
              <h3 className="text-3xl font-serif font-bold">{t.study.grammar}</h3>
            </div>
            {lesson.grammarPoints?.map((point, i) => (
              <div key={i} className="bg-white p-10 rounded-[3rem] border border-ink/10 shadow-sm space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-full -z-10" />
                <h4 className="text-2xl font-bold text-cinnabar font-serif">{point.title}</h4>
                <p className="text-ink/80 leading-relaxed text-lg">{point.explanation}</p>
                <div className="space-y-4 mt-8">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-ink/20">Usage Examples</div>
                  {point.examples.map((ex, j) => (
                    <div key={j} className="bg-silk/30 p-6 rounded-2xl border border-ink/5 group hover:border-gold/30 transition-all">
                      <div className="text-2xl font-serif text-ink mb-1">{ex.sentence}</div>
                      {showPinyin && <div className="text-gold font-bold text-sm tracking-wide mb-2">{ex.pinyin}</div>}
                      <div className="text-ink/50 italic font-serif">"{ex.translation}"</div>
                    </div>
                  ))}
                </div>
              </div>
            )) || <div className="text-center py-20 text-ink/40">{t.common.comingSoon}</div>}
          </div>
        );
      case 'characters':
        const currentChar = lessonWords[currentCharIndex];
        return (
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-silk rounded-2xl flex items-center justify-center text-ink/40 shadow-inner">
                  <PenTool size={24} />
                </div>
                <h3 className="text-3xl font-serif font-bold">Character Writing</h3>
              </div>
              <div className="flex items-center gap-4 bg-silk p-2 rounded-2xl border border-ink/5">
                <button 
                  onClick={() => setCurrentCharIndex(Math.max(0, currentCharIndex - 1))}
                  disabled={currentCharIndex === 0}
                  className="w-10 h-10 rounded-xl bg-white border border-ink/10 flex items-center justify-center text-ink/40 hover:text-cinnabar disabled:opacity-20 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="font-mono font-bold text-ink/60 px-2">{currentCharIndex + 1} / {lessonWords.length}</span>
                <button 
                  onClick={() => setCurrentCharIndex(Math.min(lessonWords.length - 1, currentCharIndex + 1))}
                  disabled={currentCharIndex === lessonWords.length - 1}
                  className="w-10 h-10 rounded-xl bg-white border border-ink/10 flex items-center justify-center text-ink/40 hover:text-cinnabar disabled:opacity-20 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            <div className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-ink/5 border border-ink/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cinnabar via-gold to-jade opacity-20" />
              <WritingCanvas character={currentChar.character} className="w-full max-w-md mx-auto" />
              <div className="mt-12 text-center space-y-2">
                {showPinyin && <div className="text-3xl font-bold text-cinnabar tracking-widest">{currentChar.pinyin}</div>}
                <div className="text-2xl font-serif text-ink/60 italic">"{currentChar.meaning}"</div>
              </div>
            </div>
          </div>
        );
      case 'flashcards':
        return (
          <div className="h-[600px] relative rounded-[3rem] overflow-hidden border border-ink/10 shadow-2xl">
            <FlashcardGame 
              words={lessonWords} 
              onFinish={onFinishQuiz}
              onCancel={() => setActiveSection('vocabulary')}
            />
          </div>
        );
      case 'practice':
        return (
          <div className="space-y-12 text-center py-12">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-gold/10 rounded-[2.5rem] flex items-center justify-center text-gold mx-auto mb-8 shadow-inner rotate-12 group-hover:rotate-0 transition-transform">
                <CheckCircle2 size={64} />
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-cinnabar text-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Star size={24} fill="currentColor" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl font-serif font-bold text-ink">Final Mastery Quiz</h3>
              <p className="text-ink/40 max-w-md mx-auto font-medium text-lg">Demonstrate your knowledge to unlock the next chapter of your journey.</p>
            </div>
            <div className="bg-silk/30 p-12 rounded-[3.5rem] border border-ink/10 shadow-sm max-w-3xl mx-auto text-left space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <GraduationCap size={200} />
              </div>
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-cinnabar text-white flex items-center justify-center font-bold text-sm">1</span>
                  <p className="text-xl font-bold text-ink">Translate the following phrase:</p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-ink/5 shadow-inner">
                  <p className="text-4xl font-serif text-center text-ink">"九月去北京旅游最好"</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    'September is the best time to visit Beijing',
                    'I want to go to Beijing in October',
                    'Beijing is very cold in September',
                    'I like traveling to Beijing'
                  ].map((opt, i) => (
                    <button key={opt} className="p-6 rounded-2xl border-2 border-ink/5 bg-white hover:border-cinnabar hover:bg-cinnabar/5 transition-all text-left font-bold text-ink/60 hover:text-cinnabar group flex items-center gap-4">
                      <span className="w-8 h-8 rounded-lg bg-silk flex items-center justify-center text-xs group-hover:bg-cinnabar group-hover:text-white transition-colors">{String.fromCharCode(65 + i)}</span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => onFinishQuiz({})}
                className="w-full py-6 bg-cinnabar text-white rounded-[2rem] font-bold text-xl shadow-2xl shadow-cinnabar/30 hover:bg-cinnabar/90 hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10"
              >
                Complete Mastery Challenge
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* Sidebar Navigation */}
      <aside className="lg:w-72 space-y-3">
        <button 
          onClick={onBack}
          className="w-full flex items-center gap-3 p-5 text-ink/40 hover:text-cinnabar font-bold transition-all mb-6 bg-white/50 rounded-3xl border border-ink/5 hover:border-cinnabar/20 group"
        >
          <div className="w-8 h-8 rounded-full bg-silk flex items-center justify-center group-hover:bg-cinnabar/10 transition-colors">
            <ChevronLeft size={18} />
          </div>
          {t.common.back}
        </button>
        <div className="bg-white rounded-[2.5rem] p-3 border border-ink/10 shadow-xl shadow-ink/5 space-y-1">
          {SECTIONS.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "w-full flex items-center gap-4 p-5 rounded-2xl font-bold transition-all relative overflow-hidden group",
                activeSection === section.id 
                  ? "bg-cinnabar text-white shadow-lg shadow-cinnabar/20" 
                  : "text-ink/60 hover:bg-silk hover:text-ink"
              )}
            >
              <section.icon size={20} className={cn(activeSection === section.id ? "text-white" : "text-ink/20 group-hover:text-cinnabar")} />
              <span className="relative z-10">{section.label}</span>
              {activeSection === section.id && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute inset-0 bg-cinnabar -z-10"
                />
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-[700px]">
        <div className="bg-white rounded-[3rem] p-12 border border-ink/10 shadow-2xl shadow-ink/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
            <BookOpen size={300} />
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative z-10"
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
