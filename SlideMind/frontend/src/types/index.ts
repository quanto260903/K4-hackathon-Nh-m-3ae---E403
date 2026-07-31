export interface SlideData {
  slideNumber: number;
  title: string;
  content: string;
  rawText: string;
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

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface AppState {
  currentStep: 1 | 2 | 3 | 4;
  uploadedFile: File | null;
  isDemo: boolean;
  extractedSlides: SlideData[] | null;
  summaryOptions: SummaryOptions;
  summaryResult: SummaryResult | null;
  chatMode: boolean;
  chatSlides: SlideData[] | null;
  chatFilename: string;
  hasApiKey: boolean | null;
}

export const defaultSummaryOptions: SummaryOptions = {
  length: 'medium',
  language: 'vi',
  includeOverall: true,
  includePerSlide: true,
  includeKeyTerms: true,
  includeQuestions: true
};
