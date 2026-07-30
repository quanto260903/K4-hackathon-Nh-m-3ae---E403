export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatProcessingTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function getLengthLabel(length: string): string {
  switch (length) {
    case 'short': return 'Ngắn gọn';
    case 'detailed': return 'Chi tiết';
    default: return 'Vừa đủ';
  }
}

export function getLanguageLabel(lang: string): string {
  return lang === 'vi' ? 'Tiếng Việt' : 'English';
}
