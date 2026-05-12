import express from 'express';
import firebaseAuthMiddleware from '../middleware/firebaseAuthMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import { deleteContact, getContacts } from '../controllers/contactController.js';

const router = express.Router();

router.get('/', firebaseAuthMiddleware, adminMiddleware, getContacts);
router.delete('/:id', firebaseAuthMiddleware, adminMiddleware, deleteContact);

export default router;