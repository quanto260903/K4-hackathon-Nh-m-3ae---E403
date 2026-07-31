import React, { useEffect, useState } from 'react';
import StepProgress from './components/StepProgress';
import UploadScreen from './screens/UploadScreen';
import ConfigScreen from './screens/ConfigScreen';
import ProcessingScreen from './screens/ProcessingScreen';
import ResultsScreen from './screens/ResultsScreen';
import ChatScreen from './screens/ChatScreen';
import { AppState, defaultSummaryOptions, SlideData, SummaryResult } from './types';
import { checkHealth, extractSlides, getDemoSlides } from './utils/api';
import { demoSummary } from './data/demoData';

const initialState: AppState = {
  currentStep: 1,
  uploadedFile: null,
  isDemo: false,
  extractedSlides: null,
  summaryOptions: defaultSummaryOptions,
  summaryResult: null,
  chatMode: false,
  chatSlides: null,
  chatFilename: '',
  hasApiKey: null
};

function App() {
  const [state, setState] = useState<AppState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [extractWarning, setExtractWarning] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    checkHealth().then(h => update({ hasApiKey: h.hasApiKey }));
  }, []);

  const update = (partial: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...partial }));
  };

  // Screen 1 → 2: File selected
  const handleFileSelected = (file: File) => {
    update({
      uploadedFile: file,
      isDemo: false,
      currentStep: 2
    });
  };

  // Screen 1 → 2: Demo selected
  const handleDemoSelected = () => {
    update({
      uploadedFile: null,
      isDemo: true,
      currentStep: 2
    });
  };

  // Screen 2 → 1: Back
  const handleConfigBack = () => {
    update({ currentStep: 1 });
  };

  // Screen 2 → 3: Start processing
  const handleStartProcessing = () => {
    setError(null);
    update({ currentStep: 3 });
  };

  // Screen 3 → 4: Processing complete
  const handleProcessingComplete = (slides: SlideData[], result: SummaryResult, warning?: string) => {
    setExtractWarning(warning || null);
    update({
      extractedSlides: slides,
      summaryResult: result,
      currentStep: 4
    });
  };

  // Screen 3: Error
  const handleProcessingError = (errorMsg: string) => {
    setError(errorMsg);
    update({ currentStep: 2 });
  };

  // Screen 4 → 2: Re-summarize
  const handleReSummarize = () => {
    update({ currentStep: 2, summaryResult: null });
  };

  // Screen 4 → 1: Upload new
  const handleUploadNew = () => {
    setState(initialState);
    setError(null);
    setExtractWarning(null);
  };

  // Upload → Chat mode
  const handleStartChat = async (file: File | null, isDemo: boolean) => {
    setError(null);
    setChatLoading(true);
    try {
      if (isDemo) {
        const result = await getDemoSlides();
        update({ chatSlides: result.slides, chatFilename: demoSummary.lectureTitle, chatMode: true });
      } else if (file) {
        const result = await extractSlides(file);
        update({ chatSlides: result.slides, chatFilename: result.filename.replace(/\.(pdf|pptx)$/i, ''), chatMode: true });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi không xác định';
      setError(`Không thể tải slide: ${msg}`);
    } finally {
      setChatLoading(false);
    }
  };

  // Chat mode → Upload
  const handleExitChat = () => {
    setState(prev => ({ ...initialState, hasApiKey: prev.hasApiKey }));
    setError(null);
  };

  if (state.chatMode && state.chatSlides) {
    return (
      <ChatScreen
        slides={state.chatSlides}
        lectureTitle={state.chatFilename || 'Bài giảng'}
        hasApiKey={!!state.hasApiKey}
        onBack={handleExitChat}
      />
    );
  }

  return (
    <div className="font-sans">
      {chatLoading && (
        <div className="fixed inset-0 z-50 bg-[#102a43] bg-opacity-90 flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-white border-t-transparent animate-spin" />
          <p className="text-white text-sm">Đang tải slide cho phiên trò chuyện...</p>
        </div>
      )}

      {/* Show step progress bar on steps 2, 3, 4 */}
      {state.currentStep > 1 && (
        <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
          <StepProgress currentStep={state.currentStep} />
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="fixed top-16 left-0 right-0 z-50 flex justify-center px-4">
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 max-w-lg w-full flex items-start gap-3 shadow-lg">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-red-700 text-sm font-medium">Có lỗi xảy ra</p>
              <p className="text-red-600 text-xs mt-0.5">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Screen 1: Upload */}
      {state.currentStep === 1 && (
        <UploadScreen
          onFileSelected={handleFileSelected}
          onDemoSelected={handleDemoSelected}
          onStartChat={handleStartChat}
          hasApiKey={state.hasApiKey}
        />
      )}

      {/* Screen 2: Configure */}
      {state.currentStep === 2 && (
        <ConfigScreen
          options={state.summaryOptions}
          isDemo={state.isDemo}
          filename={state.uploadedFile?.name || ''}
          onOptionsChange={(options) => update({ summaryOptions: options })}
          onBack={handleConfigBack}
          onStart={handleStartProcessing}
        />
      )}

      {/* Screen 3: Processing */}
      {state.currentStep === 3 && (
        <ProcessingScreen
          file={state.uploadedFile}
          isDemo={state.isDemo}
          options={state.summaryOptions}
          onComplete={handleProcessingComplete}
          onError={handleProcessingError}
        />
      )}

      {/* Screen 4: Results */}
      {state.currentStep === 4 && state.summaryResult && (
        <ResultsScreen
          result={state.summaryResult}
          extractWarning={extractWarning}
          onReSummarize={handleReSummarize}
          onUploadNew={handleUploadNew}
        />
      )}
    </div>
  );
}

export default App;
