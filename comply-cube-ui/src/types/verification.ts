export type VerificationStatus = 'idle' | 'pending' | 'completed' | 'failed';

export interface VerificationState {
  status: VerificationStatus;
  message?: string;
  clientId?: string;
  checkId?: string;
}