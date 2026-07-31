import { Router, Request, Response } from 'express';
import { getActiveAiProvider } from '../services/summarizer';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const activeProvider = getActiveAiProvider();

  res.json({
    status: 'ok',
    hasApiKey: !!activeProvider,
    provider: activeProvider?.provider || 'demo',
    requestedProvider: process.env.AI_PROVIDER || 'auto',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    message: activeProvider
      ? `SlideMind AI dang chay voi ${activeProvider.provider} API`
      : 'SlideMind AI dang chay o che do demo'
  });
});

export default router;
