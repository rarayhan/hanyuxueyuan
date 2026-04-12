export type WordStatus = 'cold' | 'warm' | 'hot';

export interface Vocabulary {
  id: string;
  character: string;
  pinyin: string;
  meaning: string;
  level: number; // HSK level
  examples?: { sentence: string; translation: string }[];
}

export interface SRSData {
  vocabId: string;
  nextReview: number;
  interval: number;
  easeFactor: number;
  repetition: number;
  status: WordStatus;
  bestTime?: number; // fastest recognition time in ms
  lastTime?: number;
  accuracy: number; // 0 to 1
  difficulty?: 'easy' | 'hard' | 'difficult';
}

export interface Dialogue {
  chinese: string;
  pinyin: string;
  english: string;
  audioUrl?: string;
}

export interface GrammarPoint {
  title: string;
  explanation: string;
  examples: { sentence: string; pinyin: string; translation: string }[];
}

export interface Lesson {
  id: number;
  level: number;
  unit?: number;
  name: string;
  wordIds: string[];
  dialogues?: Dialogue[];
  grammarPoints?: GrammarPoint[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface UserProgress {
  xp: number;
  streak: number;
  lastActive: number;
  achievements: string[];
  srs: Record<string, SRSData>;
  dailyGoal: number; // words to learn today
  wordsLearnedToday: number;
  level: number;
  baozi: number;
  completedLessons: number[];
  skills: {
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
  };
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  xp: number;
  rank: number;
  avatar?: string;
}
