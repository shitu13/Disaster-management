import { Request, Response } from 'express';
import User from '../models/User';

// Get all pending volunteers (isApproved: false)
export const getPendingVolunteers = async (req: Request, res: Response) => {
  try {
    const pendingVolunteers = await User.find({ role: 'volunteer', isApproved: false });
    res.status(200).json(pendingVolunteers);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving pending volunteers' });
  }
};

// Approve a volunteer
export const approveVolunteer = async (req: Request, res: Response) => {
  const { volunteerId } = req.params;

  try {
    const volunteer = await User.findById(volunteerId);

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    volunteer.isApproved = true;  // Approve the volunteer
    await volunteer.save();

    res.status(200).json({ message: 'Volunteer approved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error approving volunteer' });
  }
};

// Delete a volunteer
export const deleteVolunteer = async (req: Request, res: Response) => {
  const { volunteerId } = req.params;

  try {
    const volunteer = await User.findByIdAndDelete(volunteerId);

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.status(200).json({ message: 'Volunteer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting volunteer' });
  }
};