import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { VerificationStatus } from '@/types/verification';

interface StatusAlertProps {
  status: VerificationStatus;
  message?: string;
}

export const StatusAlert: React.FC<StatusAlertProps> = ({ status, message }) => {
  if (status === 'idle') return null;

  const alertConfig = {
    pending: {
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
      title: 'Processing',
      description: 'Your verification is being processed...',
    },
    completed: {
      icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
      title: 'Success',
      description: message || 'Verification completed successfully',
    },
    failed: {
      icon: <AlertCircle className="h-4 w-4 text-red-600" />,
      title: 'Error',
      description: message || 'Verification failed',
    },
  }[status];

  if (!alertConfig) return null;

  return (
    <Alert className="mt-4">
      <AlertTitle className="flex items-center gap-2">
        {alertConfig.icon}
        {alertConfig.title}
      </AlertTitle>
      <AlertDescription>
        {alertConfig.description}
      </AlertDescription>
    </Alert>
  );
};