import { SummaryResult } from '../types';

export function generateMarkdown(result: SummaryResult): string {
  const lines: string[] = [];

  lines.push(`# ${result.lectureTitle}`);
  lines.push('');
  lines.push(`> **Tổng số slide:** ${result.totalSlides} | **Trạng thái:** ${result.isDemo ? 'Bản Demo' : 'AI Generated'}`);
  if (result.processingTime) {
    lines.push(`> **Thời gian xử lý:** ${(result.processingTime / 1000).toFixed(1)}s`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  if (result.overallSummary) {
    lines.push('## Tóm tắt toàn bài');
    lines.push('');
    lines.push(result.overallSummary);
    lines.push('');
  }

  if (result.mainTopics.length > 0) {
    lines.push('## Chủ đề chính');
    lines.push('');
    result.mainTopics.forEach((topic, i) => {
      lines.push(`### ${i + 1}. ${topic.title}`);
      lines.push('');
      lines.push(topic.summary);
      lines.push('');
      lines.push(`*Nguồn: ${topic.sourceSlides.map(n => `[Slide ${n}]`).join(', ')}*`);
      lines.push('');
    });
  }

  if (result.slideSummaries.length > 0) {
    lines.push('## Tóm tắt từng slide');
    lines.push('');
    result.slideSummaries.forEach(slide => {
      lines.push(`### Slide ${slide.slideNumber}: ${slide.title}`);
      lines.push('');
      lines.push(slide.summary);
      lines.push('');
      if (slide.keyPoints.length > 0) {
        lines.push('**Điểm chính:**');
        slide.keyPoints.forEach(pt => {
          lines.push(`- ${pt}`);
        });
      }
      lines.push('');
    });
  }

  if (result.keyTerms.length > 0) {
    lines.push('## Từ khóa quan trọng');
    lines.push('');
    result.keyTerms.forEach(term => {
      lines.push(`**${term.term}**`);
      lines.push(`> ${term.definition}`);
      lines.push(`*Xuất hiện trong: ${term.sourceSlides.map(n => `Slide ${n}`).join(', ')}*`);
      lines.push('');
    });
  }

  if (result.reviewQuestions.length > 0) {
    lines.push('## Câu hỏi ôn tập');
    lines.push('');
    result.reviewQuestions.forEach((q, i) => {
      lines.push(`${i + 1}. ${q}`);
    });
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('*Được tạo bởi [SlideMind AI](https://github.com/slidemind)*');

  return lines.join('\n');
}

export function downloadMarkdown(result: SummaryResult): void {
  const markdown = generateMarkdown(result);
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeName = result.lectureTitle
    .replace(/[^a-zA-Z0-9À-ỹ\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
  a.download = `${safeName}-tom-tat.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function copyMarkdown(result: SummaryResult): Promise<void> {
  const markdown = generateMarkdown(result);
  await navigator.clipboard.writeText(markdown);
}
