import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
 
import deekseekClient from '../services/deepseek';

// Speech Recognition types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function AISpeakingPartner() {
  const { showPinyin, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string, pinyin?: string }[]>([
    { role: 'ai', text: '你好！我是你的中文练习伙伴。你想聊什么？', pinyin: 'Nǐ hǎo! Wǒ shì nǐ de zhōngwén liànxí huǒbàn. Nǐ xiǎng liáo shénme?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'zh-CN';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.results[0][0].transcript;
        setTranscript(current);
        setErrorStatus(null);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'no-speech') {
          setErrorStatus('No speech detected. Try again?');
          setTimeout(() => setErrorStatus(null), 3000);
        } else {
          console.error('Speech recognition error', event.error);
          setErrorStatus(`Error: ${event.error}`);
          setTimeout(() => setErrorStatus(null), 5000);
        }
      };
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      if (transcript) handleSend(transcript);
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    window.speechSynthesis.speak(utterance);
  };

 const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg = { role: 'user' as const, text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setTranscript('');

    try {
      const systemInstruction = 'You are a friendly Chinese speaking partner for an HSK 1-2 level student. Keep your responses short, simple, and encouraging. Always provide the Chinese characters followed by Pinyin in parentheses.';
      
      // Format messages for DeepSeek/OpenAI
      const chatMessages = messages.map(m => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.text
      }));

      // Call DeepSeek via the client
      const response = await deepseekClient.chat.completions.create({
        model: 'deepseek-chat', 
        messages: [
          { role: 'system', content: systemInstruction },
          ...chatMessages,
          { role: 'user', content: text }
        ] as any,
        temperature: 0.7,
      });

      const aiText = response.choices[0]?.message?.content || '';

      // Basic parsing for pinyin if provided in parentheses
      const pinyinMatch = aiText.match(/\(([^)]+)\)/);
      const cleanText = aiText.replace(/\([^)]+\)/g, '').trim();

      const aiMsg = { 
        role: 'ai' as const, 
        text: cleanText, 
        pinyin: pinyinMatch ? pinyinMatch[1] : undefined 
      };
      
      setMessages(prev => [...prev, aiMsg]);
      speak(cleanText);
    } catch (error: any) {
      console.error('AI error', error);
      setErrorStatus(error.message || 'Failed to connect to DeepSeek.');
      setMessages(prev => [...prev, { role: 'ai', text: '对不起，我现在有点累了。请稍后再试。', pinyin: 'Duìbùqǐ, wǒ xiànzài yǒudiǎn lèile. Qǐng shāohòu zài shì.' }]);
      setTimeout(() => setErrorStatus(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[700px] flex flex-col bg-white rounded-[3rem] border border-ink/10 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-8 bg-ink text-parchment flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-cinnabar rounded-2xl flex items-center justify-center shadow-lg border border-white/10">
            <Bot size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold">AI Speaking Partner</h3>
            <p className="text-parchment/40 text-xs uppercase tracking-widest font-bold">HSK 1-2 Level Roleplay</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-[10px] font-bold border border-white/5 text-parchment/80">
          <div className="relative w-5 h-5 flex items-center justify-center bg-blue-500/20 rounded-full">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-blue-400 fill-blue-400">
              <path d="M2 16c0-4 4-8 10-8s10 4 10 8c0 2-2 3-5 3-2 0-3-1-5-1s-3 1-5 1c-3 0-5-1-5-3Z" />
              <path d="M16 8c0-3 2-5 5-6-1 3-1 6-1 6" />
              <circle cx="7" cy="14" r="0.6" fill="white" stroke="none" />
            </svg>
          </div>
          <span>Powered by <span className="text-blue-400">Gemini 3.1 Pro</span></span>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-parchment/20">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-4 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
              msg.role === 'ai' ? "bg-cinnabar text-white" : "bg-ink text-white"
            )}>
              {msg.role === 'ai' ? <Bot size={20} /> : <User size={20} />}
            </div>
            <div className={cn(
              "p-6 rounded-[2rem] shadow-sm space-y-3 relative",
              msg.role === 'ai' ? "bg-white border border-ink/5" : "bg-ink text-parchment"
            )}>
              <div className="text-2xl font-chinese leading-relaxed">{msg.text}</div>
              {msg.pinyin && showPinyin && (
                <div className={cn(
                  "text-sm font-mono font-bold tracking-wide",
                  msg.role === 'ai' ? "text-cinnabar" : "text-gold"
                )}>
                  {msg.pinyin}
                </div>
              )}
              {msg.role === 'ai' && (
                <button 
                  onClick={() => speak(msg.text)}
                  className="absolute -right-12 top-0 p-3 hover:bg-silk rounded-xl transition-colors text-ink/20 hover:text-cinnabar"
                >
                  <Volume2 size={20} />
                </button>
              )}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-cinnabar text-white rounded-xl flex items-center justify-center animate-pulse">
              <Bot size={20} />
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-ink/5 shadow-sm">
              <Loader2 size={24} className="animate-spin text-cinnabar" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-8 bg-white border-t border-ink/10">
        <div className="flex gap-4 items-center">
          <button
            onClick={toggleListening}
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-lg",
              isListening ? "bg-cinnabar text-white animate-pulse" : "bg-silk text-ink/40 hover:bg-ink hover:text-white"
            )}
          >
            {isListening ? <Mic size={28} /> : <MicOff size={28} />}
          </button>
          
          <div className="flex-1 relative">
            <input 
              type="text"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(transcript)}
              placeholder={isListening ? "Listening..." : "Type or speak Chinese..."}
              className="w-full h-16 bg-silk rounded-2xl px-8 font-chinese text-xl focus:outline-none focus:ring-2 focus:ring-cinnabar/20 border border-ink/10"
            />
            <button 
              onClick={() => handleSend(transcript)}
              disabled={!transcript.trim() || isLoading}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-cinnabar hover:bg-cinnabar/10 rounded-xl disabled:opacity-20 transition-all"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
        <div className="mt-4 text-center text-[10px] font-bold uppercase tracking-widest">
          <AnimatePresence mode="wait">
            {errorStatus ? (
              <motion.span 
                key="error"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-cinnabar"
              >
                {errorStatus}
              </motion.span>
            ) : (
              <motion.span 
                key="status"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-ink/20"
              >
                {isListening ? "Speak now..." : "Press the mic to start speaking"}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
