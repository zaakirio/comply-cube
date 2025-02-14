import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { getSdkToken, createIdentityCheck, getCheckStatus } from '@/services/api';

interface VerificationFlowProps {
  clientId: string;
  onComplete?: (data: any) => void;
}

interface SDKInstance {
  updateSettings: (settings: { isModalOpen?: boolean; token?: string }) => void;
  unmount: () => void;
}

interface SDKResult {
  documentCapture?: {
    documentId: string;
  };
  faceCapture?: {
    livePhotoId: string;
  };
}

export const VerificationFlow: React.FC<VerificationFlowProps> = ({ 
  clientId,
  onComplete 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string>('');
  const [checkId, setCheckId] = useState<string | null>(null);
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);
  const sdkInstanceRef = useRef<SDKInstance | null>(null);

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'referrer';
    meta.content = 'strict-origin-when-cross-origin';
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.complycube.com/web-sdk/v1/complycube.min.js';
    script.async = true;
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://assets.complycube.com/web-sdk/v1/style.css';

    document.head.appendChild(script);
    document.head.appendChild(link);

    return () => {
      if (sdkInstanceRef.current) {
        sdkInstanceRef.current.unmount();
      }
      document.head.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const pollStatus = async () => {
      if (!checkId || isVerificationComplete) return;

      try {
        const result = await getCheckStatus(checkId);
        console.log('Check status:', result);

        const statusMessages = {
          pending: 'Processing your verification...',
          processing: 'Analyzing your documents...',
          complete: 'Verification completed successfully',
          failed: 'Verification failed'
        };

        const newStatus = statusMessages[result.status as keyof typeof statusMessages] || result.status;
        setVerificationStatus(newStatus);

        if (result.status === 'complete' || result.status === 'failed') {
          console.log('Reached final state, stopping polling');
          clearInterval(intervalId);
          setIsVerificationComplete(true);
          onComplete?.(result);
        }
      } catch (error) {
        console.error('Error polling status:', error);
        setError('Failed to get verification status');
        clearInterval(intervalId);
        setIsVerificationComplete(true);
      }
    };

    if (checkId && !isVerificationComplete) {
      pollStatus();
      intervalId = setInterval(pollStatus, 5000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [checkId, isVerificationComplete, onComplete]);

  const resetSDK = () => {
    if (sdkInstanceRef.current) {
      sdkInstanceRef.current.unmount();
      sdkInstanceRef.current = null;
    }

    const mountPoint = document.getElementById('complycube-mount');
    if (mountPoint) {
      mountPoint.innerHTML = '';
    }
  };

  const handleModalClose = () => {
    console.log('Modal close attempted');
    if (sdkInstanceRef.current) {
      sdkInstanceRef.current.updateSettings({ isModalOpen: false });
      resetSDK(); 
    }
  };

  const refreshToken = async () => {
    try {
      const response = await getSdkToken(clientId);
      if (sdkInstanceRef.current) {
        sdkInstanceRef.current.updateSettings({ token: response.token });
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      setError('Failed to refresh verification token');
      resetSDK();
    }
  };

  const handleVerificationComplete = async (data: SDKResult) => {
    try {
      setVerificationStatus('Processing verification...');

      if (!data.documentCapture?.documentId || !data.faceCapture?.livePhotoId) {
        throw new Error('Missing document ID or live photo ID from verification');
      }

      const check = await createIdentityCheck({
        clientId,
        documentId: data.documentCapture.documentId,
        livePhotoId: data.faceCapture.livePhotoId
      });

      setCheckId(check.checkId);
      setVerificationStatus('Starting verification checks...');
      resetSDK(); 
      
    } catch (error) {
      console.error('Error processing verification:', error);
      setError(error instanceof Error ? error.message : 'Failed to process verification');
      setVerificationStatus('Verification failed');
      resetSDK();
      setCheckId(null);
      setIsVerificationComplete(true);
    }
  };

  const startVerification = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setVerificationStatus('Starting verification...');
      setIsVerificationComplete(false);
      setCheckId(null);

      const response = await getSdkToken(clientId);
      
      if (typeof window.ComplyCube === 'undefined') {
        throw new Error('ComplyCube SDK not loaded');
      }

      sdkInstanceRef.current = window.ComplyCube.mount({
        token: response.token,
        containerId: 'complycube-mount',
        useModal: true,
        language: 'en',
        stages: [
          'intro',
          'documentCapture',
          {
            name: 'faceCapture',
            options: {
              mode: 'photo'
            }
          },
          'completion'
        ],
        onComplete: (data: SDKResult) => {
          console.log('Verification completed:', data);
          handleVerificationComplete(data);
        },
        onError: ({ type, message }) => {
          console.error('Verification error:', { type, message });
          if (type === 'token_expired') {
            refreshToken();
          } else {
            setError(message);
            setVerificationStatus('Verification failed');
            setIsVerificationComplete(true);
            resetSDK();
          }
        },
        onModalClose: handleModalClose,
        onExit: (reason) => {
          console.log('Exit reason:', reason);
          setVerificationStatus(`Verification process cancelled`);
          setIsVerificationComplete(true);
          resetSDK();
        }
      });

    } catch (error) {
      console.error('Error starting verification:', error);
      setError(error instanceof Error ? error.message : 'Failed to start verification');
      setVerificationStatus('Failed to start verification');
      resetSDK();
      setCheckId(null);
      setIsVerificationComplete(true);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStatusMessage = () => {
    if (!verificationStatus) return null;

    const isCompleted = isVerificationComplete && verificationStatus.includes('complete');
    const isFailed = isVerificationComplete && (verificationStatus.includes('failed') || verificationStatus.includes('cancelled'));
    const isProcessing = !isVerificationComplete && checkId !== null;

    return (
      <div className="mb-6 p-6 rounded-lg flex flex-col items-center justify-center text-center space-y-4">
        {isProcessing && (
          <>
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            <div className="text-lg font-medium text-blue-700">{verificationStatus}</div>
          </>
        )}
        {isCompleted && (
          <>
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <div className="text-lg font-medium text-green-700">Verification completed successfully</div>
          </>
        )}
        {isFailed && (
          <>
            <XCircle className="h-12 w-12 text-red-500" />
            <div className="text-lg font-medium text-red-700">{verificationStatus}</div>
          </>
        )}
      </div>
    );
  };

  const shouldShowStartButton = () => {
    const isFailed = verificationStatus.includes('failed') || verificationStatus.includes('cancelled');
    return (!checkId && !isVerificationComplete) || isFailed;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Identity Verification</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-md">
            {error}
          </div>
        )}

        {renderStatusMessage()}

        <div id="complycube-mount" className="min-h-[400px] mb-4" />
        
        {shouldShowStartButton() && (
          <Button
            onClick={startVerification}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Start Verification'
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};