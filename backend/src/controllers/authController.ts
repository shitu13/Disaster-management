import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import { signJwt } from '../utils/jwt';

// Volunteer registration
export const register = async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new volunteer (unapproved by default)
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'volunteer',
      isApproved: false, // Needs admin approval
    });

    await newUser.save();

    // Send JWT
    const token = signJwt({ id: newUser._id, role: newUser.role });
    res.status(201).json({ token, message: 'Registration successful. Awaiting admin approval.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error. Try again later.' });
  }
};

// Login (for both Admins and Volunteers)
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

    // Check if volunteer is approved
    if (user.role === 'volunteer' && !user.isApproved) {
      return res.status(403).json({ message: 'Your account is awaiting admin approval.' });
    }

    // Generate JWT
    const token = signJwt({ id: user._id, role: user.role });

    res.status(200).json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
