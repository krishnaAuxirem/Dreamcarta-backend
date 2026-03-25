import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, RefreshCw } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { AIMessage } from '@/types';
import { generateId } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const SUGGESTED_PROMPTS = [
  'How do I achieve financial freedom in 5 years?',
  'Help me create a morning routine for success',
  'What habits should I build to reach my career goals?',
  'How do I stay motivated when facing setbacks?',
  'Create a workout plan for a busy professional',
  'How do I start investing on a ₹30,000 salary?',
];

const AI_RESPONSES: Record<string, string> = {
  default: "I understand your question! Based on your profile and goals, here's my personalized advice:\n\n**Step 1:** Start with clarity — define exactly what success looks like for you in measurable terms.\n\n**Step 2:** Break it down into 90-day sprints. Focus on 3 key actions per sprint.\n\n**Step 3:** Build daily habits that directly support your goal. Consistency beats intensity every time.\n\n**Step 4:** Find an accountability partner or community (our DreamCarta community is perfect for this!).\n\nWould you like me to dive deeper into any of these steps?",
  financial: "Here's your personalized 5-year financial freedom roadmap:\n\n**Year 1:** Foundation Building\n• Build ₹3L emergency fund\n• Clear all high-interest debt\n• Start SIP ₹5,000/month in index funds\n\n**Year 2-3:** Growth Acceleration\n• Increase SIP to ₹15,000/month\n• Build one side income stream (₹20-50K/month)\n• Invest in yourself — upskill for higher salary\n\n**Year 4-5:** Wealth Building\n• Total investments: ₹50L+\n• Multiple income streams generating ₹1L+/month passively\n• Real estate or business investment\n\nWith consistent execution, financial freedom is absolutely achievable! 🎯",
  morning: "Here's the perfect morning routine for high achievers:\n\n**5:30 AM** — Wake up (no snooze!)\n**5:30-5:45** — Hydrate + light stretching\n**5:45-6:00** — 10-minute meditation (use guided apps)\n**6:00-6:30** — Exercise (walk, gym, or yoga)\n**6:30-6:45** — Cold shower (boosts alertness 200%!)\n**6:45-7:00** — Healthy breakfast\n**7:00-7:30** — Read / learning time\n**7:30-7:45** — Plan your day (3 top priorities)\n**8:00 AM** — Start your most important work\n\nThis routine, done consistently, will transform your productivity and mindset! 🌅",
};

function getResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('financial') || lower.includes('money') || lower.includes('invest')) return AI_RESPONSES.financial;
  if (lower.includes('morning') || lower.includes('routine') || lower.includes('wake')) return AI_RESPONSES.morning;
  return AI_RESPONSES.default;
}

const INITIAL_MESSAGES: AIMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hello! I'm your DreamCarta AI Coach. I'm here to help you design and achieve your dream life.\n\nI can help you with goal planning, habit building, financial advice, career guidance, mindset coaching, and much more. What would you like to work on today?",
    timestamp: new Date().toISOString(),
  },
];

export default function DashboardAICoachPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<AIMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: AIMessage = { id: generateId(), role: 'user', content: text, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    await new Promise((r) => setTimeout(r, 1500));
    const response = getResponse(text);
    const aiMsg: AIMessage = { id: generateId(), role: 'assistant', content: response, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, aiMsg]);
    setTyping(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <DashboardLayout title="AI Coach">
      <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[800px]">
        {/* Header */}
        <div className="bg-card border border-border rounded-t-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">DreamCarta AI Coach</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground">Always here for you</span>
            </div>
          </div>
          <button onClick={clearChat} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground" title="Clear chat">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-muted/20 border-x border-border p-4 space-y-4">
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mr-2 shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-tr-sm'
                  : 'bg-card border border-border text-foreground rounded-tl-sm'
              }`}>
                {msg.content.split('\n').map((line, i) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <strong key={i} className="block mt-2 first:mt-0">{line.replace(/\*\*/g, '')}</strong>;
                  }
                  if (line.startsWith('•')) {
                    return <p key={i} className="ml-2">{line}</p>;
                  }
                  return <p key={i} className={line === '' ? 'h-2' : ''}>{line}</p>;
                })}
              </div>
              {msg.role === 'user' && (
                <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=6133B4&color=fff`} alt="" className="w-8 h-8 rounded-full ml-2 shrink-0 mt-1 object-cover" />
              )}
            </motion.div>
          ))}

          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts */}
        <div className="bg-card border-x border-border px-4 py-2 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button key={prompt} onClick={() => sendMessage(prompt)} className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors whitespace-nowrap">
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="bg-card border border-border rounded-b-2xl p-3">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your AI coach anything..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              disabled={typing}
            />
            <button type="submit" disabled={!input.trim() || typing} className="btn-primary px-4 py-2.5 flex items-center gap-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-2">AI responses are for guidance only. Always exercise your own judgment.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
