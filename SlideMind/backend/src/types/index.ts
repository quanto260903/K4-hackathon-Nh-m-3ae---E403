export interface SlideData {
  slideNumber: number;
  title: string;
  content: string;
  rawText: string;
}

export interface ExtractResult {
  success: boolean;
  filename: string;
  fileSize: number;
  slides: SlideData[];
  totalSlides: number;
  isDemo: boolean;
}

export interface SummaryOptions {
  length: 'short' | 'medium' | 'detailed';
  language: 'vi' | 'en';
  includeOverall: boolean;
  includePerSlide: boolean;
  includeKeyTerms: boolean;
  includeQuestions: boolean;
}

export interface MainTopic {
  title: string;
  summary: string;
  sourceSlides: number[];
}

export interface SlideSummary {
  slideNumber: number;
  title: string;
  summary: string;
  keyPoints: string[];
}

export interface KeyTerm {
  term: string;
  definition: string;
  sourceSlides: number[];
}

export interface SummaryResult {
  lectureTitle: string;
  totalSlides: number;
  overallSummary: string;
  mainTopics: MainTopic[];
  slideSummaries: SlideSummary[];
  keyTerms: KeyTerm[];
  reviewQuestions: string[];
  isDemo: boolean;
  processingTime?: number;
}

export interface SummarizeRequest {
  slides: SlideData[];
  options: SummaryOptions;
  isDemo: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  slides: SlideData[];
  history: ChatMessage[];
  question: string;
}
