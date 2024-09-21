import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';


export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  const decoded = verifyJwt(token);
  if (!decoded) return res.status(401).json({ message: 'Invalid token' });

  // Use `any` to bypass TypeScript strict type checking
  (req as any).user = decoded;  // Bypass type checking here
  next();
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  authenticate(req, res, () => {
    if ((req as any).user?.role === 'admin') {
    return next();
  }
    return res.status(403).json({ message: 'Access denied: Admins only' });
  });
};
