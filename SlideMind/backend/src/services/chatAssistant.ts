import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { SlideData, ChatMessage } from '../types';
import { AiProvider } from './summarizer';

interface ActiveAiProvider {
  provider: AiProvider;
  apiKey: string;
}

const CHAT_MAX_TOKENS = 1024;

function buildChatSystemPrompt(slides: SlideData[]): string {
  const slidesText = slides.length > 0
    ? slides.map(s => `--- SLIDE ${s.slideNumber}: ${s.title} ---\n${s.content || s.rawText}`).join('\n\n')
    : '(Không có nội dung slide nào được cung cấp)';

  return `You are a friendly AI study assistant chatting with a student about their lecture slides.

Answer only using the slide content below. Cite [Slide N] when referencing specific content. If the slides don't cover something the student asks about, say so honestly instead of inventing facts, and suggest they check with their instructor.
Respond entirely in Vietnamese, in a conversational, concise tone. Do not return JSON — plain text only.

SLIDE CONTENT:
${slidesText}`;
}

async function callClaudeChat(
  slides: SlideData[],
  history: ChatMessage[],
  question: string,
  apiKey: string
): Promise<string> {
  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6',
    max_tokens: CHAT_MAX_TOKENS,
    system: buildChatSystemPrompt(slides),
    messages: [
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user' as const, content: question }
    ]
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }
  return content.text;
}

async function callOpenAIChat(
  slides: SlideData[],
  history: ChatMessage[],
  question: string,
  apiKey: string
): Promise<string> {
  const client = new OpenAI({ apiKey });

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    max_tokens: CHAT_MAX_TOKENS,
    messages: [
      { role: 'system', content: buildChatSystemPrompt(slides) },
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: question }
    ]
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error('Empty response from OpenAI');
  }
  return text;
}

async function callGeminiChat(
  slides: SlideData[],
  history: ChatMessage[],
  question: string,
  apiKey: string
): Promise<string> {
  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-flash-latest',
    systemInstruction: buildChatSystemPrompt(slides)
  });

  const chat = model.startChat({
    history: history.map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }]
    }))
  });

  const result = await chat.sendMessage(question);
  return result.response.text();
}

export async function answerSlideQuestion(
  slides: SlideData[],
  history: ChatMessage[],
  question: string,
  activeProvider: ActiveAiProvider
): Promise<string> {
  switch (activeProvider.provider) {
    case 'openai':
      return callOpenAIChat(slides, history, question, activeProvider.apiKey);
    case 'gemini':
      return callGeminiChat(slides, history, question, activeProvider.apiKey);
    case 'anthropic':
    default:
      return callClaudeChat(slides, history, question, activeProvider.apiKey);
  }
}
