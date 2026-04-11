import express from 'express';
import firebaseAuthMiddleware from '../middleware/firebaseAuthMiddleware.js';
import {
  createGoal,
  deleteGoal,
  getGoalById,
  getGoals,
  updateGoal,
} from '../controllers/goalsController.js';

const router = express.Router();

router.get('/', firebaseAuthMiddleware, getGoals);
router.get('/:id', firebaseAuthMiddleware, getGoalById);
router.post('/', firebaseAuthMiddleware, createGoal);
router.put('/:id', firebaseAuthMiddleware, updateGoal);
router.delete('/:id', firebaseAuthMiddleware, deleteGoal);

export default router;
