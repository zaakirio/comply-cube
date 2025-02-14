export type ClientType = 'person' | 'company';
export type VerificationStatus = 'pending' | 'completed' | 'failed';

export interface ClientOwned {
  clientId: string;
}

export interface PersonDetails {
  firstName: string;
  lastName: string;
  dob: string;
  nationality: string;
}

export interface ContactInfo {
  email: string;
  mobile: string;
}

export interface CustomerInfo extends ContactInfo {
  type: ClientType;
  personDetails: PersonDetails;
}

export interface BaseDocument extends ClientOwned {
  documentType: string;
}

export interface DocumentInfo {
  documentId: string;
  fileName: string;
  data: string;
}

export interface CheckInfo extends ClientOwned {
  documentId: string;
  livePhotoId: string;
}

export interface CheckResult {
  id: string;
  status: VerificationStatus;
  details: Record<string, unknown>; 
}