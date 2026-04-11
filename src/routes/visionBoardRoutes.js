import express from 'express';
import firebaseAuthMiddleware from '../middleware/firebaseAuthMiddleware.js';
import {
  createVisionItem,
  deleteVisionItem,
  getVisionItems,
  updateVisionItem,
} from '../controllers/visionBoardController.js';

const router = express.Router();

router.get('/items', firebaseAuthMiddleware, getVisionItems);
router.post('/items', firebaseAuthMiddleware, createVisionItem);
router.put('/items/:id', firebaseAuthMiddleware, updateVisionItem);
router.delete('/items/:id', firebaseAuthMiddleware, deleteVisionItem);

export default router;
