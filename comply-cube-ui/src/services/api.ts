// src/services/api.ts
import { CustomerInfo } from '@/types/customer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

interface VerificationResponse {
  clientId: string;
  checkId: string;
  status: string;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  const data = await response.json();
  return data;
};

export const verifyCustomer = async (customerData: CustomerInfo): Promise<VerificationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/verification/onboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    return handleResponse<VerificationResponse>(response);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to start verification');
  }
};

export const checkVerificationStatus = async (checkId: string): Promise<VerificationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/verification/status/${checkId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return handleResponse<VerificationResponse>(response);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to check verification status');
  }
};