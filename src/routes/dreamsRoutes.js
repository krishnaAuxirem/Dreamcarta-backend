import express from 'express';
import firebaseAuthMiddleware from '../middleware/firebaseAuthMiddleware.js';
import { getDreams, toggleDreamMilestone } from '../controllers/dreamsController.js';

const router = express.Router();

router.get('/', firebaseAuthMiddleware, getDreams);
router.post('/:dreamId/milestones/:milestoneId/toggle', firebaseAuthMiddleware, toggleDreamMilestone);

export default router;
