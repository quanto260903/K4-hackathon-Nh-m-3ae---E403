import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { extractPDF } from '../services/pdfExtractor';
import { extractPPTX } from '../services/pptxExtractor';
import { demoSlides } from '../data/demoData';
import { hasGarbledText, GARBLED_TEXT_WARNING } from '../services/textQuality';

const router = Router();

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = ['.pdf', '.pptx'];
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ hỗ trợ file PDF và PPTX'));
    }
  }
});

router.post('/', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'Vui lòng chọn file PDF hoặc PPTX để tải lên'
      });
      return;
    }

    const file = req.file;
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = file.originalname;
    const fileSize = file.size;

    let slides;

    try {
      if (ext === '.pdf') {
        slides = await extractPDF(file.buffer, filename);
      } else if (ext === '.pptx') {
        slides = await extractPPTX(file.buffer, filename);
      } else {
        res.status(400).json({
          success: false,
          error: 'Định dạng file không được hỗ trợ. Vui lòng dùng PDF hoặc PPTX.'
        });
        return;
      }

      res.json({
        success: true,
        filename,
        fileSize,
        slides,
        totalSlides: slides.length,
        isDemo: false,
        warning: hasGarbledText(slides) ? GARBLED_TEXT_WARNING : undefined
      });
    } catch (extractError) {
      console.error('Extraction failed, returning demo:', extractError);
      // Fallback to demo data
      res.json({
        success: true,
        filename,
        fileSize,
        slides: demoSlides,
        totalSlides: demoSlides.length,
        isDemo: true,
        warning: 'Không thể đọc nội dung file, đang dùng dữ liệu demo'
      });
    }
  } catch (error) {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({
          success: false,
          error: 'File quá lớn. Kích thước tối đa là 20MB.'
        });
        return;
      }
    }

    const message = error instanceof Error ? error.message : 'Lỗi không xác định';
    res.status(500).json({
      success: false,
      error: `Lỗi xử lý file: ${message}`
    });
  }
});

export default router;
