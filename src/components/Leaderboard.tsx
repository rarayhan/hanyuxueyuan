import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, User, Crown } from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', name: 'Li Wei', xp: 12500, rank: 1 },
  { id: '2', name: 'Sarah J.', xp: 10200, rank: 2 },
  { id: '3', name: 'Chen Bo', xp: 9800, rank: 3 },
  { id: '4', name: 'Alex Wong', xp: 8500, rank: 4 },
  { id: '5', name: 'Mei Ling', xp: 7200, rank: 5 },
];

export default function Leaderboard() {
  const { t } = useLanguage();
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-serif">{t.leaderboard.title}</h2>
        <p className="text-ink/60">{t.leaderboard.subtitle}</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-ink/5 shadow-xl overflow-hidden">
        <div className="p-8 bg-ink text-parchment flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-ink">
              <Crown size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">{t.leaderboard.weekly}</h3>
              <p className="text-parchment/60 text-sm">{t.leaderboard.resets}</p>
            </div>
          </div>
          <Trophy className="text-gold" size={32} />
        </div>

        <div className="divide-y divide-ink/5">
          {MOCK_LEADERBOARD.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-6 flex items-center justify-between hover:bg-parchment/50 transition-colors",
                entry.rank <= 3 ? "bg-silk/30" : ""
              )}
            >
              <div className="flex items-center gap-6">
                <div className="w-10 text-center">
                  {entry.rank === 1 ? <Medal className="text-gold mx-auto" size={28} /> :
                   entry.rank === 2 ? <Medal className="text-slate-400 mx-auto" size={24} /> :
                   entry.rank === 3 ? <Medal className="text-amber-600 mx-auto" size={24} /> :
                   <span className="text-xl font-mono text-ink/20 font-bold">{entry.rank}</span>}
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-parchment rounded-2xl flex items-center justify-center text-ink/20 border border-ink/5">
                    <User size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-lg">{entry.name}</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-ink/40">{t.dashboard.level} {Math.floor(entry.xp / 1000) + 1}</div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono font-bold text-cinnabar">{entry.xp.toLocaleString()}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-ink/40">{t.profile.totalXp}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-gold/10 p-6 rounded-3xl border border-gold/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gold text-white rounded-2xl flex items-center justify-center font-bold text-xl">
            12
          </div>
          <div>
            <div className="font-bold">{t.leaderboard.yourRank}</div>
            <div className="text-sm text-ink/60">{t.leaderboard.topPercent}</div>
          </div>
        </div>
        <button className="text-gold font-bold hover:underline">{t.dashboard.viewAll}</button>
      </div>
    </div>
  );
}
