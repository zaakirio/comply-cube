export type ClientType = 'person' | 'company';

export interface CustomerInfo {
  type: ClientType;
  email: string;
  mobile: string;
  personDetails: {
    firstName: string;
    lastName: string;
    dob: string;
    nationality: string;
  };
}

export interface DocumentInfo {
  clientId: string;
  documentType: string;
}

export interface DocumentUpload {
  documentId: string;
  fileName: string;
  data: string;
}

export interface CheckInfo {
  clientId: string;
  documentId: string;
  livePhotoId: string;
}

export interface VerificationResult {
  id: string;
  status: string;
  details: any;
}