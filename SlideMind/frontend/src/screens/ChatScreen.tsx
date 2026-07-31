import React, { useEffect, useRef, useState } from 'react';
import { SlideData, ChatMessage } from '../types';
import { askChatQuestion } from '../utils/api';
import ChatMessageBubble from '../components/ChatMessageBubble';

interface ChatScreenProps {
  slides: SlideData[];
  lectureTitle: string;
  hasApiKey: boolean;
  onBack: () => void;
}

const QUICK_PROMPTS = [
  'Tóm tắt bài giảng này',
  'Giải thích các thuật ngữ khó',
  'Đưa ra câu hỏi ôn tập'
];

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const ChatScreen: React.FC<ChatScreenProps> = ({ slides, lectureTitle, hasApiKey, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSlide, setExpandedSlide] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (text: string) => {
    const question = text.trim();
    if (!question || loading || !hasApiKey) return;

    const userMessage: ChatMessage = { id: genId(), role: 'user', content: question };
    const history = messages;
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      const answer = await askChatQuestion(slides, history, question);
      setMessages(prev => [...prev, { id: genId(), role: 'assistant', content: answer }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi không xác định';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCiteSlide = (slideNumber: number) => {
    setExpandedSlide(slideNumber);
    document.getElementById(`chat-slide-${slideNumber}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-[#1e3a5f] text-white flex-shrink-0">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-all flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-500 text-white">
                CHAT AI
              </span>
              <span className="text-blue-300 text-xs">{slides.length} slides</span>
            </div>
            <h1 className="text-lg font-bold leading-tight truncate">{lectureTitle}</h1>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-0 md:gap-4 px-0 md:px-4 py-0 md:py-4">
        {/* Slide list */}
        <div className="flex flex-col bg-white md:rounded-xl border-b md:border border-gray-100 md:shadow-sm overflow-hidden max-h-40 md:max-h-none">
          <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Slide bài giảng</h2>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {slides.map(slide => {
              const isExpanded = expandedSlide === slide.slideNumber;
              return (
                <div key={slide.slideNumber} id={`chat-slide-${slide.slideNumber}`}>
                  <button
                    onClick={() => setExpandedSlide(isExpanded ? null : slide.slideNumber)}
                    className={`w-full flex items-start gap-2.5 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      isExpanded ? 'bg-blue-50' : ''
                    }`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-[#1e3a5f] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {slide.slideNumber}
                    </span>
                    <span className="text-xs font-medium text-gray-700 leading-snug">{slide.title}</span>
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-3 -mt-1">
                      <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">
                        {slide.content || slide.rawText}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat panel */}
        <div className="flex flex-col bg-white md:rounded-xl border-t md:border border-gray-100 md:shadow-sm overflow-hidden min-h-0">
          {!hasApiKey ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1.5">Cần cấu hình API key</h3>
              <p className="text-gray-500 text-xs leading-relaxed max-w-xs">
                Tính năng Chat AI Agent cần một API key hợp lệ (ANTHROPIC_API_KEY, OPENAI_API_KEY hoặc GEMINI_API_KEY) trong <code className="bg-gray-100 px-1 py-0.5 rounded">backend/.env</code>. Vui lòng cấu hình và khởi động lại backend.
              </p>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">Hỏi AI Agent bất cứ điều gì về bài giảng này</p>
                  </div>
                )}
                {messages.map(m => (
                  <ChatMessageBubble key={m.id} message={m} onCiteSlide={handleCiteSlide} />
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-2.5">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {error && (
                <div className="mx-4 mb-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
                  {error}
                </div>
              )}

              {/* Quick prompts */}
              {messages.length === 0 && (
                <div className="px-4 pb-2 flex gap-2 flex-wrap flex-shrink-0">
                  {QUICK_PROMPTS.map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-600 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-gray-100 flex-shrink-0 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(input);
                    }
                  }}
                  placeholder="Nhập câu hỏi về bài giảng..."
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-50"
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={loading || !input.trim()}
                  className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex-shrink-0 ${
                    loading || !input.trim()
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-[#1e3a5f] hover:bg-[#152943] text-white'
                  }`}
                >
                  Gửi
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
