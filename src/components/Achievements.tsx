import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Flame, BookOpen, Target, Zap, Award, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

const ACHIEVEMENT_ICONS: Record<string, any> = {
  first_steps: BookOpen,
  streak_3: Flame,
  hsk1_master: Award,
  speed_demon: Zap,
  perfect_score: Star,
  scholar_level_5: ShieldCheck,
};

const ACHIEVEMENT_COLORS: Record<string, string> = {
  first_steps: 'jade',
  streak_3: 'gold',
  hsk1_master: 'cinnabar',
  speed_demon: 'gold',
  perfect_score: 'jade',
  scholar_level_5: 'cinnabar',
};

interface AchievementsProps {
  unlockedIds: string[];
}

export default function Achievements({ unlockedIds }: AchievementsProps) {
  const { t } = useLanguage();

  const achievements = Object.entries(t.achievements.list).map(([id, data]) => {
    const achievementData = data as { title: string; desc: string };
    return {
      id,
      title: achievementData.title,
      description: achievementData.desc,
      icon: ACHIEVEMENT_ICONS[id] || Award,
      color: ACHIEVEMENT_COLORS[id] || 'jade',
    };
  });

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-serif">{t.achievements.title}</h2>
        <p className="text-ink/60">{t.achievements.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, index) => {
          const isUnlocked = unlockedIds.includes(achievement.id);
          const Icon = achievement.icon;
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden group",
                isUnlocked 
                  ? "bg-white border-ink/5 shadow-xl shadow-ink/5" 
                  : "bg-parchment/50 border-ink/5 grayscale opacity-60"
              )}
            >
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
                achievement.color === 'jade' ? "bg-jade/10 text-jade" :
                achievement.color === 'gold' ? "bg-gold/10 text-gold" :
                "bg-cinnabar/10 text-cinnabar"
              )}>
                <Icon size={32} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{achievement.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{achievement.description}</p>
              </div>

              {isUnlocked && (
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-jade text-white rounded-full flex items-center justify-center shadow-lg shadow-jade/20">
                    <Star size={16} fill="currentColor" />
                  </div>
                </div>
              )}

              {!isUnlocked && (
                <div className="mt-6 h-2 bg-ink/5 rounded-full overflow-hidden">
                  <div className="h-full bg-ink/10 w-1/3" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
