import express from 'express';
import { getPendingVolunteers, approveVolunteer, deleteVolunteer } from '../controllers/volunteerController';
import { authenticate, isAdmin } from '../middlewares/authMiddleware';  // Ensure admin access is verified

const router = express.Router();

// Get list of pending volunteers (Admin only)
router.get('/pending', authenticate, isAdmin, getPendingVolunteers);

// Approve a volunteer (Admin only)
router.patch('/approve/:volunteerId', authenticate, isAdmin, approveVolunteer);

// Delete a volunteer (Admin only)
router.delete('/:volunteerId', authenticate, isAdmin, deleteVolunteer);

export default router;