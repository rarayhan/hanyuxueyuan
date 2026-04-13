import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Sparkles, RefreshCw, Languages, Loader2 } from 'lucide-react';
import { Type } from '@google/genai';
import { getGeminiClient } from '../services/gemini';
import { useLanguage } from '../contexts/LanguageContext';
import ReactMarkdown from 'react-markdown';

export default function StoryGenerator() {
  const { showPinyin, t } = useLanguage();
  const [vocab, setVocab] = useState('');
  const [theme, setTheme] = useState('');
  const [difficulty, setDifficulty] = useState('Basic');
  const [story, setStory] = useState<{ chinese: string; pinyin: string; english: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateStory = async () => {
    if (!vocab.trim()) return;
    setIsLoading(true);
    setExplanation(null);
    setError(null);
    
    try {
      const prompt = `Create a short, engaging reading comprehension story in Chinese (Simplified) for a Sinology Architecture curriculum.
      DIFFICULTY LEVEL: ${difficulty}
      MANDATORY THEME: "Achievements of Ancient Chinese Architecture" (中国古代建筑成就).
      ALLOWED SUBJECTS: Civil residences (民居), government offices (官府), imperial palaces (皇宫), and bridges (桥梁).
      STRICTLY FORBIDDEN: Do NOT include any references to temples (庙宇) or pagodas (宝塔).
      TIMEFRAME: All historical context must be strictly from before the year 1911.
      MUST use these vocabulary words naturally: ${vocab}
      User requested sub-theme: ${theme || 'ancient architecture'}
      Length: 5-8 sentences.
      Format the response as a JSON object with keys: "chinese", "pinyin", "english". 
      The "chinese" should be the story in characters, "pinyin" the pinyin for the whole story, and "english" the translation.`;

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              chinese: { type: Type.STRING },
              pinyin: { type: Type.STRING },
              english: { type: Type.STRING },
            },
            required: ['chinese', 'pinyin', 'english'],
          }
        }
      });

      const text = response.text || '';
      const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text;
      const data = JSON.parse(jsonStr);
      setStory(data);
    } catch (err: any) {
      console.error('Story generation error', err);
      setError(err.message || 'Failed to generate story. Please check your API key or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const explainGrammar = async () => {
    if (!story) return;
    setIsExplaining(true);
    setError(null);
    
    try {
      const prompt = `Explain 2-3 simple grammar points from this Chinese story for an HSK 1-2 learner. 
      Story: ${story.chinese}
      Keep it very simple and encouraging. Use bullet points.`;

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
      });

      setExplanation(response.text || '');
    } catch (err: any) {
      console.error('Grammar explanation error', err);
      setError(err.message || 'Failed to explain grammar. Please check your API key or try again.');
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-cinnabar rounded-2xl flex items-center justify-center text-white shadow-lg">
          <BookOpen size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-serif font-bold">Story Generator</h2>
          <p className="text-ink/40 font-medium">Turn your vocabulary into immersive tales</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card-scholar space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-ink/40">Your Vocabulary</label>
              <textarea 
                value={vocab}
                onChange={(e) => setVocab(e.target.value)}
                placeholder="e.g. 你好, 朋友, 吃饭..."
                className="w-full h-32 bg-silk rounded-2xl p-4 font-chinese text-lg focus:outline-none focus:ring-2 focus:ring-cinnabar/20 border border-ink/5 resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-ink/40">Story Theme</label>
              <input 
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g. A day at the park"
                className="w-full bg-silk rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cinnabar/20 border border-ink/5"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-ink/40">Difficulty Level</label>
              <select 
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-silk rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cinnabar/20 border border-ink/5"
              >
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <button 
              onClick={generateStory}
              disabled={isLoading || !vocab.trim()}
              className="w-full btn-cinnabar justify-center py-4 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              Generate Story
            </button>
            {error && (
              <div className="p-4 bg-cinnabar/10 text-cinnabar rounded-xl border border-cinnabar/20 text-sm font-medium">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Output Area */}
        <div className="lg:col-span-2">
          {story ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="card-scholar space-y-8">
                <div className="space-y-4">
                  <div className="text-3xl font-chinese leading-relaxed text-ink">
                    {story.chinese}
                  </div>
                  {showPinyin && (
                    <div className="text-lg font-mono text-cinnabar font-medium">
                      {story.pinyin}
                    </div>
                  )}
                </div>
                
                <div className="pt-8 border-t border-ink/5">
                  <div className="flex items-center gap-2 text-ink/40 mb-4">
                    <Languages size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Translation</span>
                  </div>
                  <p className="text-xl text-ink/60 italic leading-relaxed">
                    "{story.english}"
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={generateStory}
                    className="flex-1 btn-outline justify-center"
                  >
                    <RefreshCw size={18} />
                    New Version
                  </button>
                  <button 
                    onClick={explainGrammar}
                    disabled={isExplaining}
                    className="flex-1 btn-gold justify-center"
                  >
                    {isExplaining ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                    Explain Grammar
                  </button>
                </div>
              </div>

              {explanation && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="card-scholar bg-gold/5 border-gold/20"
                >
                  <h3 className="text-xl font-serif font-bold text-gold mb-4 flex items-center gap-2">
                    <Sparkles size={20} />
                    Grammar Breakdown
                  </h3>
                  <div className="prose prose-ink max-w-none text-ink/70 leading-relaxed markdown-body">
                    <ReactMarkdown>{explanation}</ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-ink/10 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 space-y-4">
              <div className="w-20 h-20 bg-silk rounded-full flex items-center justify-center text-ink/10">
                <BookOpen size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-ink/20">Your story awaits</h3>
                <p className="text-ink/10 font-medium">Enter some words and a theme to begin your journey</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
