import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Lesson } from '../types';
import { LESSONS } from '../data/hsk_data';
import { useLanguage } from '../contexts/LanguageContext';
import { Lock, Check, Play, Compass } from 'lucide-react';

interface DashboardMapProps {
  level: number;
  onSelectLesson: (lesson: Lesson) => void;
  completedLessonIds: number[];
}

export default function DashboardMap({ level, onSelectLesson, completedLessonIds }: DashboardMapProps) {
  const { t } = useLanguage();
  const levelLessons = LESSONS.filter(l => l.level === level);

  const lessonsWithUnits = useMemo(() => {
    const result: (Lesson | { type: 'unit', number: number })[] = [];
    let currentUnit = -1;
    
    levelLessons.forEach(lesson => {
      if (lesson.unit && lesson.unit !== currentUnit) {
        currentUnit = lesson.unit;
        result.push({ type: 'unit', number: currentUnit });
      }
      result.push(lesson);
    });
    return result;
  }, [levelLessons]);

  return (
    <div className="relative py-12 px-4 overflow-x-auto">
      <div className="flex flex-col items-center gap-12 min-w-[800px]">
        
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px bg-ink/10 w-24" />
          <h3 className="text-3xl font-serif text-ink/40 uppercase tracking-widest">
            HSK {level} {t.dashboard.level}
          </h3>
          <div className="h-px bg-ink/10 w-24" />
        </div>

        <div className="relative w-full max-w-4xl">
          {/* Path Line */}
          <svg className="absolute top-0 left-0 w-full h-full -z-10 opacity-10" viewBox="0 0 800 1200">
            <path 
              d="M 400 50 Q 100 250 400 450 T 400 850 T 400 1250" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="8" 
              strokeDasharray="16 16"
              className="text-ink"
            />
          </svg>

          <div className="flex flex-col gap-24">
            {lessonsWithUnits.map((item, index) => {
              if ('type' in item && item.type === 'unit') {
                return (
                  <div key={`unit-${item.number}`} className="flex items-center justify-center gap-4 py-8">
                    <div className="h-px bg-gold/20 flex-1" />
                    <div className="flex items-center gap-2 bg-gold/10 px-6 py-2 rounded-full border border-gold/20">
                      <Compass className="text-gold" size={16} />
                      <span className="text-gold font-bold uppercase tracking-[0.2em] text-sm">
                        Unit {item.number}
                      </span>
                    </div>
                    <div className="h-px bg-gold/20 flex-1" />
                  </div>
                );
              }

              const lesson = item as Lesson;
              const lessonIndex = levelLessons.indexOf(lesson);
              const isCompleted = completedLessonIds.includes(lesson.id);
              const isLocked = lessonIndex > 0 && !completedLessonIds.includes(levelLessons[lessonIndex - 1].id);
              const isCurrent = !isCompleted && !isLocked;

              return (
                <div 
                  key={lesson.id} 
                  className="flex items-center justify-center relative"
                  style={{ marginLeft: lessonIndex % 2 === 0 ? '-20%' : '20%' }}
                >
                  <motion.button
                    whileHover={!isLocked ? { scale: 1.1 } : {}}
                    whileTap={!isLocked ? { scale: 0.95 } : {}}
                    onClick={() => !isLocked && onSelectLesson(lesson)}
                    className={cn(
                      "w-24 h-24 rounded-[2rem] flex items-center justify-center border-4 transition-all relative shadow-xl",
                      isCompleted ? "bg-jade border-jade text-white" :
                      isCurrent ? "bg-white border-cinnabar text-cinnabar animate-pulse" :
                      "bg-parchment border-ink/10 text-ink/20 cursor-not-allowed"
                    )}
                  >
                    {isCompleted ? <Check size={32} strokeWidth={3} /> :
                     isLocked ? <Lock size={32} /> :
                     <span className="text-3xl font-serif font-bold">{lesson.id <= 15 ? lesson.id : (lesson.id - 15)}</span>}
                    
                    {/* Label */}
                    <div className={cn(
                      "absolute top-1/2 -translate-y-1/2 whitespace-nowrap px-6 py-3 rounded-2xl border shadow-sm transition-all",
                      lessonIndex % 2 === 0 ? "left-full ml-6" : "right-full mr-6",
                      isLocked ? "bg-parchment/50 text-ink/20 border-ink/5" : "bg-white text-ink border-ink/5"
                    )}>
                      <div className="text-xs font-bold uppercase tracking-widest opacity-40">Lesson {lesson.id <= 15 ? lesson.id : (lesson.id - 15)}</div>
                      <div className="text-lg font-serif font-bold">
                        {lesson.name.includes('(') ? (
                          <>
                            <span className="font-chinese mr-2">{lesson.name.split('(')[0].trim()}</span>
                            <span className="text-sm text-ink/40 font-sans font-medium">({lesson.name.split('(')[1]}</span>
                          </>
                        ) : lesson.name}
                      </div>
                    </div>

                    {isCurrent && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-cinnabar text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                        Current
                      </div>
                    )}
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
