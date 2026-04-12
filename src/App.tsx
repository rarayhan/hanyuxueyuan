import React, { useState, useEffect, useMemo } from 'react';
import { UserProgress, Vocabulary, SRSData, WordStatus, Lesson } from './types';
import { ALL_WORDS, LESSONS } from './data/hsk_data';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Settings, 
  Trophy, 
  Flame, 
  Target, 
  ChevronRight, 
  Play, 
  Filter, 
  Layers, 
  LayoutDashboard, 
  GraduationCap, 
  ClipboardCheck, 
  Gamepad2, 
  UserCircle,
  Award,
  Zap,
  Home,
  BarChart2,
  Mic,
  Headphones,
  PenTool
} from 'lucide-react';
import { cn } from './lib/utils';
import Dashboard from './components/Dashboard';
import StudyView from './components/StudyView';
import LessonView from './components/LessonView';
import MockTest from './components/MockTest';
import WordGames from './components/WordGames';
import Leaderboard from './components/Leaderboard';
import Achievements from './components/Achievements';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

import TonePop from './components/TonePop';
import RadicalReactor from './components/RadicalReactor';
import SentenceSushi from './components/SentenceSushi';
import AISpeakingPartner from './components/AISpeakingPartner';
import StoryGenerator from './components/StoryGenerator';
import CharacterBreakdown from './components/CharacterBreakdown';
import VocabularyPractice from './components/VocabularyPractice';

const INITIAL_PROGRESS: UserProgress = {
  xp: 0,
  streak: 0,
  lastActive: Date.now(),
  achievements: ['first_steps'],
  srs: {},
  dailyGoal: 20,
  wordsLearnedToday: 0,
  level: 1,
  baozi: 100,
  completedLessons: [],
  skills: {
    listening: 0,
    speaking: 0,
    reading: 0,
    writing: 0,
  },
};

type MainTab = 'dashboard' | 'study' | 'mock-test' | 'games' | 'profile' | 'leaderboard' | 'achievements' | 'speaking-partner' | 'story' | 'character' | 'vocabulary';

function AppContent() {
  const { language, setLanguage, showPinyin, setShowPinyin, t } = useLanguage();
  const [activeGame, setActiveGame] = useState<'none' | 'tone-pop' | 'radical-reactor' | 'sentence-sushi' | 'ink-sprint'>('none');
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('scholar_path_progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old progress if needed
      return { ...INITIAL_PROGRESS, ...parsed };
    }
    return INITIAL_PROGRESS;
  });

  const [activeTab, setActiveTab] = useState<MainTab>('dashboard');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    localStorage.setItem('scholar_path_progress', JSON.stringify(progress));
  }, [progress]);

  const addXP = (amount: number) => {
    setProgress(prev => {
      const newXP = prev.xp + amount;
      
      // Progressive leveling: 
      // Lvl 1: 0, Lvl 2: 200, Lvl 3: 500, Lvl 4: 1000, Lvl 5+: +1000 each
      let newLevel = 1;
      if (newXP >= 1000) {
        newLevel = Math.floor((newXP - 1000) / 1000) + 4;
      } else if (newXP >= 500) {
        newLevel = 3;
      } else if (newXP >= 200) {
        newLevel = 2;
      }
      
      const newAchievements = [...prev.achievements];
      if (newLevel >= 5 && !newAchievements.includes('scholar_level_5')) {
        newAchievements.push('scholar_level_5');
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        achievements: newAchievements
      };
    });
  };

  const handleSessionFinish = (results: Record<string, 'easy' | 'hard' | 'difficult'>) => {
    const newSrs = { ...progress.srs };
    let xpGained = 0;

    if (results && Object.keys(results).length > 0) {
      Object.entries(results).forEach(([vocabId, difficulty]) => {
        const current = newSrs[vocabId] || {
          vocabId,
          nextReview: Date.now(),
          interval: 0,
          easeFactor: 2.5,
          repetition: 0,
          status: 'cold' as WordStatus,
          accuracy: 0,
        };

        let nextInterval = 1;
        if (difficulty === 'easy') {
          nextInterval = current.interval === 0 ? 1 : current.interval * 2;
          xpGained += 20;
        } else if (difficulty === 'hard') {
          nextInterval = Math.max(1, current.interval);
          xpGained += 10;
        } else {
          nextInterval = 0;
          xpGained += 5;
        }

        newSrs[vocabId] = {
          ...current,
          interval: nextInterval,
          nextReview: Date.now() + nextInterval * 24 * 60 * 60 * 1000,
          status: difficulty === 'easy' ? 'hot' : 'warm',
          difficulty,
        };
      });
    }

    const completionBonus = 50;
    addXP(xpGained + completionBonus);
    setProgress(prev => ({
      ...prev,
      wordsLearnedToday: prev.wordsLearnedToday + (results ? Object.keys(results).length : 0),
      srs: newSrs,
      completedLessons: selectedLesson ? [...new Set([...prev.completedLessons, selectedLesson.id])] : prev.completedLessons
    }));

    setSelectedLesson(null);
  };

  const renderContent = () => {
    if (selectedLesson) {
      return <LessonView lesson={selectedLesson} onBack={() => setSelectedLesson(null)} onFinishQuiz={handleSessionFinish} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            progress={progress} 
            onStartLearning={() => setActiveTab('study')}
            onViewStatus={() => setActiveTab('profile')}
            onSelectLevel={(level) => {
              setActiveTab('study');
            }}
            onSelectLesson={setSelectedLesson}
            onViewLeaderboard={() => setActiveTab('leaderboard')}
            onViewAchievements={() => setActiveTab('achievements')}
          />
        );
      case 'study':
        return <StudyView onSelectLesson={setSelectedLesson} />;
      case 'mock-test':
        return <MockTest />;
      case 'games':
        if (activeGame === 'tone-pop') return <TonePop onFinish={(xp) => { addXP(xp); setActiveGame('none'); }} onCancel={() => setActiveGame('none')} />;
        if (activeGame === 'radical-reactor') return <RadicalReactor onFinish={(xp) => { addXP(xp); setActiveGame('none'); }} onCancel={() => setActiveGame('none')} />;
        if (activeGame === 'sentence-sushi') return <SentenceSushi onFinish={(xp) => { addXP(xp); setActiveGame('none'); }} onCancel={() => setActiveGame('none')} />;
        if (activeGame === 'ink-sprint') return (
          <WordGames 
            words={ALL_WORDS.slice(0, 100)} 
            onFinish={(xp) => { addXP(xp); setActiveGame('none'); }} 
            onCancel={() => setActiveGame('none')} 
          />
        );

        return (
          <div className="space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-serif">{t.games.title}</h2>
              <p className="text-ink/60">{t.games.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GameCard 
                title={t.games.tonePop} 
                desc="Master the four tones of Mandarin." 
                icon="🎈" 
                color="bg-cinnabar"
                onClick={() => setActiveGame('tone-pop')}
              />
              <GameCard 
                title={t.games.radicalReactor} 
                desc="Combine radicals to form characters." 
                icon="⚛️" 
                color="bg-jade"
                onClick={() => setActiveGame('radical-reactor')}
              />
              <GameCard 
                title={t.games.sentenceSushi} 
                desc="Build sentences with correct grammar." 
                icon="🍣" 
                color="bg-gold"
                onClick={() => setActiveGame('sentence-sushi')}
              />
              <GameCard 
                title={t.games.inkSprint} 
                desc="Fast-paced vocabulary matching." 
                icon="🖋️" 
                color="bg-ink"
                onClick={() => setActiveGame('ink-sprint')}
              />
            </div>
          </div>
        );
      case 'speaking-partner':
        return <AISpeakingPartner />;
      case 'story':
        return <StoryGenerator />;
      case 'character':
        return <CharacterBreakdown />;
      case 'vocabulary':
        return <VocabularyPractice />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'achievements':
        return <Achievements unlockedIds={progress.achievements} />;
      case 'profile':
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-[3rem] p-12 border border-ink/5 shadow-xl flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <UserCircle size={300} />
              </div>
              <div className="relative">
                <div className="w-40 h-40 bg-parchment rounded-[2.5rem] flex items-center justify-center text-ink/20 border-4 border-silk shadow-inner">
                  <UserCircle size={100} />
                </div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gold text-ink rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg border-4 border-white">
                  {progress.level}
                </div>
              </div>
              <div className="text-center md:text-left space-y-4 flex-1">
                <div>
                  <h2 className="text-5xl font-serif">{t.profile.title}</h2>
                  <p className="text-xl text-ink/60 font-medium">{t.dashboard.level} {progress.level} {t.profile.master}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-ink/40">
                    <span>{t.profile.xpProgress}</span>
                    <span>{progress.xp % 1000} / 1000 XP</span>
                  </div>
                  <div className="h-4 bg-parchment rounded-full overflow-hidden border border-ink/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(progress.xp % 1000) / 10}%` }}
                      className="h-full bg-cinnabar shadow-[0_0_20px_rgba(196,30,58,0.3)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard icon={<Flame className="text-gold" />} label={t.profile.currentStreak} value={`${progress.streak} ${t.dashboard.days}`} />
              <StatCard icon={<Trophy className="text-cinnabar" />} label={t.profile.totalXp} value={progress.xp.toLocaleString()} />
              <StatCard icon={<Target className="text-jade" />} label={t.profile.wordsLearned} value={Object.keys(progress.srs).length} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-ink/5 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-serif">{t.profile.recentAchievements}</h3>
                  <button onClick={() => setActiveTab('achievements')} className="text-cinnabar font-bold text-sm hover:underline">{t.dashboard.viewAll}</button>
                </div>
                <div className="flex gap-4">
                  {progress.achievements.slice(0, 4).map(id => (
                    <div key={id} className="w-16 h-16 bg-silk rounded-2xl flex items-center justify-center text-gold shadow-sm border border-ink/5">
                      <Award size={32} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-ink/5 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-serif">{t.profile.dailyProgress}</h3>
                  <span className="text-jade font-bold text-sm">{progress.wordsLearnedToday} / {progress.dailyGoal} {t.study.words}</span>
                </div>
                <div className="h-3 bg-parchment rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-jade" 
                    style={{ width: `${Math.min(100, (progress.wordsLearnedToday / progress.dailyGoal) * 100)}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-parchment text-ink font-sans selection:bg-cinnabar/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-ink/10 shadow-sm px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setActiveTab('dashboard'); setSelectedLesson(null); }}>
          <div className="w-8 h-8 bg-cinnabar rounded-lg flex items-center justify-center text-white shadow-lg shadow-cinnabar/20 group-hover:rotate-12 transition-transform">
            <GraduationCap size={20} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="logo-zh text-xl font-chinese font-bold text-cinnabar">汉语学院</span>
            <span className="logo-en text-sm font-serif italic text-ink-soft">Hànyǔ Xuéyuàn</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 bg-gold/10 px-3 py-1.5 rounded-xl border border-gold/20">
            <span className="text-lg">🥟</span>
            <span className="font-bold text-sm text-gold">{progress.baozi}</span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowPinyin(!showPinyin)}
              className={cn(
                "px-3 py-1.5 rounded-xl border transition-all text-[10px] font-bold tracking-wider",
                showPinyin 
                  ? "bg-jade/10 border-jade/20 text-jade" 
                  : "bg-ink/5 border-ink/10 text-ink/40"
              )}
              title={showPinyin ? "Hide Pinyin" : "Show Pinyin"}
            >
              PINYIN {showPinyin ? "ON" : "OFF"}
            </button>

            <button 
              onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
              className="px-3 py-1.5 bg-silk rounded-xl border border-ink/5 text-xs font-bold hover:bg-ink hover:text-white transition-all"
            >
              {language === 'en' ? '中文' : 'EN'}
            </button>
          </div>
          
          <button className="p-2 hover:bg-silk rounded-xl transition-colors text-ink/40 hover:text-ink">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-ink/10 px-6 flex gap-2 overflow-x-auto no-scrollbar sticky top-16 z-40">
        <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon="🏠" label={t.nav.home} />
        <TabButton active={activeTab === 'study'} onClick={() => setActiveTab('study')} icon="📚" label={t.nav.study} />
        <TabButton active={activeTab === 'vocabulary'} onClick={() => setActiveTab('vocabulary')} icon="📖" label={t.nav.vocabulary} />
        <TabButton active={activeTab === 'speaking-partner'} onClick={() => setActiveTab('speaking-partner')} icon="💬" label={t.dashboard.skills.speaking} />
        <TabButton active={activeTab === 'story'} onClick={() => setActiveTab('story')} icon="📖" label="Story" />
        <TabButton active={activeTab === 'character'} onClick={() => setActiveTab('character')} icon="🖊️" label="Character" />
        <TabButton active={activeTab === 'games'} onClick={() => setActiveTab('games')} icon="🎮" label={t.nav.games} />
        <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon="👤" label={t.nav.profile} />
      </nav>

      <main className="max-w-5xl mx-auto py-12 px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (selectedLesson?.id || '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function GameCard({ title, desc, icon, color, onClick }: { title: string, desc: string, icon: string, color: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="bg-white p-8 rounded-[3rem] border border-ink/5 shadow-sm hover:shadow-2xl transition-all text-left flex items-center gap-8 group"
    >
      <div className={cn("w-24 h-24 rounded-[2rem] flex items-center justify-center text-5xl shadow-lg group-hover:rotate-12 transition-transform", color)}>
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-serif font-bold">{title}</h3>
        <p className="text-ink/40 font-medium">{desc}</p>
      </div>
    </button>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: string, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-6 py-4 text-sm font-bold whitespace-nowrap border-b-4 transition-all flex items-center gap-2",
        active ? "border-cinnabar text-cinnabar" : "border-transparent text-ink/40 hover:text-cinnabar"
      )}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );
}

function StatCard({ icon, label, value }: { icon: any, label: string, value: string | number }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-ink/5 shadow-sm space-y-2 group hover:border-cinnabar transition-all">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-silk rounded-xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-ink/40">{label}</span>
      </div>
      <div className="text-4xl font-serif font-bold">{value}</div>
    </div>
  );
}
