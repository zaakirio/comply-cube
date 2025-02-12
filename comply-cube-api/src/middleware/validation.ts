import { Request, Response, NextFunction } from 'express';
import { CustomerInfo } from '../types';

export const validateCustomerInfo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const info: CustomerInfo = req.body;
  
  if (!info.firstName || !info.lastName || !info.dateOfBirth || !info.email) {
    return res.status(400).json({
      error: 'Missing required fields',
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(info.email)) {
    return res.status(400).json({
      error: 'Invalid email format',
    });
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(info.dateOfBirth)) {
    return res.status(400).json({
      error: 'Invalid date format. Use YYYY-MM-DD',
    });
  }

  next();
};