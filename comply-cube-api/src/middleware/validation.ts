import { Request, Response, NextFunction } from 'express';
import { CustomerInfo } from '../types';

interface ValidationError {
  field: string;
  message: string;
}

// Define proper request types
interface CustomerInfoRequest extends Request {
  body: CustomerInfo;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  const parsedDate = new Date(date);
  return parsedDate.toString() !== 'Invalid Date';
};

export const validateCustomerInfo = (
  req: CustomerInfoRequest,
  res: Response,
  next: NextFunction
): void => {
  const errors: ValidationError[] = [];
  const info = req.body;

  if (info.type !== 'person') {
    errors.push({ field: 'type', message: 'Type must be "person"' });
  }

  if (!info.email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(info.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  if (!info.mobile) {
    errors.push({ field: 'mobile', message: 'Mobile number is required' });
  }

  if (!info.personDetails) {
    errors.push({ field: 'personDetails', message: 'Person details are required' });
    return;
  }

  const { personDetails } = info;
  
  if (!personDetails.firstName) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  }
  
  if (!personDetails.lastName) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  }
  
  if (!personDetails.dob) {
    errors.push({ field: 'dob', message: 'Date of birth is required' });
  } else if (!validateDate(personDetails.dob)) {
    errors.push({ field: 'dob', message: 'Invalid date format. Use YYYY-MM-DD' });
  }

  if (!personDetails.nationality) {
    errors.push({ field: 'nationality', message: 'Nationality is required' });
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
};