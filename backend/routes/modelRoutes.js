import express from 'express';
import { trainModel, getModelResults } from '../controllers/modelController.js';

const router = express.Router();

router.post('/train', trainModel);
router.get('/results', getModelResults);

export default router;
