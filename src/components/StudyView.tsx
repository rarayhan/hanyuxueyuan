import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { BookOpen, ChevronRight, Layers, Star, Clock, FileText, Compass } from 'lucide-react';
import { Lesson, Vocabulary } from '../types';
import { LESSONS, ALL_WORDS } from '../data/hsk_data';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

interface StudyViewProps {
  onSelectLesson: (lesson: Lesson) => void;
}

export default function StudyView({ onSelectLesson }: StudyViewProps) {
  const { t } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  const levelLessons = LESSONS.filter(l => l.level === selectedLevel);

  const lessonsByUnit = useMemo(() => {
    const units: Record<number, Lesson[]> = {};
    levelLessons.forEach(lesson => {
      const unit = lesson.unit || 0;
      if (!units[unit]) units[unit] = [];
      units[unit].push(lesson);
    });
    return units;
  }, [levelLessons]);

  const levels = [
    { id: 1, name: 'HSK-1', label: t.study.beginner, color: 'bg-jade' },
    { id: 2, name: 'HSK-2', label: t.study.elementary, color: 'bg-gold' },
    { id: 3, name: 'HSK-3', label: t.study.intermediate, color: 'bg-cinnabar' },
    { id: 4, name: 'HSK-4', label: t.study.upperIntermediate, color: 'bg-ink' },
  ];

  return (
    <div className="space-y-12">
      {/* Level Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {levels.map(level => (
          <button
            key={level.id}
            onClick={() => setSelectedLevel(level.id)}
            className={cn(
              "p-8 rounded-[2.5rem] border-2 transition-all text-left space-y-4 relative overflow-hidden group",
              selectedLevel === level.id 
                ? `border-cinnabar bg-white shadow-2xl shadow-cinnabar/5` 
                : "border-ink/5 bg-white/50 hover:border-ink/10"
            )}
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-2 shadow-lg group-hover:rotate-12 transition-transform", level.color)}>
              <Layers size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold">{level.name}</h3>
              <p className="text-xs text-ink/40 font-bold uppercase tracking-[0.2em] mt-1">{level.label}</p>
            </div>
            {selectedLevel === level.id && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-cinnabar/5 rounded-bl-[3rem] -z-10" />
            )}
          </button>
        ))}
      </div>

      {/* Lessons List */}
      <div className="space-y-12">
        <div className="flex items-center gap-4 px-2">
          <div className="w-10 h-10 bg-silk rounded-xl flex items-center justify-center text-ink/40">
            <BookOpen size={20} />
          </div>
          <h3 className="text-3xl font-serif font-bold">{t.study.lessons}</h3>
        </div>

        {(Object.entries(lessonsByUnit) as [string, Lesson[]][]).map(([unit, lessons]) => (
          <div key={unit} className="space-y-6">
            {unit !== '0' && (
              <div className="flex items-center gap-3 px-4">
                <Compass className="text-gold" size={20} />
                <h4 className="text-xl font-serif font-bold text-ink/60">
                  Unit {unit}
                </h4>
                <div className="h-px bg-ink/5 flex-1" />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lessons.map((lesson, index) => (
                <motion.button
                  key={lesson.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelectLesson(lesson)}
                  className="bg-white p-8 rounded-[2.5rem] border border-ink/10 shadow-sm hover:border-cinnabar hover:shadow-xl transition-all text-left flex items-center justify-between group"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-silk rounded-2xl flex items-center justify-center text-ink/40 font-serif text-2xl font-bold group-hover:bg-cinnabar group-hover:text-white transition-all shadow-inner">
                      {lesson.id <= 15 ? lesson.id : (lesson.id - 15)}
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-xl text-ink group-hover:text-cinnabar transition-colors">{lesson.name}</h4>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-xs text-ink/40 font-bold uppercase tracking-widest">
                          <FileText size={14} className="text-jade" />
                          {lesson.wordIds.length} {t.study.words}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-ink/40 font-bold uppercase tracking-widest">
                          <Star size={14} className="text-gold" />
                          {lesson.grammarPoints?.length || 0} {t.study.grammar}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-silk flex items-center justify-center text-ink/20 group-hover:bg-cinnabar/10 group-hover:text-cinnabar transition-all">
                    <ChevronRight size={20} />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
