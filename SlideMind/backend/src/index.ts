import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import extractRouter from './routes/extract';
import summarizeRouter from './routes/summarize';
import healthRouter from './routes/health';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Routes
app.use('/api/extract', extractRouter);
app.use('/api/summarize', summarizeRouter);
app.use('/api/health', healthRouter);

// Root
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

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Lỗi server nội bộ. Vui lòng thử lại.'
  });
});

app.listen(PORT, () => {
  const hasApiKey = !!(process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.trim().length > 0);
  console.log(`SlideMind AI Backend đang chạy tại http://localhost:${PORT}`);
  console.log(`Chế độ: ${hasApiKey ? 'Claude AI (với API key)' : 'Demo (không có API key)'}`);
});

export default app;
