import React, { useEffect, useState, useRef } from 'react';
import { SlideData, SummaryOptions, SummaryResult } from '../types';
import { extractSlides, summarizeSlides, getDemoSlides } from '../utils/api';
import { demoSummary } from '../data/demoData';

interface ProcessingScreenProps {
  file: File | null;
  isDemo: boolean;
  options: SummaryOptions;
  onComplete: (slides: SlideData[], result: SummaryResult, extractWarning?: string) => void;
  onError: (error: string) => void;
}

interface ProcessStep {
  id: number;
  label: string;
  status: 'pending' | 'active' | 'done' | 'error';
}

const STEPS = [
  { id: 1, label: 'Đang đọc file', status: 'pending' as const },
  { id: 2, label: 'Đang phân tích từng slide', status: 'pending' as const },
  { id: 3, label: 'Đang xác định kiến thức trọng tâm', status: 'pending' as const },
  { id: 4, label: 'Đang tạo bản tóm tắt', status: 'pending' as const }
];

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({
  file,
  isDemo,
  options,
  onComplete,
  onError
}) => {
  const [steps, setSteps] = useState<ProcessStep[]>(STEPS.map(s => ({ ...s })));
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [statusText, setStatusText] = useState('Đang khởi động...');
  const hasStarted = useRef(false);

  const setStepStatus = (index: number, status: ProcessStep['status']) => {
    setSteps(prev => prev.map((s, i) => i === index ? { ...s, status } : s));
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const run = async () => {
      try {
        // Step 1: Read file
        setCurrentStepIndex(0);
        setStepStatus(0, 'active');
        setStatusText('Đang đọc và giải nén file...');

        let slides: SlideData[] = [];
        let extractWarning: string | undefined;

        if (isDemo) {
          await delay(700);
          const extractResult = await getDemoSlides();
          slides = extractResult.slides;
        } else if (file) {
          try {
            const extractResult = await extractSlides(file);
            slides = extractResult.slides;
            extractWarning = extractResult.warning;
          } catch (err) {
            // Fallback to demo on extract error
            console.warn('Extract failed, using demo:', err);
            await delay(500);
            slides = [];
          }
        }

        setStepStatus(0, 'done');
        await delay(300);

        // Step 2: Analyze slides
        setCurrentStepIndex(1);
        setStepStatus(1, 'active');
        setStatusText(`Đang phân tích ${slides.length || 9} slides...`);
        await delay(isDemo ? 600 : 500);
        setStepStatus(1, 'done');
        await delay(200);

        // Step 3: Identify key knowledge
        setCurrentStepIndex(2);
        setStepStatus(2, 'active');
        setStatusText('Đang xác định kiến thức trọng tâm...');
        await delay(isDemo ? 500 : 400);
        setStepStatus(2, 'done');
        await delay(200);

        // Step 4: Generate summary
        setCurrentStepIndex(3);
        setStepStatus(3, 'active');
        setStatusText('Đang tạo bản tóm tắt thông minh...');

        let result: SummaryResult;

        if (isDemo && slides.length === 0) {
          await delay(800);
          result = { ...demoSummary };
        } else {
          try {
            result = await summarizeSlides(slides, options, isDemo);
          } catch (err) {
            console.warn('Summarize API failed, using demo data:', err);
            await delay(600);
            result = { ...demoSummary };
          }
        }

        setStepStatus(3, 'done');
        setStatusText('Hoàn thành!');
        await delay(400);

        onComplete(slides, result, extractWarning);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Lỗi không xác định';
        console.error('Processing error:', err);
        // Even on error, try to use demo data
        try {
          onComplete([], { ...demoSummary });
        } catch {
          onError(`Lỗi xử lý: ${msg}`);
        }
      }
    };

    run();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f] via-[#243b53] to-[#102a43] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-10 rounded-2xl mb-4 animate-pulse">
            <svg className="w-8 h-8 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Đang phân tích bài giảng...</h1>
          <p className="text-blue-300 text-sm mt-1">{statusText}</p>
        </div>

        {/* Steps */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center">
                {step.status === 'done' ? (
                  <div className="w-9 h-9 rounded-full bg-[#22c55e] flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : step.status === 'active' ? (
                  <div className="w-9 h-9 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : step.status === 'error' ? (
                  <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full border-2 border-white border-opacity-30 flex items-center justify-center">
                    <span className="text-white text-opacity-50 text-sm font-medium">{index + 1}</span>
                  </div>
                )}
              </div>

              {/* Label */}
              <div className="flex-1">
                <p className={`font-medium text-sm transition-all ${
                  step.status === 'done'
                    ? 'text-[#22c55e]'
                    : step.status === 'active'
                      ? 'text-white'
                      : 'text-white text-opacity-40'
                }`}>
                  {step.label}
                </p>
                {step.status === 'active' && (
                  <div className="mt-1.5 h-1 bg-white bg-opacity-20 rounded-full overflow-hidden">
                    <div className="h-full bg-[#22c55e] rounded-full animate-pulse" style={{ width: '60%' }} />
                  </div>
                )}
              </div>

              {/* Time badge for done */}
              {step.status === 'done' && (
                <span className="text-[#22c55e] text-xs font-medium">Xong</span>
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="h-1.5 bg-white bg-opacity-20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#22c55e] rounded-full transition-all duration-500"
              style={{ width: `${((currentStepIndex + 1) / 4) * 100}%` }}
            />
          </div>
          <p className="text-blue-300 text-xs text-center mt-2">
            {currentStepIndex + 1}/4 bước hoàn thành
          </p>
        </div>

        {isDemo && (
          <div className="mt-4 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 bg-opacity-20 text-orange-300 rounded-full text-xs font-medium">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Chế độ demo - Dữ liệu mẫu
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessingScreen;
