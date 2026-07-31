import { SlideData } from '../types';

// Control chars, Private Use Area (common placeholder range for broken/subsetted
// font glyph mapping), and the Unicode replacement character all indicate the
// source PDF's font encoding (ToUnicode CMap) couldn't be resolved correctly -
// typical for slides exported with legacy Vietnamese fonts (VNI, TCVN3, VPS...).
const SUSPICIOUS_CHARS_REGEX = new RegExp(
  '[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F-\\u009F\\uE000-\\uF8FF\\uFFFD]',
  'g'
);

const GARBLED_RATIO_THRESHOLD = 0.02;
const MIN_SAMPLE_LENGTH = 20;

export function hasGarbledText(slides: SlideData[]): boolean {
  const sample = slides.map(s => s.rawText).join('').slice(0, 5000);
  const nonWhitespaceLength = sample.replace(/\s/g, '').length;

  if (nonWhitespaceLength < MIN_SAMPLE_LENGTH) return false;

  const suspiciousCount = (sample.match(SUSPICIOUS_CHARS_REGEX) || []).length;
  return suspiciousCount / nonWhitespaceLength > GARBLED_RATIO_THRESHOLD;
}

export const GARBLED_TEXT_WARNING =
  'Noi dung trich xuat co dau hieu loi phong chu (font khong chuan Unicode). ' +
  'Ban tom tat co the khong chinh xac - hay thu xuat lai file PDF tu ban goc, hoac dung file PPTX thay the.';
