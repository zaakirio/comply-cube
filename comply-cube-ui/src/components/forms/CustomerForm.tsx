// src/components/forms/CustomerForm.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from './FormField';
import { StatusAlert } from '../status/StatusAlert';
import { CustomerInfo } from '@/types/customer';
import { VerificationState } from '@/types/verification';
import { Loader2 } from 'lucide-react';

const initialFormState: CustomerInfo = {
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
};

export const CustomerForm: React.FC = () => {
  const [formData, setFormData] = useState<CustomerInfo>(initialFormState);
  const [verificationState, setVerificationState] = useState<VerificationState>({
    status: 'idle',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationState({ status: 'pending' });

    try {
      const response = await fetch('http://localhost:3001/api/verification/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
    
      const data = await response.json();
    
      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }
    
      setVerificationState({
        status: 'completed',
        clientId: data.clientId,
        checkId: data.checkId,
        message: 'Verification process started successfully',
      });
    
      // Simpler ComplyCube initialization
      if ((window as any).ComplyCube) {
        const complyCube = new (window as any).ComplyCube({
          token: import.meta.env.VITE_COMPLYCUBE_CLIENT_TOKEN,
          clientId: data.clientId,
        });
    
        complyCube.open();
      }
    
    } catch (error) {
      setVerificationState({
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Identity Verification</CardTitle>
        <CardDescription>
          Please provide your information for verification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
          <FormField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <FormField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            required
          />

          <Button 
            type="submit" 
            className="w-full"
            disabled={verificationState.status === 'pending'}
          >
            {verificationState.status === 'pending' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              'Start Verification'
            )}
          </Button>
        </form>

        <StatusAlert 
          status={verificationState.status}
          message={verificationState.message}
        />
      </CardContent>
    </Card>
  );
};