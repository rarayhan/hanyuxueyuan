import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ClipboardCheck, Clock, AlertCircle, ChevronRight, Play } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

export default function MockTest() {
  const { t } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const tests = [
    { level: 1, duration: '40 mins', questions: 40, description: 'Basic vocabulary and simple structures.' },
    { level: 2, duration: '55 mins', questions: 60, description: 'Elementary communication in daily life.' },
    { level: 3, duration: '90 mins', questions: 80, description: 'Intermediate level communication.' },
    { level: 4, duration: '105 mins', questions: 100, description: 'Discussion on a wide range of topics.' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-serif">{t.mock.title}</h2>
        <p className="text-ink/60">{t.mock.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tests.map(test => (
          <div 
            key={test.level}
            className="bg-white rounded-3xl p-8 border border-ink/5 shadow-sm space-y-6 hover:border-cinnabar transition-all group"
          >
            <div className="flex justify-between items-start">
              <div className="w-16 h-16 bg-parchment rounded-2xl flex items-center justify-center text-cinnabar group-hover:bg-cinnabar group-hover:text-white transition-colors">
                <ClipboardCheck size={32} />
              </div>
              <div className="px-4 py-2 bg-parchment rounded-full text-xs font-bold uppercase tracking-widest text-ink/40">
                HSK {t.dashboard.level} {test.level}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold">HSK {test.level} Standard Mock</h3>
              <p className="text-ink/60">{test.description}</p>
            </div>

            <div className="flex items-center gap-6 border-t border-ink/5 pt-6">
              <div className="flex items-center gap-2 text-sm font-bold text-ink/40">
                <Clock size={16} />
                {test.duration}
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-ink/40">
                <AlertCircle size={16} />
                {test.questions} {t.mock.questions}
              </div>
            </div>

            <button className="w-full py-4 bg-ink text-parchment rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-cinnabar transition-all shadow-xl shadow-ink/10">
              <Play size={18} fill="currentColor" />
              {t.mock.start}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-parchment/50 p-8 rounded-3xl border border-ink/5 text-center space-y-4">
        <h4 className="font-bold">{t.mock.instructions}</h4>
        <p className="text-sm text-ink/60 max-w-2xl mx-auto">
          {t.mock.instructionsDesc}
        </p>
      </div>
    </div>
  );
}
