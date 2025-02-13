export interface CustomerInfo {
  type: 'person',
  email: string,
  mobile: string,
  personDetails: {
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    nationality: string
  }
  }

  export interface DocumentInfo{
    clientId: string,
    documentType: string,
    issuingCountry: string
  }
  
  export interface VerificationResult {
    id: string;
    status: 'pending' | 'completed' | 'failed';
    details: any;
  }