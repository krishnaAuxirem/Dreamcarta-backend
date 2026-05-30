import express from 'express';
import firebaseAuthMiddleware from '../middleware/firebaseAuthMiddleware.js';
import {
  getDreamPlans,
  createDreamPlan,
  updateDreamPlanStatus,
  deleteDreamPlan,
} from '../controllers/dreamPlanController.js';

const router = express.Router();

router.get('/', firebaseAuthMiddleware, getDreamPlans);
router.post('/', firebaseAuthMiddleware, createDreamPlan);
router.patch('/:id/status', firebaseAuthMiddleware, updateDreamPlanStatus);
router.delete('/:id', firebaseAuthMiddleware, deleteDreamPlan);

export default router;
