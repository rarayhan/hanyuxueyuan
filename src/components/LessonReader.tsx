import React, { useState } from 'react';
import { SinologyLesson, AnnotatedWord } from '../data/sinology_data';
import { ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LessonReaderProps {
  lesson: SinologyLesson;
  onBack: () => void;
}

export default function LessonReader({ lesson, onBack }: LessonReaderProps) {
  const [selectedWord, setSelectedWord] = useState<AnnotatedWord | null>(null);

  return (
    <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-ink/10 shadow-2xl relative overflow-hidden">
      {lesson.imageUrl && (
        <div 
          className="absolute inset-0 z-0 opacity-[0.05] bg-cover bg-center"
          style={{ backgroundImage: `url(${lesson.imageUrl})` }}
        />
      )}
      <div className="relative z-10">
        <button 
          onClick={onBack} 
          className="mb-8 flex items-center gap-2 text-ink/60 hover:text-cinnabar transition-colors font-bold"
        >
          <ArrowLeft size={20} /> Back to Modules
        </button>
        
        <h2 className="text-4xl font-serif font-bold mb-4 text-ink">{lesson.title}</h2>
        <p className="text-xl text-ink/60 mb-12">{lesson.description}</p>

        <div className="space-y-12">
        {lesson.content.map((paragraph, pIdx) => (
          <div key={pIdx} className="space-y-6">
            <div className="flex flex-wrap gap-x-2 gap-y-6">
              {paragraph.words.map((word, wIdx) => {
                const isPunctuation = /^[。，！？、；：“”‘’（）《》〈〉.!?,-]+$/.test(word.chinese);
                
                if (isPunctuation) {
                  return (
                    <div key={wIdx} className="flex flex-col justify-end pb-1">
                      <span className="text-3xl font-chinese text-ink">{word.chinese}</span>
                    </div>
                  );
                }

                return (
                  <button
                    key={wIdx}
                    onClick={() => setSelectedWord(word)}
                    className="flex flex-col items-center group hover:bg-gold/10 rounded-lg p-1 transition-colors cursor-pointer"
                  >
                    <span className="text-sm text-ink/40 group-hover:text-cinnabar transition-colors mb-1">
                      {word.pinyin}
                    </span>
                    <span className="text-3xl font-chinese text-ink group-hover:text-cinnabar transition-colors">
                      {word.chinese}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-lg text-ink/80 italic border-l-4 border-gold/30 pl-4 py-1 bg-parchment/30 rounded-r-xl">
              {paragraph.englishTranslation}
            </p>
          </div>
        ))}
      </div>

      {/* Word Modal/Tooltip */}
      <AnimatePresence>
        {selectedWord && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm" 
            onClick={() => setSelectedWord(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full border border-ink/10" 
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-5xl font-chinese font-bold text-cinnabar mb-2">{selectedWord.chinese}</h3>
                  <p className="text-xl font-medium text-ink/60">{selectedWord.pinyin}</p>
                </div>
                <button 
                  onClick={() => setSelectedWord(null)} 
                  className="text-ink/40 hover:text-ink bg-silk p-2 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4 pt-4 border-t border-ink/10">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-ink/40 block mb-1">English Meaning</span>
                  <p className="text-xl text-ink">{selectedWord.english}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
