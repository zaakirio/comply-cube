import { CustomerInfo } from '@/types/customer';
import { VerificationResponse } from '@/types/verification';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || 'Invalid input');
  }
  return response.json();
};

export const verifyCustomer = async (customerData: CustomerInfo): Promise<VerificationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clients`, {
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
    const response = await fetch(`${API_BASE_URL}/api/checks/${checkId}`, {
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

export const getSdkToken = async (clientId: string): Promise<{ token: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/web-sdk-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clientId })

    });

    return handleResponse<{ token: string }>(response);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to get SDK token');
  }
};

export const createIdentityCheck = async (data: {
  clientId: string;
  documentId: string;
  livePhotoId: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/api/checks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Failed to create identity check');
  }

  return response.json();
};

export const getCheckStatus = async (checkId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/checks/${checkId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get check status');
  }

  return response.json();
};