import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { SlideData, SummaryOptions, SummaryResult, SlideSummary, MainTopic, KeyTerm } from '../types';
import { demoSummary } from '../data/demoData';

export type AiProvider = 'anthropic' | 'openai' | 'gemini';

interface ActiveAiProvider {
  provider: AiProvider;
  apiKey: string;
}

const hasValue = (value: string | undefined): value is string => {
  return !!(value && value.trim().length > 0);
};

export function getActiveAiProvider(): ActiveAiProvider | null {
  const requestedProvider = (process.env.AI_PROVIDER || 'auto').trim().toLowerCase();
  const providers: Record<AiProvider, string | undefined> = {
    anthropic: process.env.ANTHROPIC_API_KEY,
    openai: process.env.OPENAI_API_KEY,
    gemini: process.env.GEMINI_API_KEY
  };

  if (requestedProvider !== 'auto') {
    if (requestedProvider in providers) {
      const provider = requestedProvider as AiProvider;
      return hasValue(providers[provider])
        ? { provider, apiKey: providers[provider].trim() }
        : null;
    }

    console.warn(`Unknown AI_PROVIDER "${requestedProvider}", falling back to auto provider selection.`);
  }

  for (const provider of ['anthropic', 'openai', 'gemini'] as AiProvider[]) {
    if (hasValue(providers[provider])) {
      return { provider, apiKey: providers[provider].trim() };
    }
  }

  return null;
}

function buildLengthInstruction(length: string): string {
  switch (length) {
    case 'short': return 'short and concise (1-2 sentences for each section)';
    case 'detailed': return 'detailed (4-6 sentences for each section, with deeper explanation)';
    default: return 'balanced (2-3 sentences for each section)';
  }
}

function buildPrompt(slides: SlideData[], options: SummaryOptions): string {
  const slidesText = slides.map(s =>
    `--- SLIDE ${s.slideNumber}: ${s.title} ---\n${s.content || s.rawText}`
  ).join('\n\n');

  const langInstruction = options.language === 'en'
    ? 'Respond entirely in English.'
    : 'Respond entirely in Vietnamese.';

  return `You are an AI study assistant that summarizes lecture slides.

${langInstruction}
Summary length: ${buildLengthInstruction(options.length)}
Use only information from the slides. Cite [Slide N] when referencing specific content. Do not invent facts.

SLIDE CONTENT:
${slidesText}

Return valid JSON only. Do not wrap it in markdown code fences.
Use this shape:
{
  "lectureTitle": "Lecture title",
  "totalSlides": ${slides.length},
  "overallSummary": "3-4 paragraph summary with [Slide N] citations",
  "mainTopics": [
    {
      "title": "Main topic",
      "summary": "Topic summary with [Slide N] citations",
      "sourceSlides": [1, 2]
    }
  ],
  "slideSummaries": [
    {
      "slideNumber": 1,
      "title": "Slide title",
      "summary": "Slide summary",
      "keyPoints": ["Key point 1", "Key point 2", "Key point 3"]
    }
  ],
  "keyTerms": [
    {
      "term": "Term",
      "definition": "Short definition",
      "sourceSlides": [1]
    }
  ],
  "reviewQuestions": [
    "Review question 1 [Slide N]",
    "Review question 2 [Slide N]"
  ]
}

Requirements:
- ${options.includeOverall ? 'Include overallSummary' : 'overallSummary can be brief'}
- ${options.includePerSlide ? `Summarize all ${slides.length} slides` : 'slideSummaries: []'}
- ${options.includeKeyTerms ? 'Include 8-12 important keyTerms' : 'keyTerms: []'}
- ${options.includeQuestions ? 'Include 5 review questions' : 'reviewQuestions: []'}
- mainTopics: 3-5 grouped topics`;
}

function parseJsonResponse(text: string): SummaryResult {
  const jsonText = text.trim().replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '');
  return JSON.parse(jsonText) as SummaryResult;
}

async function callClaude(slides: SlideData[], options: SummaryOptions, apiKey: string): Promise<SummaryResult> {
  const client = new Anthropic({ apiKey });
  const startTime = Date.now();

  const message = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: buildPrompt(slides, options) }]
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  return {
    ...parseJsonResponse(content.text),
    totalSlides: slides.length,
    isDemo: false,
    processingTime: Date.now() - startTime
  };
}

async function callOpenAI(slides: SlideData[], options: SummaryOptions, apiKey: string): Promise<SummaryResult> {
  const client = new OpenAI({ apiKey });
  const startTime = Date.now();

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [{ role: 'user', content: buildPrompt(slides, options) }]
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error('Empty response from OpenAI');
  }

  return {
    ...parseJsonResponse(text),
    totalSlides: slides.length,
    isDemo: false,
    processingTime: Date.now() - startTime
  };
}

async function callGemini(slides: SlideData[], options: SummaryOptions, apiKey: string): Promise<SummaryResult> {
  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });
  const startTime = Date.now();

  const response = await model.generateContent(buildPrompt(slides, options));

  return {
    ...parseJsonResponse(response.response.text()),
    totalSlides: slides.length,
    isDemo: false,
    processingTime: Date.now() - startTime
  };
}

async function callAiProvider(
  slides: SlideData[],
  options: SummaryOptions,
  activeProvider: ActiveAiProvider
): Promise<SummaryResult> {
  switch (activeProvider.provider) {
    case 'openai':
      return callOpenAI(slides, options, activeProvider.apiKey);
    case 'gemini':
      return callGemini(slides, options, activeProvider.apiKey);
    case 'anthropic':
    default:
      return callClaude(slides, options, activeProvider.apiKey);
  }
}

function generateDemoFromSlides(slides: SlideData[], options: SummaryOptions): SummaryResult {
  const title = slides[0]?.title || 'Bai giang';
  const lectureTitle = title.split('\n')[0].substring(0, 80);

  const slideSummaries: SlideSummary[] = slides.map(slide => {
    const lines = (slide.content || slide.rawText)
      .split(/[.\n]/)
      .map(l => l.trim())
      .filter(l => l.length > 10);

    return {
      slideNumber: slide.slideNumber,
      title: slide.title || `Slide ${slide.slideNumber}`,
      summary: lines.slice(0, 2).join('. ') || `Noi dung slide ${slide.slideNumber}`,
      keyPoints: lines.slice(0, 3).map(l => l.substring(0, 150))
    };
  });

  const mainTopics: MainTopic[] = [];
  const chunkSize = Math.ceil(slides.length / 3);
  for (let i = 0; i < slides.length; i += chunkSize) {
    const chunk = slides.slice(i, i + chunkSize);
    mainTopics.push({
      title: chunk[0]?.title || `Chu de ${Math.floor(i / chunkSize) + 1}`,
      summary: `Noi dung tu [Slide ${chunk[0]?.slideNumber}] den [Slide ${chunk[chunk.length - 1]?.slideNumber}]: ${chunk.map(s => s.title).join(', ')}`,
      sourceSlides: chunk.map(s => s.slideNumber)
    });
  }

  const allWords = slides.flatMap(s => (s.content || s.rawText).split(/\s+/))
    .filter(w => w.length > 5)
    .slice(0, 10);

  const keyTerms: KeyTerm[] = allWords.slice(0, 5).map((word, i) => ({
    term: word.replace(/[^a-zA-ZÀ-ỹ\s]/g, '').trim(),
    definition: `Khai niem quan trong xuat hien trong bai giang [Slide ${Math.min(i + 1, slides.length)}]`,
    sourceSlides: [Math.min(i + 1, slides.length)]
  })).filter(t => t.term.length > 2);

  return {
    lectureTitle,
    totalSlides: slides.length,
    overallSummary: `Bai giang "${lectureTitle}" gom ${slides.length} slide, trinh bay ve ${slides.map(s => s.title).slice(0, 3).join(', ')} va nhieu chu de khac [Slide 1-${slides.length}]. Day la ban tom tat demo duoc tao tu dong tu noi dung slide thuc te.`,
    mainTopics,
    slideSummaries: options.includePerSlide ? slideSummaries : [],
    keyTerms: options.includeKeyTerms ? keyTerms : [],
    reviewQuestions: options.includeQuestions ? [
      `Trinh bay noi dung chinh cua ${lectureTitle}?`,
      `Cac khai niem quan trong duoc de cap trong bai giang la gi? [Slide 1]`,
      `Moi lien he giua cac chu de trong bai giang nay la gi?`,
      `Ung dung thuc te cua kien thuc trong bai giang nay?`,
      `Tom tat nhung diem can nho nhat sau bai hoc nay [Slide ${slides.length}]`
    ] : [],
    isDemo: true,
    processingTime: 500
  };
}

export async function summarizeSlides(
  slides: SlideData[],
  options: SummaryOptions,
  isDemo: boolean
): Promise<SummaryResult> {
  const startTime = Date.now();

  if (isDemo && slides.length === 0) {
    return { ...demoSummary, processingTime: Date.now() - startTime };
  }

  const activeProvider = getActiveAiProvider();

  if (!isDemo && activeProvider) {
    try {
      return await callAiProvider(slides, options, activeProvider);
    } catch (error) {
      console.error(`${activeProvider.provider} API error, falling back to demo generation:`, error);
      const result = generateDemoFromSlides(slides, options);
      return { ...result, processingTime: Date.now() - startTime };
    }
  }

  if (slides.length > 0) {
    const result = generateDemoFromSlides(slides, options);
    return { ...result, processingTime: Date.now() - startTime };
  }

  return { ...demoSummary, processingTime: Date.now() - startTime };
}
