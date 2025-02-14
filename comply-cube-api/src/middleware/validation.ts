import { Request, Response, NextFunction } from 'express';
import { CustomerInfo } from '../types';

interface ValidationError {
  field: string;
  message: string;
}

interface CustomerInfoRequest extends Request {
  body: CustomerInfo;
}

interface SdkTokenRequest extends Request {
  body: {
    clientId: string;
  };
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;

  const parsedDate = new Date(date);
  const today = new Date();
  return parsedDate.toString() !== 'Invalid Date' && parsedDate <= today;
};

const validateName = (name: string): boolean => {
  const nameRegex = /^[A-Za-zÁãáÉéÍíÓóÚúÑñÜü\s'-]+$/; 
  return nameRegex.test(name);
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
  } else {
    const { personDetails } = info;

    if (!personDetails.firstName) {
      errors.push({ field: 'firstName', message: 'First name is required' });
    } else if (!validateName(personDetails.firstName)) {
      errors.push({ field: 'firstName', message: 'First name should contain only letters' });
    }

    if (!personDetails.lastName) {
      errors.push({ field: 'lastName', message: 'Last name is required' });
    } else if (!validateName(personDetails.lastName)) {
      errors.push({ field: 'lastName', message: 'Last name should contain only letters' });
    }

    if (!personDetails.dob) {
      errors.push({ field: 'dob', message: 'Date of birth is required' });
    } else if (!validateDate(personDetails.dob)) {
      errors.push({ field: 'dob', message: 'Invalid date format or future date is not allowed' });
    }
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
};

export const validateSdkTokenRequest = (
  req: SdkTokenRequest,
  res: Response,
  next: NextFunction
): void => {
  const errors: ValidationError[] = [];
  const { clientId } = req.body;

  if (!clientId) {
    errors.push({ field: 'clientId', message: 'Client ID is required' });
  } else if (typeof clientId !== 'string' || clientId.trim().length === 0) {
    errors.push({ field: 'clientId', message: 'Invalid Client ID format' });
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
};
