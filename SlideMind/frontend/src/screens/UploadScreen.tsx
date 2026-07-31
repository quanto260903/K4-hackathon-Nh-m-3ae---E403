import React, { useState, useCallback } from 'react';
import FileDropzone from '../components/FileDropzone';

interface UploadScreenProps {
  onFileSelected: (file: File) => void;
  onDemoSelected: () => void;
  onStartChat: (file: File | null, isDemo: boolean) => void;
  hasApiKey: boolean | null;
}

const MAX_SIZE = 20 * 1024 * 1024;
const ALLOWED_TYPES = ['.pdf', '.pptx'];

const UploadScreen: React.FC<UploadScreenProps> = ({ onFileSelected, onDemoSelected, onStartChat, hasApiKey }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [mode, setMode] = useState<'summary' | 'chat'>('summary');

  const validateAndSetFile = useCallback((file: File) => {
    setIsDemoActive(false);
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_TYPES.includes(ext)) {
      setFileError('Chỉ hỗ trợ file PDF và PPTX');
      setSelectedFile(file);
      return;
    }
    if (file.size > MAX_SIZE) {
      setFileError(`File quá lớn. Tối đa 20MB`);
      setSelectedFile(file);
      return;
    }
    setFileError(null);
    setSelectedFile(file);
  }, []);

  const handleDemoClick = () => {
    setSelectedFile(null);
    setFileError(null);
    setIsDemoActive(true);
  };

  const handleContinue = () => {
    if (mode === 'chat') {
      onStartChat(isDemoActive ? null : selectedFile, isDemoActive);
      return;
    }
    if (isDemoActive) {
      onDemoSelected();
    } else if (selectedFile && !fileError) {
      onFileSelected(selectedFile);
    }
  };

  const canContinue =
    (isDemoActive || (selectedFile !== null && fileError === null)) &&
    !(mode === 'chat' && hasApiKey === false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f] via-[#243b53] to-[#102a43] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-10 rounded-2xl mb-4 backdrop-blur-sm">
            <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            SlideMind <span className="text-[#22c55e]">AI</span>
          </h1>
          <p className="mt-2 text-blue-200 text-lg font-medium">Đọc slide, nắm bài nhanh</p>
          <p className="mt-1 text-blue-300 text-sm">Tải lên slide bài giảng để nhận tóm tắt thông minh bằng AI</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          {/* Mode toggle */}
          <div className="flex p-1 bg-gray-100 rounded-xl mb-5">
            <button
              onClick={() => setMode('summary')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                mode === 'summary' ? 'bg-white text-[#1e3a5f] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Tóm tắt tự động
            </button>
            <button
              onClick={() => hasApiKey !== false && setMode('chat')}
              disabled={hasApiKey === false}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                hasApiKey === false
                  ? 'text-gray-300 cursor-not-allowed'
                  : mode === 'chat'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              💬 Trò chuyện với AI Agent
            </button>
          </div>
          {mode === 'chat' && hasApiKey === false && (
            <p className="text-orange-600 text-xs mb-4 -mt-3 bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
              Cần cấu hình API key (ANTHROPIC_API_KEY / OPENAI_API_KEY / GEMINI_API_KEY) trong <code>backend/.env</code> để dùng tính năng Chat AI Agent.
            </p>
          )}

          <h2 className="text-lg font-semibold text-gray-800 mb-4">Chọn file bài giảng</h2>

          <FileDropzone
            onFileSelect={validateAndSetFile}
            selectedFile={selectedFile}
            error={fileError}
          />

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-sm">hoặc</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Demo button */}
          <button
            onClick={handleDemoClick}
            className={`
              w-full py-3 px-4 rounded-xl border-2 font-medium text-sm transition-all duration-200
              ${isDemoActive
                ? 'border-[#1e3a5f] bg-[#1e3a5f] text-white'
                : 'border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white'
              }
            `}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {isDemoActive ? 'Bài giảng mẫu đã được chọn' : 'Dùng bài giảng mẫu'}
            </span>
          </button>

          {isDemoActive && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-blue-800 text-xs font-medium">Bài giảng: Nhập môn Trí tuệ Nhân tạo</p>
                  <p className="text-blue-600 text-xs mt-0.5">9 slides • Tiếng Việt • Dữ liệu demo</p>
                </div>
              </div>
            </div>
          )}

          {/* Continue button */}
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`
              mt-4 w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200
              ${canContinue
                ? 'bg-[#22c55e] hover:bg-green-600 text-white shadow-lg shadow-green-200 hover:shadow-green-300 hover:scale-[1.01]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <span className="flex items-center justify-center gap-2">
              {mode === 'chat' ? 'Bắt đầu trò chuyện' : 'Tiếp tục'}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-blue-300 text-xs mt-6">
          File được xử lý cục bộ. API key không bao giờ được gửi về frontend.
        </p>
      </div>
    </div>
  );
};

export default UploadScreen;
