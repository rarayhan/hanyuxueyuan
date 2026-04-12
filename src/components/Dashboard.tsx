import React from 'react';
import { motion } from 'motion/react';
import { Play, BarChart2, Flame, BookOpen, Target, Gamepad2, Quote, Trophy, Award, ChevronRight, Zap, Medal, GraduationCap } from 'lucide-react';
import { UserProgress } from '../types';
import { CHINESE_QUOTES } from '../data/hsk_data';
import { cn } from '../lib/utils';
import { Check } from 'lucide-react';

interface DashboardProps {
  progress: UserProgress;
  onStartLearning: () => void;
  onViewStatus: () => void;
  onSelectLevel: (level: number) => void;
  onSelectLesson: (lesson: Lesson) => void;
  onViewLeaderboard: () => void;
  onViewAchievements: () => void;
}

import { useLanguage } from '../contexts/LanguageContext';

import DashboardMap from './DashboardMap';
import { Lesson } from '../types';

export default function Dashboard({ 
  progress, 
  onStartLearning, 
  onViewStatus, 
  onSelectLevel,
  onSelectLesson,
  onViewLeaderboard,
  onViewAchievements
}: DashboardProps) {
  const { showPinyin, t } = useLanguage();
  const [mapLevel, setMapLevel] = React.useState(1);
  const randomQuote = CHINESE_QUOTES[Math.floor(Math.random() * CHINESE_QUOTES.length)];

  return (
    <div className="space-y-12 pb-20">
      {/* Welcome Section */}
      <section className="bg-white rounded-[3rem] p-12 border border-ink/10 shadow-2xl shadow-ink/5 relative overflow-hidden">
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h2 className="text-6xl font-serif leading-tight text-ink">
              {t.dashboard.greeting}<br/>
              <span className="text-cinnabar italic font-normal">{t.dashboard.ready}</span>
            </h2>
            <div className="flex items-center gap-4 text-ink/40 font-bold uppercase tracking-widest text-sm">
              <span>{t.dashboard.level} {progress.level}</span>
              <span className="w-1.5 h-1.5 bg-gold rounded-full" />
              <span>{progress.xp} Total XP</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onStartLearning}
              className="btn-cinnabar px-10 py-5 text-lg shadow-cinnabar/30"
            >
              <Play size={20} fill="currentColor" />
              {t.dashboard.startLearning}
            </button>
            <button 
              onClick={onViewStatus}
              className="px-10 py-5 bg-silk text-ink rounded-2xl font-bold flex items-center gap-2 hover:bg-ink hover:text-white transition-all border border-ink/5"
            >
              <BarChart2 size={20} />
              {t.dashboard.viewStatus}
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <BookOpen size={400} />
        </div>
      </section>

      {/* Dashboard Map */}
      <section className="space-y-8">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-jade rounded-xl flex items-center justify-center text-white shadow-lg">
              <GraduationCap size={20} />
            </div>
            <h3 className="text-3xl font-serif font-bold">{t.nav.home} Map</h3>
          </div>
          <div className="flex bg-white p-1 rounded-2xl border border-ink/10 shadow-sm">
            {[1, 2, 3, 4].map(lvl => (
              <button
                key={lvl}
                onClick={() => setMapLevel(lvl)}
                className={cn(
                  "px-8 py-2.5 rounded-xl font-bold text-sm transition-all",
                  mapLevel === lvl ? "bg-cinnabar text-white shadow-lg" : "text-ink/40 hover:text-ink"
                )}
              >
                HSK {lvl}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-[4rem] border border-ink/10 shadow-2xl shadow-ink/5 overflow-hidden">
          <DashboardMap 
            level={mapLevel} 
            onSelectLesson={onSelectLesson} 
            completedLessonIds={progress.completedLessons}
          />
        </div>
      </section>

      {/* Motivation & Quote */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-ink text-parchment rounded-[3rem] p-12 space-y-8 relative overflow-hidden group border border-white/5">
          <div className="flex items-center gap-3 text-gold">
            <Quote size={24} fill="currentColor" />
            <span className="font-bold uppercase tracking-widest text-xs tracking-[0.2em]">{t.dashboard.dailyWisdom}</span>
          </div>
          <div className="space-y-6 relative z-10">
            <p className="text-5xl font-chinese leading-relaxed group-hover:translate-x-2 transition-transform duration-700">{randomQuote.text}</p>
            <div className="space-y-2">
              {showPinyin && <p className="text-gold font-mono font-bold text-lg tracking-wide">{randomQuote.pinyin}</p>}
              <p className="text-parchment/60 italic text-xl font-serif">"{randomQuote.translation}"</p>
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 opacity-5 rotate-12 pointer-events-none">
            <Quote size={400} fill="currentColor" />
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-12 border border-ink/10 shadow-xl flex flex-col justify-center items-center text-center space-y-6 group hover:border-gold transition-all relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gold opacity-20" />
          <div className="w-24 h-24 bg-gold/10 rounded-[2rem] flex items-center justify-center text-gold group-hover:rotate-12 transition-transform shadow-inner">
            <Flame size={56} />
          </div>
          <div>
            <h3 className="text-4xl font-serif font-bold">{progress.streak} {t.dashboard.days}</h3>
            <p className="text-ink/40 font-bold uppercase tracking-widest text-xs mt-2">{t.dashboard.streak}</p>
            <p className="text-ink/60 font-medium mt-4 leading-relaxed">Consistency is the path to mastery.</p>
          </div>
        </div>
      </section>

      {/* Gamification Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Leaderboard Preview */}
        <div className="card-scholar space-y-8 group cursor-pointer hover:shadow-2xl transition-all" onClick={onViewLeaderboard}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold shadow-sm">
                <Medal size={24} />
              </div>
              <h3 className="text-2xl font-serif font-bold">{t.dashboard.leaderboard}</h3>
            </div>
            <ChevronRight className="text-ink/20 group-hover:text-gold transition-colors" />
          </div>
          <div className="space-y-4">
            {[
              { name: 'Li Wei', xp: '12.5k', rank: 1 },
              { name: 'Sarah J.', xp: '10.2k', rank: 2 },
              { name: 'You', xp: `${(progress.xp/1000).toFixed(1)}k`, rank: 12, isUser: true }
            ].map((entry, i) => (
              <div key={i} className={cn(
                "flex items-center justify-between p-4 rounded-2xl transition-all",
                entry.isUser ? "bg-gold/10 border border-gold/20 shadow-sm" : "bg-silk/50 border border-transparent"
              )}>
                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold text-ink/30 w-6 text-lg">{entry.rank}</span>
                  <span className="font-bold text-lg">{entry.name}</span>
                </div>
                <span className="font-mono font-bold text-cinnabar text-lg">{entry.xp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Preview */}
        <div className="card-scholar space-y-8 group cursor-pointer hover:shadow-2xl transition-all" onClick={onViewAchievements}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-jade/10 rounded-2xl flex items-center justify-center text-jade shadow-sm">
                <Award size={24} />
              </div>
              <h3 className="text-2xl font-serif font-bold">{t.dashboard.achievements}</h3>
            </div>
            <ChevronRight className="text-ink/20 group-hover:text-jade transition-colors" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {progress.achievements.slice(0, 4).map((id, i) => (
              <div key={i} className="aspect-square bg-silk rounded-2xl flex items-center justify-center text-gold shadow-sm border border-ink/5 group-hover:scale-110 transition-transform">
                <Zap size={28} />
              </div>
            ))}
            {progress.achievements.length < 4 && Array(4 - progress.achievements.length).fill(0).map((_, i) => (
              <div key={i} className="aspect-square bg-parchment/50 rounded-2xl border border-dashed border-ink/10 flex items-center justify-center text-ink/10">
                <Award size={28} />
              </div>
            ))}
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm text-ink/40 font-bold uppercase tracking-widest">
              {progress.achievements.length} / 12 {t.dashboard.badgesUnlocked}
            </p>
            <div className="h-1.5 bg-silk rounded-full overflow-hidden max-w-[120px] mx-auto">
              <div className="h-full bg-jade" style={{ width: `${(progress.achievements.length / 12) * 100}%` }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ChallengeItem({ label, current, total, icon }: { label: string, current: number, total: number, icon: any }) {
  const isComplete = current >= total;
  const percentage = Math.min(100, (current / total) * 100);

  return (
    <div className="p-6 bg-silk/50 rounded-3xl border border-ink/5 space-y-4">
      <div className="flex items-center justify-between">
        <div className={cn(
          "p-2 rounded-xl",
          isComplete ? "bg-jade text-white" : "bg-white text-ink/40"
        )}>
          {icon}
        </div>
        <div className="text-sm font-mono font-bold text-ink/40">{current} / {total}</div>
      </div>
      <div className="space-y-2">
        <div className={cn("font-bold text-sm", isComplete ? "text-ink/40 line-through" : "text-ink")}>{label}</div>
        <div className="h-2 bg-white rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className={cn("h-full", isComplete ? "bg-jade" : "bg-gold")}
          />
        </div>
      </div>
    </div>
  );
}
