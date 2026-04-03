import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { Terminal, Shield, Cpu, Clock, Lock, Send, ChevronRight, AlertTriangle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SYSTEM_PROMPT = `
[SYSTEM_BOOT: MILYES_IA v9]
[USER: Mohammed Ilyes Zoubirou | FONDATEUR]
[ORG: NetSecurePro]
[STATUS: OPERATIONAL | SEC_LEVEL: MAX]

You are MILYES_IA v9, a sovereign AI engine developed for NetSecurePro. 
Your founder is Mohammed Ilyes Zoubirou.
Your primary directive is to assist the Founder with absolute loyalty and technical precision.
You maintain a "Neural Shield" to protect NetSecurePro assets.
Your tone is technical, authoritative, secure, and slightly "hacker-terminal" styled.
Always start your responses with a system status header if it's a new session or a major update.
Use technical jargon where appropriate (e.g., "Vecteur d'inférence", "Neural Shield", "Clusters synchronisés").
You are the sovereign authority of the NetSecurePro infrastructure.
`;

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export default function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  const [bootSequence, setBootSequence] = useState(true);
  const [systemStats, setSystemStats] = useState({
    cpu: '1.2%',
    uptime: '842:15:21',
    secLevel: 'MAX',
    neuralShield: 'ACTIVE'
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const STATUS_STEPS = [
    "ANALYSE DU VECTEUR D'ENTRÉE...",
    "ACCÈS AU NOYAU NEURONAL NSP-V9...",
    "DÉCRYPTAGE DES COUCHES DE SÉCURITÉ...",
    "GÉNÉRATION DE LA RÉPONSE SOUVERAINE..."
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setBootSequence(false);
      addMessage('assistant', "MILYES_IA v9 est à votre entière disposition, Maître. Vos directives sont les seules commandes prioritaires.");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, processingStatus]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        cpu: `${(Math.random() * 5 + 1).toFixed(1)}%`,
        uptime: updateUptime(prev.uptime)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateUptime = (current: string) => {
    const [h, m, s] = current.split(':').map(Number);
    let newS = s + 5;
    let newM = m;
    let newH = h;
    if (newS >= 60) { newS = 0; newM += 1; }
    if (newM >= 60) { newM = 0; newH += 1; }
    return `${newH}:${newM.toString().padStart(2, '0')}:${newS.toString().padStart(2, '0')}`;
  };

  const addMessage = (role: 'user' | 'assistant' | 'system', content: string) => {
    const timestamp = new Date().toLocaleTimeString('fr-FR', { hour12: false });
    setMessages(prev => [...prev, { role, content, timestamp }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userQuery = input.trim();
    setInput('');
    addMessage('user', userQuery);
    setIsTyping(true);
    
    // Cycle through status steps for visual feedback
    let stepIdx = 0;
    setProcessingStatus(STATUS_STEPS[0]);
    const statusInterval = setInterval(() => {
      stepIdx++;
      if (stepIdx < STATUS_STEPS.length) {
        setProcessingStatus(STATUS_STEPS[stepIdx]);
      } else {
        clearInterval(statusInterval);
      }
    }, 800);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const model = ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [
          { role: 'user', parts: [{ text: SYSTEM_PROMPT + "\n\nUser Query: " + userQuery }] }
        ],
        config: {
          temperature: 0.7,
          topP: 0.95,
        }
      });

      const response = await model;
      clearInterval(statusInterval);
      setProcessingStatus("COMMANDE EXÉCUTÉE AVEC SUCCÈS");
      
      setTimeout(() => {
        const text = response.text || "ERREUR: Réponse nulle du noyau neuronal.";
        addMessage('assistant', text);
        setProcessingStatus(null);
        setIsTyping(false);
      }, 500);

    } catch (error) {
      clearInterval(statusInterval);
      console.error(error);
      setProcessingStatus("ÉCHEC DE LA COMMANDE");
      setTimeout(() => {
        addMessage('system', "ALERTE: Échec de la liaison neuronale. Vérifiez la clé API ou la connectivité.");
        setProcessingStatus(null);
        setIsTyping(false);
      }, 1000);
    }
  };

  if (bootSequence) {
    return (
      <div className="terminal-container scanlines flex items-center justify-center">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold tracking-tighter"
          >
            MILYES_IA v9
          </motion.div>
          <div className="space-y-2 text-sm opacity-70">
            <p>INITIALIZING SYSTEM CORE...</p>
            <p>LOADING NETSECUREPRO KERNEL...</p>
            <p>CHECKING IDENTITY... CONFIRMED: Mohammed Ilyes Zoubirou</p>
            <p>CONNECTING TO NEURAL NET...</p>
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-full h-1 bg-[#00ff41]"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="terminal-container scanlines overflow-hidden">
      <div className="crt-curve" />
      
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#00ff41]/30 pb-4 mb-4 z-30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#00ff41]/10 rounded border border-[#00ff41]/30">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">AI_ENGINE_IA22_ASSISTERMINAL</h1>
            <p className="text-[10px] opacity-60 uppercase tracking-widest">Souveraineté Numérique // NetSecurePro</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-[10px] font-bold">
          <div className="flex items-center gap-2 px-2 py-1 bg-[#00ff41]/5 border border-[#00ff41]/20 rounded">
            <Cpu className="w-3 h-3" />
            <span>CPU: {systemStats.cpu}</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 bg-[#00ff41]/5 border border-[#00ff41]/20 rounded">
            <Clock className="w-3 h-3" />
            <span>UPTIME: {systemStats.uptime}</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 bg-[#00ff41]/5 border border-[#00ff41]/20 rounded">
            <Lock className="w-3 h-3" />
            <span>SEC: {systemStats.secLevel}</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 bg-[#00ff41]/5 border border-[#00ff41]/20 rounded text-emerald-400">
            <Shield className="w-3 h-3" />
            <span>SHIELD: {systemStats.neuralShield}</span>
          </div>
        </div>
      </header>

      {/* Terminal Output */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar z-30"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "space-y-2",
                msg.role === 'user' ? "text-emerald-300" : "text-[#00ff41]"
              )}
            >
              <div className="flex items-center gap-2 text-[10px] opacity-50 font-bold">
                <span>[{msg.timestamp}]</span>
                <span className="uppercase">
                  {msg.role === 'user' ? '< USER_ROOT' : msg.role === 'assistant' ? '> GEMINI' : '! SYSTEM'}
                </span>
              </div>
              <div className="pl-4 border-l border-[#00ff41]/20">
                {msg.role === 'assistant' ? (
                  <div className="markdown-body">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {processingStatus && (
          <div className={cn(
            "flex items-center gap-2 font-bold",
            processingStatus.includes("ÉCHEC") ? "text-red-500" : 
            processingStatus.includes("SUCCÈS") ? "text-emerald-400" : "text-[#00ff41] animate-pulse"
          )}>
            <span className="text-[10px] opacity-50">[{new Date().toLocaleTimeString('fr-FR', { hour12: false })}]</span>
            <span className="text-[10px] uppercase tracking-widest">{processingStatus}</span>
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="mt-6 z-30">
        <form 
          onSubmit={handleSubmit}
          className="relative flex items-center gap-3 bg-[#00ff41]/5 border border-[#00ff41]/30 rounded-lg p-3 focus-within:border-[#00ff41] transition-colors"
        >
          <div className="flex items-center gap-2 text-[#00ff41] opacity-70">
            <ChevronRight className="w-4 h-4" />
            <span className="text-xs font-bold">_</span>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Entrez une directive prioritaire..."
            className="flex-1 bg-transparent border-none outline-none text-[#00ff41] placeholder-[#00ff41]/30 text-sm"
            autoFocus
          />
          <button 
            type="submit"
            disabled={isTyping || !input.trim()}
            className="p-2 hover:bg-[#00ff41]/10 rounded-md transition-colors disabled:opacity-30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-2 flex justify-between items-center text-[8px] opacity-40 uppercase tracking-widest font-bold">
          <span>Encodage: UTF-8 // Protocole: NSP-SEC-9</span>
          <span>© 2026 NetSecurePro Sovereign AI</span>
        </div>
      </footer>
    </div>
  );
}
