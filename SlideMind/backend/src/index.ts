import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import extractRouter from './routes/extract';
import summarizeRouter from './routes/summarize';
import healthRouter from './routes/health';
import { getActiveAiProvider } from './services/summarizer';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

app.use('/api/extract', extractRouter);
app.use('/api/summarize', summarizeRouter);
app.use('/api/health', healthRouter);

app.get('/', (_req, res) => {
  res.json({
    name: 'SlideMind AI Backend',
    version: '1.0.0',
    endpoints: [
      'POST /api/extract',
      'POST /api/summarize',
      'GET /api/health'
    ]
  });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Loi server noi bo. Vui long thu lai.'
  });
});

app.listen(PORT, () => {
  const activeProvider = getActiveAiProvider();
  console.log(`SlideMind AI Backend dang chay tai http://localhost:${PORT}`);
  console.log(`Che do: ${activeProvider ? `${activeProvider.provider} AI (voi API key)` : 'Demo (khong co API key)'}`);
});

export default app;
