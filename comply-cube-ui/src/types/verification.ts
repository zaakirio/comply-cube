export type VerificationStatus = 'idle' | 'pending' | 'completed' | 'failed';

export interface VerificationState {
  status: VerificationStatus;
  clientId?: string;
  checkId?: string;
  message?: string;
}

export interface VerificationResponse {
  clientId: string;
  checkId: string;
  status: string;
  details?: Record<string, unknown>;
}