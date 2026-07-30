import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const hasApiKey = !!(process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.trim().length > 0);

  res.json({
    status: 'ok',
    hasApiKey,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    message: hasApiKey
      ? 'SlideMind AI đang chạy với Claude API'
      : 'SlideMind AI đang chạy ở chế độ demo'
  });
});

export default router;
