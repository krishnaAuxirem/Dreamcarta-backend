import express from 'express';
import firebaseAuthMiddleware from '../middleware/firebaseAuthMiddleware.js';
import {
  checkInHabit,
  createHabit,
  deleteHabit,
  getHabits,
  updateHabit,
} from '../controllers/habitsController.js';

const router = express.Router();

router.get('/', firebaseAuthMiddleware, getHabits);
router.post('/', firebaseAuthMiddleware, createHabit);
router.put('/:id', firebaseAuthMiddleware, updateHabit);
router.delete('/:id', firebaseAuthMiddleware, deleteHabit);
router.post('/:id/check-in', firebaseAuthMiddleware, checkInHabit);

export default router;
