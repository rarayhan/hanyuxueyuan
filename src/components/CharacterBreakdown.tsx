import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PenTool, Search, Sparkles, Loader2, Info } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export default function CharacterBreakdown() {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeCharacter = async (char?: string) => {
    const target = char || input;
    if (!target.trim()) return;
    
    setIsLoading(true);
    setInput(target);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const prompt = `Analyze the Chinese character(s) "${target}" for an HSK 1-2 learner.
      Include:
      1. Meaning & Pinyin
      2. Radical Breakdown (explain the components)
      3. Etymology (briefly explain the origin or visual logic)
      4. Memory Tip (a fun mnemonic)
      5. 2-3 common example words.
      Keep it educational, clear, and encouraging. Use Markdown formatting.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAnalysis(response.text || '');
    } catch (error) {
      console.error('Character analysis error', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickChars = [
    { char: '爱', label: 'Love' },
    { char: '学', label: 'Study' },
    { char: '好', label: 'Good' },
    { char: '家', label: 'Home' },
    { char: '明', label: 'Bright' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-ink rounded-2xl flex items-center justify-center text-white shadow-lg">
          <PenTool size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-serif font-bold">Character Breakdown</h2>
          <p className="text-ink/40 font-medium">Unlock the secrets hidden within each stroke</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        <div className="card-scholar space-y-6">
          <div className="relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && analyzeCharacter()}
              placeholder="Enter a character or word (e.g. 爱 or 学习)"
              className="w-full h-20 bg-silk rounded-2xl px-8 pr-20 font-chinese text-2xl focus:outline-none focus:ring-2 focus:ring-ink/10 border border-ink/5"
            />
            <button 
              onClick={() => analyzeCharacter()}
              disabled={isLoading || !input.trim()}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-ink text-white rounded-xl flex items-center justify-center hover:bg-ink-soft transition-all disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Search size={24} />}
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-ink/20 py-2">Quick Try:</span>
            {quickChars.map(({ char, label }) => (
              <button
                key={char}
                onClick={() => analyzeCharacter(char)}
                className="px-4 py-2 bg-silk rounded-xl text-ink/60 font-bold text-sm hover:bg-ink hover:text-white transition-all border border-ink/5"
              >
                <span className="font-chinese mr-2">{char}</span>
                <span className="opacity-40">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {analysis && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-scholar space-y-8"
          >
            <div className="flex flex-col items-center justify-center py-12 bg-silk/50 rounded-[2.5rem] border border-ink/5">
              <div className="text-9xl font-chinese text-cinnabar mb-4 drop-shadow-sm">
                {input}
              </div>
              <div className="flex items-center gap-2 text-ink/20">
                <Info size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Deep Analysis</span>
              </div>
            </div>

            <div className="prose prose-ink max-w-none space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-ink/5 shadow-sm whitespace-pre-wrap leading-relaxed text-ink/80">
                {analysis}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
