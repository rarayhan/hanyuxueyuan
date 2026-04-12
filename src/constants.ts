import { Vocabulary, Achievement } from './types';

export const HSK_VOCAB: Vocabulary[] = [
  // HSK 1
  { id: '1', character: '我', pinyin: 'wǒ', meaning: 'I, me', level: 1, examples: [{ sentence: '我是学生。', translation: 'I am a student.' }] },
  { id: '2', character: '你', pinyin: 'nǐ', meaning: 'you', level: 1, examples: [{ sentence: '你好吗？', translation: 'How are you?' }] },
  { id: '3', character: '好', pinyin: 'hǎo', meaning: 'good, well', level: 1 },
  { id: '4', character: '是', pinyin: 'shì', meaning: 'to be, yes', level: 1 },
  { id: '5', character: '不', pinyin: 'bù', meaning: 'not, no', level: 1 },
  { id: '6', character: '了', pinyin: 'le', meaning: 'particle for completed action', level: 1 },
  { id: '7', character: '人', pinyin: 'rén', meaning: 'person, people', level: 1 },
  { id: '8', character: '大', pinyin: 'dà', meaning: 'big, large', level: 1 },
  { id: '9', character: '中', pinyin: 'zhōng', meaning: 'middle, center', level: 1 },
  { id: '10', character: '国', pinyin: 'guó', meaning: 'country, nation', level: 1 },
  // HSK 2
  { id: '11', character: '咖啡', pinyin: 'kāfēi', meaning: 'coffee', level: 2 },
  { id: '12', character: '考试', pinyin: 'kǎoshì', meaning: 'exam, test', level: 2 },
  { id: '13', character: '旅游', pinyin: 'lǚyóu', meaning: 'travel, tour', level: 2 },
  { id: '14', character: '便宜', pinyin: 'piányi', meaning: 'cheap, inexpensive', level: 2 },
  { id: '15', character: '颜色', pinyin: 'yánsè', meaning: 'color', level: 2 },
  // HSK 3
  { id: '16', character: '环境', pinyin: 'huánjìng', meaning: 'environment', level: 3 },
  { id: '17', character: '解决', pinyin: 'jiějué', meaning: 'to solve, to resolve', level: 3 },
  { id: '18', character: '特别', pinyin: 'tèbié', meaning: 'special, especially', level: 3 },
  // HSK 4
  { id: '19', character: '坚持', pinyin: 'jiānchí', meaning: 'to persist, to insist', level: 4 },
  { id: '20', character: '关键', pinyin: 'guānjiàn', meaning: 'key, crucial', level: 4 },
];

export const HSK_LEVELS = [
  { id: 1, name: 'Beginner Village', icon: '🌱' },
  { id: 2, name: 'Daily Life Town', icon: '🏘️' },
  { id: 3, name: 'Conversation City', icon: '🏙️' },
  { id: 4, name: 'Fluency Kingdom', icon: '🏯' },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_steps', title: 'First Steps', description: 'Learn your first 5 words', icon: '🌱' },
  { id: 'streak_3', title: 'Consistent Scholar', description: 'Maintain a 3-day streak', icon: '🔥' },
  { id: 'master_10', title: 'Character Master', description: 'Master 10 characters', icon: '📜' },
];
