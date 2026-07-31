import React, { useState } from 'react';
import { SummaryResult } from '../types';
import CollapsibleCard from '../components/CollapsibleCard';
import { downloadMarkdown, copyMarkdown } from '../utils/exportMarkdown';
import { formatProcessingTime } from '../utils/formatters';

interface ResultsScreenProps {
  result: SummaryResult;
  extractWarning?: string | null;
  onReSummarize: () => void;
  onUploadNew: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ result, extractWarning, onReSummarize, onUploadNew }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [activeSection, setActiveSection] = useState<string>('overall');
  const [warningDismissed, setWarningDismissed] = useState(false);

  const handleCopy = async () => {
    try {
      await copyMarkdown(result);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  const handleDownload = () => {
    downloadMarkdown(result);
  };

  const sections = [
    { id: 'overall', label: 'Tổng quan', show: !!result.overallSummary },
    { id: 'topics', label: 'Chủ đề', show: result.mainTopics.length > 0 },
    { id: 'slides', label: 'Từng slide', show: result.slideSummaries.length > 0 },
    { id: 'terms', label: 'Từ khóa', show: result.keyTerms.length > 0 },
    { id: 'questions', label: 'Câu hỏi', show: result.reviewQuestions.length > 0 },
  ].filter(s => s.show);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1e3a5f] text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {result.isDemo && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-500 text-white">
                    DEMO
                  </span>
                )}
                <span className="text-blue-300 text-xs">
                  {result.totalSlides} slides phân tích
                  {result.processingTime && ` • ${formatProcessingTime(result.processingTime)}`}
                </span>
              </div>
              <h1 className="text-xl font-bold leading-tight">{result.lectureTitle}</h1>
            </div>
            {/* Action buttons top */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={handleCopy}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  copyStatus === 'copied'
                    ? 'bg-green-500 text-white'
                    : 'bg-white bg-opacity-10 hover:bg-opacity-20 text-white'
                }`}
              >
                {copyStatus === 'copied' ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Đã sao chép
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Sao chép
                  </>
                )}
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-lg bg-[#22c55e] hover:bg-green-600 text-white text-xs font-medium transition-all flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Tải .md
              </button>
            </div>
          </div>

          {/* Section nav */}
          {sections.length > 1 && (
            <div className="mt-4 flex gap-1 overflow-x-auto pb-1">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSection(s.id);
                    document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    activeSection === s.id
                      ? 'bg-white text-[#1e3a5f]'
                      : 'text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* Extraction quality warning */}
        {extractWarning && !warningDismissed && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <p className="text-amber-800 text-sm font-medium">Có thể lỗi phông chữ khi đọc file</p>
              <p className="text-amber-700 text-xs mt-0.5">{extractWarning}</p>
            </div>
            <button onClick={() => setWarningDismissed(true)} className="text-amber-400 hover:text-amber-600 flex-shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Overall Summary */}
        {result.overallSummary && (
          <section id="section-overall">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-[#1e3a5f] rounded-full" />
              <h2 className="text-lg font-bold text-gray-800">Tóm tắt toàn bài</h2>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{result.overallSummary}</p>
            </div>
          </section>
        )}

        {/* Main Topics */}
        {result.mainTopics.length > 0 && (
          <section id="section-topics">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-[#f97316] rounded-full" />
              <h2 className="text-lg font-bold text-gray-800">Chủ đề chính</h2>
              <span className="text-xs text-gray-400 font-normal">({result.mainTopics.length} chủ đề)</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {result.mainTopics.map((topic, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-orange-200 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-800 text-sm">{topic.title}</h3>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {topic.sourceSlides.map(n => (
                        <span key={n} className="px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded text-xs font-medium">
                          S{n}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed">{topic.summary}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Per Slide Summaries */}
        {result.slideSummaries.length > 0 && (
          <section id="section-slides">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-blue-500 rounded-full" />
              <h2 className="text-lg font-bold text-gray-800">Tóm tắt từng slide</h2>
              <span className="text-xs text-gray-400 font-normal">({result.slideSummaries.length} slides)</span>
            </div>
            <div className="space-y-2">
              {result.slideSummaries.map((slide) => (
                <CollapsibleCard
                  key={slide.slideNumber}
                  defaultOpen={slide.slideNumber === 1}
                  badge={
                    <span className="w-7 h-7 rounded-lg bg-[#1e3a5f] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {slide.slideNumber}
                    </span>
                  }
                  title={slide.title}
                >
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">{slide.summary}</p>
                  {slide.keyPoints.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Điểm chính</p>
                      <ul className="space-y-1.5">
                        {slide.keyPoints.map((point, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#22c55e] flex-shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CollapsibleCard>
              ))}
            </div>
          </section>
        )}

        {/* Key Terms */}
        {result.keyTerms.length > 0 && (
          <section id="section-terms">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-purple-500 rounded-full" />
              <h2 className="text-lg font-bold text-gray-800">Từ khóa quan trọng</h2>
              <span className="text-xs text-gray-400 font-normal">({result.keyTerms.length} thuật ngữ)</span>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50">
              {result.keyTerms.map((term, i) => (
                <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <span className="font-semibold text-[#1e3a5f] text-sm">{term.term}</span>
                      <p className="text-gray-600 text-xs mt-1 leading-relaxed">{term.definition}</p>
                    </div>
                    <div className="flex gap-1 flex-wrap justify-end flex-shrink-0">
                      {term.sourceSlides.map(n => (
                        <span key={n} className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded text-xs">
                          S{n}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Review Questions */}
        {result.reviewQuestions.length > 0 && (
          <section id="section-questions">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-[#22c55e] rounded-full" />
              <h2 className="text-lg font-bold text-gray-800">Câu hỏi ôn tập</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <ol className="space-y-4">
                {result.reviewQuestions.map((q, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#22c55e] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed">{q}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* Bottom actions */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Hành động tiếp theo</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-gray-200 hover:border-[#1e3a5f] hover:bg-blue-50 transition-all group"
            >
              <svg className="w-5 h-5 text-gray-500 group-hover:text-[#1e3a5f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-medium text-gray-600 group-hover:text-[#1e3a5f]">
                {copyStatus === 'copied' ? 'Đã sao chép!' : 'Sao chép Markdown'}
              </span>
            </button>

            <button
              onClick={handleDownload}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-gray-200 hover:border-[#22c55e] hover:bg-green-50 transition-all group"
            >
              <svg className="w-5 h-5 text-gray-500 group-hover:text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs font-medium text-gray-600 group-hover:text-[#22c55e]">Tải Markdown</span>
            </button>

            <button
              onClick={onReSummarize}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-gray-200 hover:border-[#f97316] hover:bg-orange-50 transition-all group"
            >
              <svg className="w-5 h-5 text-gray-500 group-hover:text-[#f97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-xs font-medium text-gray-600 group-hover:text-[#f97316]">Tóm tắt lại</span>
            </button>

            <button
              onClick={onUploadNew}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-gray-200 hover:border-[#1e3a5f] hover:bg-blue-50 transition-all group"
            >
              <svg className="w-5 h-5 text-gray-500 group-hover:text-[#1e3a5f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-xs font-medium text-gray-600 group-hover:text-[#1e3a5f]">Tải bài khác</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-xs pb-4">
          SlideMind AI — Đọc slide, nắm bài nhanh
          {result.isDemo && ' • Bản demo'}
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
