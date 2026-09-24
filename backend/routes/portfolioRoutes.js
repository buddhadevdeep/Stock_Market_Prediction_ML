import express from 'express';
import {
  getUserPortfolio,
  addStockToPortfolio,
  deleteStockFromPortfolio,
} from '../controllers/portfolioController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getUserPortfolio)
  .post(addStockToPortfolio);

router.route('/:id')
  .delete(deleteStockFromPortfolio);

export default router;
