import Anthropic from '@anthropic-ai/sdk';
import { SlideData, SummaryOptions, SummaryResult, SlideSummary, MainTopic, KeyTerm } from '../types';
import { demoSummary } from '../data/demoData';

const hasApiKey = (): boolean => {
  return !!(process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.trim().length > 0);
};

function buildLengthInstruction(length: string): string {
  switch (length) {
    case 'short': return 'ngắn gọn (1-2 câu mỗi phần)';
    case 'detailed': return 'chi tiết (4-6 câu mỗi phần, giải thích sâu)';
    default: return 'vừa đủ (2-3 câu mỗi phần)';
  }
}

async function callClaude(slides: SlideData[], options: SummaryOptions): Promise<SummaryResult> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!
  });

  const slidesText = slides.map(s =>
    `--- SLIDE ${s.slideNumber}: ${s.title} ---\n${s.content || s.rawText}`
  ).join('\n\n');

  const langInstruction = options.language === 'en'
    ? 'Respond in English.'
    : 'Trả lời hoàn toàn bằng tiếng Việt.';

  const lengthInstruction = buildLengthInstruction(options.length);

  const prompt = `Bạn là trợ lý học tập AI chuyên tóm tắt bài giảng. Hãy phân tích các slide bài giảng sau và tạo bản tóm tắt có cấu trúc.

${langInstruction}
Độ dài tóm tắt: ${lengthInstruction}
Chỉ sử dụng thông tin có trong slide, trích dẫn [Slide N] khi đề cập nội dung cụ thể. KHÔNG bịa thêm thông tin.

NỘI DUNG SLIDE:
${slidesText}

Trả về JSON hợp lệ (KHÔNG có markdown code blocks) theo cấu trúc sau:
{
  "lectureTitle": "Tiêu đề bài giảng",
  "totalSlides": ${slides.length},
  "overallSummary": "Tóm tắt toàn bài 3-4 đoạn với [Slide N] citations",
  "mainTopics": [
    {
      "title": "Chủ đề chính",
      "summary": "Mô tả chủ đề với [Slide N] citations",
      "sourceSlides": [1, 2]
    }
  ],
  "slideSummaries": [
    {
      "slideNumber": 1,
      "title": "Tiêu đề slide",
      "summary": "Tóm tắt nội dung slide",
      "keyPoints": ["Điểm chính 1", "Điểm chính 2", "Điểm chính 3"]
    }
  ],
  "keyTerms": [
    {
      "term": "Thuật ngữ",
      "definition": "Định nghĩa ngắn gọn",
      "sourceSlides": [1]
    }
  ],
  "reviewQuestions": [
    "Câu hỏi ôn tập 1 [Slide N]",
    "Câu hỏi ôn tập 2 [Slide N]"
  ]
}

Yêu cầu:
- ${options.includeOverall ? 'Bao gồm overallSummary' : 'overallSummary có thể ngắn'}
- ${options.includePerSlide ? `Tóm tắt TẤT CẢ ${slides.length} slides` : 'slideSummaries: []'}
- ${options.includeKeyTerms ? 'Bao gồm 8-12 keyTerms quan trọng' : 'keyTerms: []'}
- ${options.includeQuestions ? 'Bao gồm 5 câu hỏi ôn tập' : 'reviewQuestions: []'}
- mainTopics: 3-5 chủ đề nhóm các slide liên quan`;

  const startTime = Date.now();

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  const processingTime = Date.now() - startTime;

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  // Parse JSON from response
  let jsonText = content.text.trim();
  // Remove markdown code blocks if present
  jsonText = jsonText.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '');

  const parsed = JSON.parse(jsonText);

  return {
    ...parsed,
    totalSlides: slides.length,
    isDemo: false,
    processingTime
  };
}

function generateDemoFromSlides(slides: SlideData[], options: SummaryOptions): SummaryResult {
  const title = slides[0]?.title || 'Bài giảng';
  const lectureTitle = title.split('\n')[0].substring(0, 80);

  const slideSummaries: SlideSummary[] = slides.map(slide => {
    const lines = (slide.content || slide.rawText)
      .split(/[.\n]/)
      .map(l => l.trim())
      .filter(l => l.length > 10);

    return {
      slideNumber: slide.slideNumber,
      title: slide.title || `Slide ${slide.slideNumber}`,
      summary: lines.slice(0, 2).join('. ') || `Nội dung slide ${slide.slideNumber}`,
      keyPoints: lines.slice(0, 3).map(l => l.substring(0, 150))
    };
  });

  const mainTopics: MainTopic[] = [];
  const chunkSize = Math.ceil(slides.length / 3);
  for (let i = 0; i < slides.length; i += chunkSize) {
    const chunk = slides.slice(i, i + chunkSize);
    mainTopics.push({
      title: chunk[0]?.title || `Chủ đề ${Math.floor(i / chunkSize) + 1}`,
      summary: `Nội dung từ [Slide ${chunk[0]?.slideNumber}] đến [Slide ${chunk[chunk.length - 1]?.slideNumber}]: ${chunk.map(s => s.title).join(', ')}`,
      sourceSlides: chunk.map(s => s.slideNumber)
    });
  }

  const allWords = slides.flatMap(s => (s.content || s.rawText).split(/\s+/))
    .filter(w => w.length > 5)
    .slice(0, 10);

  const keyTerms: KeyTerm[] = allWords.slice(0, 5).map((word, i) => ({
    term: word.replace(/[^a-zA-ZÀ-ỹ\s]/g, '').trim(),
    definition: `Khái niệm quan trọng xuất hiện trong bài giảng [Slide ${Math.min(i + 1, slides.length)}]`,
    sourceSlides: [Math.min(i + 1, slides.length)]
  })).filter(t => t.term.length > 2);

  return {
    lectureTitle,
    totalSlides: slides.length,
    overallSummary: `Bài giảng "${lectureTitle}" gồm ${slides.length} slide, trình bày về ${slides.map(s => s.title).slice(0, 3).join(', ')} và nhiều chủ đề khác [Slide 1-${slides.length}]. Đây là bản tóm tắt demo được tạo tự động từ nội dung slide thực tế.`,
    mainTopics,
    slideSummaries: options.includePerSlide ? slideSummaries : [],
    keyTerms: options.includeKeyTerms ? keyTerms : [],
    reviewQuestions: options.includeQuestions ? [
      `Trình bày nội dung chính của ${lectureTitle}?`,
      `Các khái niệm quan trọng được đề cập trong bài giảng là gì? [Slide 1]`,
      `Mối liên hệ giữa các chủ đề trong bài giảng này là gì?`,
      `Ứng dụng thực tế của kiến thức trong bài giảng này?`,
      `Tóm tắt những điểm cần nhớ nhất sau bài học này [Slide ${slides.length}]`
    ] : [],
    isDemo: true,
    processingTime: 500
  };
}

export async function summarizeSlides(
  slides: SlideData[],
  options: SummaryOptions,
  isDemo: boolean
): Promise<SummaryResult> {
  const startTime = Date.now();

  // Return pre-built demo data if demo mode and no slides provided
  if (isDemo && slides.length === 0) {
    return { ...demoSummary, processingTime: Date.now() - startTime };
  }

  // Use Claude API if available and not demo mode
  if (!isDemo && hasApiKey()) {
    try {
      const result = await callClaude(slides, options);
      return result;
    } catch (error) {
      console.error('Claude API error, falling back to demo generation:', error);
      // Fallback to demo generation with actual slide content
      const result = generateDemoFromSlides(slides, options);
      return { ...result, processingTime: Date.now() - startTime };
    }
  }

  // Demo mode with actual slides
  if (slides.length > 0) {
    const result = generateDemoFromSlides(slides, options);
    return { ...result, processingTime: Date.now() - startTime };
  }

  // Pure demo mode
  return { ...demoSummary, processingTime: Date.now() - startTime };
}
