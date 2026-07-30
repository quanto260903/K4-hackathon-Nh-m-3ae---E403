import React, { useCallback, useState, useRef } from 'react';
import { formatFileSize } from '../utils/formatters';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  error: string | null;
}

const MAX_SIZE = 20 * 1024 * 1024;
const ALLOWED_TYPES = ['.pdf', '.pptx'];
const ALLOWED_MIME = ['application/pdf', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileSelect, selectedFile, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_TYPES.includes(ext) && !ALLOWED_MIME.includes(file.type)) {
      return 'Chỉ hỗ trợ file PDF và PPTX';
    }
    if (file.size > MAX_SIZE) {
      return `File quá lớn. Tối đa 20MB (file của bạn: ${formatFileSize(file.size)})`;
    }
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const err = validateFile(file);
    if (!err) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const getFileExt = (name: string) => name.split('.').pop()?.toUpperCase() || '';

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${isDragging
            ? 'border-[#1e3a5f] bg-blue-50 scale-[1.01]'
            : selectedFile
              ? error
                ? 'border-red-400 bg-red-50'
                : 'border-green-400 bg-green-50'
              : 'border-gray-300 hover:border-[#1e3a5f] hover:bg-blue-50'
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.pptx"
          className="hidden"
          onChange={handleInputChange}
        />

        {selectedFile && !error ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
              <span className="text-lg font-bold text-green-700">{getFileExt(selectedFile.name)}</span>
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{selectedFile.name}</p>
              <p className="text-gray-500 text-xs mt-0.5">{formatFileSize(selectedFile.size)}</p>
            </div>
            <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              File hợp lệ
            </div>
            <p className="text-xs text-gray-400">Nhấn để chọn file khác</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isDragging ? 'bg-blue-200' : 'bg-gray-100'}`}>
              <svg className={`w-7 h-7 ${isDragging ? 'text-[#1e3a5f]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-700">
                {isDragging ? 'Thả file vào đây' : 'Kéo thả file vào đây'}
              </p>
              <p className="text-gray-500 text-sm mt-0.5">hoặc nhấp để chọn file</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">PDF</span>
              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">PPTX</span>
              <span className="text-gray-400 text-xs">• Tối đa 20MB</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default FileDropzone;
