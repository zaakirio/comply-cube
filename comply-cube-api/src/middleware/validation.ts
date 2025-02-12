import { Request, Response, NextFunction } from 'express';
import { CustomerInfo } from '../types';

export const validateCustomerInfo = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const info: CustomerInfo = req.body;
  
  if (!info.firstName || !info.lastName || !info.dateOfBirth || !info.email) {
    res.status(400).json({
      error: 'Missing required fields',
    });
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(info.email)) {
    res.status(400).json({
      error: 'Invalid email format',
    });
    return;
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(info.dateOfBirth)) {
    res.status(400).json({
      error: 'Invalid date format. Use YYYY-MM-DD',
    });
    return;
  }

  next();
};