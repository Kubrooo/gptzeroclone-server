import express from 'express';
import { detectText } from '../controllers/detectionController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, detectText)

export default router;