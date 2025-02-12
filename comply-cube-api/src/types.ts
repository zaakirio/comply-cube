export interface Applicant {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
  }
  
  export interface Check {
    id: string;
    status: 'pending' | 'complete' | 'failed';
    result?: {
      document: {
        validity: 'valid' | 'invalid';
      };
      identity: {
        match: 'match' | 'no_match';
      };
    };
  }
  
  export interface ClientTokenResponse {
    token: string;
  }