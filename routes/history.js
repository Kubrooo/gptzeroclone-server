import express from 'express';
import { getHistory, deleteDetection } from '../controllers/historyController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getHistory);
router.delete('/:id', authMiddleware, deleteDetection);

export default router;