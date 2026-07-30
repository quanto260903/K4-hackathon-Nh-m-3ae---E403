import axios from 'axios';
import { SlideData, SummaryOptions, SummaryResult } from '../types';
import { demoSummary, demoSlides } from '../data/demoData';

const API_BASE = import.meta.env.VITE_API_URL || '';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 60000
});

export interface ExtractResult {
  success: boolean;
  filename: string;
  fileSize: number;
  slides: SlideData[];
  totalSlides: number;
  isDemo: boolean;
  warning?: string;
}

export async function extractSlides(file: File): Promise<ExtractResult> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post<ExtractResult>('/api/extract', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const msg = error.response?.data?.error || error.message;
      throw new Error(msg);
    }
    throw error;
  }
}

export interface SummarizeResult {
  success: boolean;
  result: SummaryResult;
}

export async function summarizeSlides(
  slides: SlideData[],
  options: SummaryOptions,
  isDemo: boolean
): Promise<SummaryResult> {
  // If demo mode with no backend, return demo data directly
  if (isDemo && slides.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { ...demoSummary };
  }

  try {
    const response = await apiClient.post<SummarizeResult>('/api/summarize', {
      slides,
      options,
      isDemo
    });
    return response.data.result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const msg = error.response?.data?.error || error.message;
      throw new Error(msg);
    }
    throw error;
  }
}

export async function checkHealth(): Promise<{ hasApiKey: boolean; status: string }> {
  try {
    const response = await apiClient.get('/api/health');
    return response.data;
  } catch {
    return { hasApiKey: false, status: 'offline' };
  }
}

// Demo mode: simulate extraction with demo slides
export async function getDemoSlides(): Promise<ExtractResult> {
  await new Promise(resolve => setTimeout(resolve, 600));
  return {
    success: true,
    filename: 'nhap-mon-ai.pptx',
    fileSize: 0,
    slides: demoSlides,
    totalSlides: demoSlides.length,
    isDemo: true
  };
}
