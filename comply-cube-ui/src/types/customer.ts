export type ClientType = 'person' | 'company';

export interface PersonDetails {
  firstName: string;
  lastName: string;
  dob: string;
}

export interface ContactInfo {
  email: string;
  mobile: string;
}

export interface CustomerInfo extends ContactInfo {
  type: ClientType;
  personDetails: PersonDetails;
}