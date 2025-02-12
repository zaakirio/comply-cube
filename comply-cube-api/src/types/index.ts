export interface CustomerInfo {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
  }
  
  export interface VerificationResult {
    id: string;
    status: 'pending' | 'completed' | 'failed';
    details: any;
  }