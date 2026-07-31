import { Router, Request, Response } from 'express';
import { answerSlideQuestion } from '../services/chatAssistant';
import { getActiveAiProvider } from '../services/summarizer';
import { ChatRequest } from '../types';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as ChatRequest;
    const { slides = [], history = [], question } = body || {};

    if (!question || !question.trim()) {
      res.status(400).json({
        success: false,
        error: 'Vui lòng nhập câu hỏi'
      });
      return;
    }

    const activeProvider = getActiveAiProvider();

    if (!activeProvider) {
      res.status(503).json({
        success: false,
        error: 'Cần cấu hình ANTHROPIC_API_KEY / OPENAI_API_KEY / GEMINI_API_KEY trong backend/.env để dùng tính năng Chat AI.'
      });
      return;
    }

    const answer = await answerSlideQuestion(slides, history, question.trim(), activeProvider);

    res.json({
      success: true,
      answer
    });
  } catch (error) {
    console.error('Chat error:', error);
    const message = error instanceof Error ? error.message : 'Lỗi không xác định';
    res.status(500).json({
      success: false,
      error: `Lỗi trò chuyện với AI: ${message}`
    });
  }
});

export default router;
