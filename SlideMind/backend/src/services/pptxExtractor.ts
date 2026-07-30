import JSZip from 'jszip';
import { SlideData } from '../types';

function decodeXmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)));
}

function extractTextFromXml(xml: string): string {
  // Remove XML tags and extract text content
  const withoutTags = xml.replace(/<[^>]+>/g, ' ');
  const decoded = decodeXmlEntities(withoutTags);
  // Clean up multiple spaces/newlines
  return decoded.replace(/\s+/g, ' ').trim();
}

function extractTitleFromXml(xml: string): string {
  // Try to find title placeholder (ph type="title" or ph type="ctrTitle")
  const titleMatch = xml.match(/<p:sp[^>]*>(?:[^<]|<(?!\/p:sp))*?<p:ph[^>]*type="(?:title|ctrTitle)"[^>]*\/>(?:[^<]|<(?!\/p:sp))*?<\/p:sp>/s);
  if (titleMatch) {
    return extractTextFromXml(titleMatch[0]).substring(0, 100);
  }

  // Fallback: first text run
  const firstTextMatch = xml.match(/<a:t>([^<]+)<\/a:t>/);
  if (firstTextMatch) {
    return firstTextMatch[1].trim().substring(0, 100);
  }

  return '';
}

export async function extractPPTX(buffer: Buffer, filename: string): Promise<SlideData[]> {
  try {
    const zip = await JSZip.loadAsync(buffer);
    const slides: SlideData[] = [];

    // Get all slide files
    const slideFiles: string[] = [];
    zip.forEach((relativePath) => {
      if (relativePath.match(/^ppt\/slides\/slide\d+\.xml$/)) {
        slideFiles.push(relativePath);
      }
    });

    if (slideFiles.length === 0) {
      throw new Error('Không tìm thấy slide trong file PPTX');
    }

    // Sort slides by number
    slideFiles.sort((a, b) => {
      const numA = parseInt(a.match(/slide(\d+)\.xml$/)?.[1] || '0');
      const numB = parseInt(b.match(/slide(\d+)\.xml$/)?.[1] || '0');
      return numA - numB;
    });

    for (let i = 0; i < slideFiles.length; i++) {
      const slidePath = slideFiles[i];
      const slideFile = zip.file(slidePath);
      if (!slideFile) continue;

      const xml = await slideFile.async('text');
      const rawText = extractTextFromXml(xml);
      const title = extractTitleFromXml(xml) || `Slide ${i + 1}`;

      // Get all text content excluding title
      const allTexts: string[] = [];
      const textMatches = xml.matchAll(/<a:t>([^<]*)<\/a:t>/g);
      for (const match of textMatches) {
        const text = match[1].trim();
        if (text.length > 0) {
          allTexts.push(text);
        }
      }

      const content = allTexts.join(' ').substring(0, 2000);

      slides.push({
        slideNumber: i + 1,
        title: title,
        content: content,
        rawText: rawText.substring(0, 3000)
      });
    }

    return slides;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Không tìm thấy slide')) {
      throw error;
    }
    console.error('PPTX extraction error:', error);
    throw new Error('Không thể đọc file PPTX. Vui lòng kiểm tra file có bị hỏng không.');
  }
}
