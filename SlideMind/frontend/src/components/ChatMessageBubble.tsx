import React from 'react';
import { ChatMessage } from '../types';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  onCiteSlide: (slideNumber: number) => void;
}

function renderContentWithCitations(content: string, onCiteSlide: (n: number) => void): React.ReactNode[] {
  const regex = /\[Slide (\d+)\]/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }
    const slideNum = parseInt(match[1], 10);
    parts.push(
      <button
        key={`cite-${key++}`}
        onClick={() => onCiteSlide(slideNum)}
        className="inline-flex items-center px-1.5 py-0.5 mx-0.5 bg-purple-50 text-purple-600 rounded text-xs font-medium hover:bg-purple-100 transition-colors align-middle"
      >
        S{slideNum}
      </button>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }
  return parts;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message, onCiteSlide }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
          isUser
            ? 'bg-[#1e3a5f] text-white rounded-br-sm'
            : 'bg-white text-gray-700 border border-gray-100 shadow-sm rounded-bl-sm'
        }`}
      >
        {isUser ? message.content : renderContentWithCitations(message.content, onCiteSlide)}
      </div>
    </div>
  );
};

export default ChatMessageBubble;
