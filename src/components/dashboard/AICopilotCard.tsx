'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Send, User, Lightbulb, Sparkles } from 'lucide-react'; // Added Sparkles icon

// Interface definitions remain the same
interface AssistantReply {
  introduction: string;
  keyPoints: string[];
  highlight: string;
  conclusion: string;
}
function isStructuredReply(content: any): content is AssistantReply {
  return content && typeof content.introduction === 'string';
}
interface Message {
  role: 'user' | 'assistant';
  content: string | AssistantReply;
}

export const AICopilotCard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) throw new Error('Network response was not ok.');
      
      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      const errorMessage: Message = { role: 'assistant', content: "Sorry, I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800 text-white h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Bot /> AI Co-Pilot</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto pr-4 custom-scrollbar">
          {/* ============================================= */}
          {/*          NEW: WELCOME MESSAGE                 */}
          {/* ============================================= */}
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <Sparkles className="h-12 w-12 mb-4" />
              <h3 className="text-lg font-semibold text-gray-300">Welcome to BullBear AI</h3>
              <p>Ask me about any financial concept, stock, or market trend to get started.</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 w-full animate-in fade-in-50 slide-in-from-bottom-2 duration-500 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && <div className="bg-green-600 p-2 rounded-full flex-shrink-0"><Bot className="h-5 w-5" /></div>}
              
              <div className={`p-4 rounded-lg max-w-md ${msg.role === 'user' ? 'bg-green-600' : 'bg-gray-800'}`}>
                {isStructuredReply(msg.content) ? (
                  <div className="prose prose-sm prose-invert max-w-none">
                    <p>{msg.content.introduction}</p>
                    <div className="my-4 p-3 bg-green-900/50 border border-green-500/50 rounded-lg">
                      <h4 className="font-bold flex items-center gap-2"><Lightbulb size={16}/> Key Insight</h4>
                      <p className="!mt-1">{msg.content.highlight}</p>
                    </div>
                    <ul>
                      {msg.content.keyPoints.map((point, i) => <li key={i}>{point}</li>)}
                    </ul>
                    <p>{msg.content.conclusion}</p>
                  </div>
                ) : (
                  <p>{msg.content as string}</p>
                )}
              </div>

              {msg.role === 'user' && <div className="bg-gray-800 p-2 rounded-full flex-shrink-0"><User className="h-5 w-5" /></div>}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 animate-in fade-in-50">
              <div className="bg-green-600 p-2 rounded-full animate-pulse"><Bot className="h-5 w-5" /></div>
              <div className="p-3 rounded-lg bg-gray-800 w-40"><div className="h-4 bg-gray-700 rounded animate-pulse"></div></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* ============================================= */}
        {/*          NEW: ENHANCED INPUT FORM             */}
        {/* ============================================= */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-4 border-t border-gray-800">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What is a P/E ratio?"
            className="bg-gray-800 border-gray-700 focus-visible:ring-1 focus-visible:ring-green-500 focus-visible:ring-offset-0 focus-visible:ring-offset-gray-900 transition-shadow shadow-md shadow-transparent focus:shadow-green-500/20"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="bg-green-600 hover:bg-green-700 flex-shrink-0" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};