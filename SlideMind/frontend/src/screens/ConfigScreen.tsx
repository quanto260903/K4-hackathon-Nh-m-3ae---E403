import React from 'react';
import { SummaryOptions } from '../types';

interface ConfigScreenProps {
  options: SummaryOptions;
  isDemo: boolean;
  filename: string;
  onOptionsChange: (options: SummaryOptions) => void;
  onBack: () => void;
  onStart: () => void;
}

const ConfigScreen: React.FC<ConfigScreenProps> = ({
  options,
  isDemo,
  filename,
  onOptionsChange,
  onBack,
  onStart
}) => {
  const update = (partial: Partial<SummaryOptions>) => {
    onOptionsChange({ ...options, ...partial });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#1e3a5f]">Tùy chỉnh tóm tắt</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isDemo ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400 inline-block"></span>
                Bài giảng mẫu: Nhập môn Trí tuệ Nhân tạo
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                {filename}
              </span>
            )}
          </p>
        </div>

        <div className="space-y-5">
          {/* Length */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#1e3a5f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
              Độ dài tóm tắt
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {(['short', 'medium', 'detailed'] as const).map((len) => {
                const labels = { short: 'Ngắn gọn', medium: 'Vừa đủ', detailed: 'Chi tiết' };
                const desc = { short: '1-2 câu/phần', medium: '2-3 câu/phần', detailed: '4-6 câu/phần' };
                return (
                  <button
                    key={len}
                    onClick={() => update({ length: len })}
                    className={`
                      p-3 rounded-lg border-2 text-center transition-all
                      ${options.length === len
                        ? 'border-[#1e3a5f] bg-[#1e3a5f] text-white'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }
                    `}
                  >
                    <div className="font-medium text-sm">{labels[len]}</div>
                    <div className={`text-xs mt-0.5 ${options.length === len ? 'text-blue-200' : 'text-gray-400'}`}>
                      {desc[len]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#1e3a5f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              Ngôn ngữ đầu ra
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(['vi', 'en'] as const).map((lang) => {
                const labels = { vi: '🇻🇳 Tiếng Việt', en: '🇺🇸 English' };
                return (
                  <button
                    key={lang}
                    onClick={() => update({ language: lang })}
                    className={`
                      p-3 rounded-lg border-2 font-medium text-sm transition-all
                      ${options.language === lang
                        ? 'border-[#1e3a5f] bg-[#1e3a5f] text-white'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }
                    `}
                  >
                    {labels[lang]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content options */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#1e3a5f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Nội dung cần tạo
            </h3>
            <div className="space-y-3">
              {[
                { key: 'includeOverall' as const, label: 'Tóm tắt toàn bài', desc: 'Tổng quan nội dung bài giảng' },
                { key: 'includePerSlide' as const, label: 'Tóm tắt từng slide', desc: 'Chi tiết từng trang trình bày' },
                { key: 'includeKeyTerms' as const, label: 'Từ khóa quan trọng', desc: 'Các thuật ngữ và định nghĩa' },
                { key: 'includeQuestions' as const, label: 'Câu hỏi ôn tập', desc: 'Câu hỏi để kiểm tra kiến thức' },
              ].map(({ key, label, desc }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={options[key]}
                      onChange={(e) => update({ [key]: e.target.checked })}
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      options[key] ? 'bg-[#22c55e] border-[#22c55e]' : 'border-gray-300 group-hover:border-gray-400'
                    }`}>
                      {options[key] && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-gray-800 text-sm">{label}</span>
                    <span className="text-gray-400 text-xs block">{desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onBack}
            className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-700 font-medium text-sm hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Quay lại
          </button>
          <button
            onClick={onStart}
            className="flex-[2] py-3 px-4 rounded-xl bg-[#1e3a5f] hover:bg-[#243b53] text-white font-semibold text-sm transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 flex items-center justify-center gap-2"
          >
            Bắt đầu tóm tắt
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigScreen;
