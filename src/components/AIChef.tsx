import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIQuartermaster: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Quartermaster Online. State your logistics inquiry.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await sendMessageToGemini(userMsg);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 left-6 z-50 p-4 shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 border-2 border-white/20
          ${isOpen ? 'bg-red-800 rotate-45 rounded-full' : 'bg-[#4c6049] rounded-sm hover:bg-[#3d4d3b]'}`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        ) : (
          <div className="relative">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-80 md:w-96 bg-[#1f2937] rounded-sm shadow-2xl overflow-hidden flex flex-col border border-[#4c6049] animate-fade-in-up font-mono">
          <div className="bg-[#4c6049] p-3 flex items-center justify-between border-b border-[#3d4d3b]">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-sm bg-[#1f2937] flex items-center justify-center text-[#4c6049] font-bold text-sm border border-gray-600">
                  QM
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider">Logistics AI</h3>
                  <p className="text-gray-300 text-[10px] uppercase">Secure Channel</p>
                </div>
             </div>
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></div>
          </div>

          <div className="h-80 overflow-y-auto p-4 bg-[#111827] flex flex-col gap-3 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[90%] p-3 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#2e3c87] text-white self-end border border-[#4c5bb5] rounded-tl-lg rounded-bl-lg rounded-br-none'
                    : 'bg-[#1f2937] text-gray-200 border border-gray-700 self-start rounded-tr-lg rounded-br-lg rounded-bl-none'
                }`}
              >
                <span className="block text-[9px] opacity-50 mb-1 uppercase tracking-wider">
                  {msg.role === 'user' ? 'OPERATOR' : 'SYSTEM'}
                </span>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="self-start text-[#4c6049] text-xs font-mono animate-pulse">
                 PROCESSING INQUIRY...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-[#1f2937] border-t border-[#374151]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Enter query..."
                className="flex-1 bg-[#111827] text-white rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#4c6049] border border-[#374151] font-mono"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-[#4c6049] text-white px-4 py-2 rounded-sm hover:bg-[#3d4d3b] disabled:opacity-50 transition-colors uppercase text-xs font-bold"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIQuartermaster;
