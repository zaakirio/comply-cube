import { useState } from 'react';
import { CustomerInfo } from '@/types/customer';
import { VerificationState } from '@/types/verification';
import { checkVerificationStatus, verifyCustomer } from '@/services/api';
/* eslint-disable  @typescript-eslint/no-explicit-any */
export const useVerification = () => {
  const [verificationState, setVerificationState] = useState<VerificationState>({
    status: 'idle',
  });

  const startVerification = async (customerData: CustomerInfo) => {
    try {
      setVerificationState({ status: 'pending' });
      
      const response = await verifyCustomer(customerData);
      
      setVerificationState({
        status: 'completed',
        clientId: response.clientId,
        checkId: response.checkId,
        message: 'Verification process started successfully',
      });

      if ((window as any).ComplyCube) {
        const complyCube = new (window as any).ComplyCube({
          token: import.meta.env.VITE_COMPLYCUBE_CLIENT_TOKEN,
          clientId: response.clientId,
        });

        complyCube.open();
      }

      return response;
    } catch (error) {
      setVerificationState({
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      throw error;
    }
  };

  const verifyStatus = async (checkId: string) => {
    try {
      setVerificationState({ status: 'pending' });
      
      const status = await checkVerificationStatus(checkId);
      
      setVerificationState({
        status: 'completed',
        checkId,
        message: 'Verification status retrieved successfully',
      });

      return status;
    } catch (error) {
      setVerificationState({
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      throw error;
    }
  };

  return {
    verificationState,
    startVerification,
    verifyStatus,
  };
};