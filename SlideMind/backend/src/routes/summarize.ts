import { Router, Request, Response } from 'express';
import { summarizeSlides } from '../services/summarizer';
import { SummarizeRequest } from '../types';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as SummarizeRequest;

    if (!body) {
      res.status(400).json({
        success: false,
        error: 'Dữ liệu request không hợp lệ'
      });
      return;
    }

    const { slides = [], options, isDemo = false } = body;

    if (!options) {
      res.status(400).json({
        success: false,
        error: 'Thiếu thông tin tùy chỉnh (options)'
      });
      return;
    }

    // Validate options
    const validLengths = ['short', 'medium', 'detailed'];
    const validLanguages = ['vi', 'en'];

    if (!validLengths.includes(options.length)) {
      options.length = 'medium';
    }
    if (!validLanguages.includes(options.language)) {
      options.language = 'vi';
    }

    const result = await summarizeSlides(slides, options, isDemo);

    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Summarize error:', error);
    const message = error instanceof Error ? error.message : 'Lỗi không xác định';
    res.status(500).json({
      success: false,
      error: `Lỗi tạo tóm tắt: ${message}`
    });
  }
});

export default router;
