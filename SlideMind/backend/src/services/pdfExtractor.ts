import { SlideData } from '../types';

export async function extractPDF(buffer: Buffer, filename: string): Promise<SlideData[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(buffer);

    const totalPages = data.numpages || 1;
    const fullText: string = data.text || '';

    // Try to split by page breaks or create even distribution
    const slides: SlideData[] = [];

    if (totalPages <= 1) {
      // Single page or can't detect pages
      const lines = fullText.split('\n').filter((l: string) => l.trim().length > 0);
      const title = lines[0]?.trim() || filename.replace(/\.[^/.]+$/, '');
      const content = lines.slice(1).join('\n').trim();

      slides.push({
        slideNumber: 1,
        title: title.substring(0, 100),
        content: content.substring(0, 2000),
        rawText: fullText.substring(0, 3000)
      });
    } else {
      // Split text across pages (pdf-parse doesn't give per-page text easily)
      // We try to split by page count evenly
      const charsPerPage = Math.floor(fullText.length / totalPages);

      for (let i = 0; i < totalPages; i++) {
        const start = i * charsPerPage;
        const end = i === totalPages - 1 ? fullText.length : (i + 1) * charsPerPage;
        const pageText = fullText.substring(start, end).trim();

        const lines = pageText.split('\n').filter((l: string) => l.trim().length > 0);
        const title = lines[0]?.trim() || `Slide ${i + 1}`;
        const content = lines.slice(1).join('\n').trim();

        if (pageText.length > 10) {
          slides.push({
            slideNumber: i + 1,
            title: title.substring(0, 100),
            content: content.substring(0, 2000),
            rawText: pageText.substring(0, 3000)
          });
        }
      }
    }

    if (slides.length === 0) {
      // Fallback: treat all text as single slide
      slides.push({
        slideNumber: 1,
        title: filename.replace(/\.[^/.]+$/, ''),
        content: fullText.substring(0, 2000),
        rawText: fullText.substring(0, 3000)
      });
    }

    return slides;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Không thể đọc file PDF. Vui lòng kiểm tra file có bị hỏng không.');
  }
}
