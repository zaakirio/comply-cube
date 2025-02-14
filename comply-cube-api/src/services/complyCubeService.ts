import axios, { AxiosError } from 'axios';
import {
  CustomerInfo,
  DocumentInfo,
  CheckInfo,
  BaseDocument,
  CheckResult
} from '../types';

export class ComplyCubeService {
  private readonly baseUrl = 'https://api.complycube.com/v1';
  
  constructor(private readonly apiKey: string) {}

  private get headers() {
    return {
      Authorization: this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  private handleError(error: unknown, operation: string): never {
    if (error instanceof AxiosError) {
      throw new Error(`Failed to ${operation}: ${error.response?.data?.message || error.message}`);
    }
    throw new Error(`Failed to ${operation}: Unknown error`);
  }

  async createClient(customerInfo: CustomerInfo) {
    try {
      const { data } = await axios.post(
        `${this.baseUrl}/clients`,
        {
          type: customerInfo.type,
          email: customerInfo.email,
          mobile: customerInfo.mobile,
          personDetails: {
            firstName: customerInfo.personDetails.firstName,
            lastName: customerInfo.personDetails.lastName,
            dob: customerInfo.personDetails.dob,
            nationality: customerInfo.personDetails.nationality
          }
        },
        { headers: this.headers }
      );
      return data;
    } catch (error) {
      this.handleError(error, 'create client');
    }
  }

  async createDocument(documentInfo: BaseDocument) {
    try {
      const { data } = await axios.post(
        `${this.baseUrl}/documents`,
        {
          clientId: documentInfo.clientId,
          type: documentInfo.documentType,
        },
        { headers: this.headers }
      );
      return data;
    } catch (error) {
      this.handleError(error, 'create document');
    }
  }

  async uploadDocument(documentInfo: DocumentInfo) {
    if (!documentInfo.documentId) {
      throw new Error('Document ID is required for upload');
    }

    try {
      const { data } = await axios.post(
        `${this.baseUrl}/documents/${documentInfo.documentId}/upload/front`,
        {
          fileName: documentInfo.fileName,
          data: documentInfo.data
        },
        { headers: this.headers }
      );
      return data;
    } catch (error) {
      this.handleError(error, 'upload document');
    }
  }

  async uploadLivePhoto(clientId: string, photoData: string) {
    try {
      const { data } = await axios.post(
        `${this.baseUrl}/livePhotos`,
        {
          clientId,
          data: photoData
        },
        { headers: this.headers }
      );
      return data;
    } catch (error) {
      this.handleError(error, 'upload live photo');
    }
  }

  async createCheck(checkInfo: CheckInfo) {
    try {
      const { data } = await axios.post(
        `${this.baseUrl}/checks`,
        {
          clientId: checkInfo.clientId,
          documentId: checkInfo.documentId,
          livePhotoId: checkInfo.livePhotoId,
          type: 'identity_check' 
        },
        { headers: this.headers }
      );
      return data;
    } catch (error) {
      this.handleError(error, 'create check');
    }
  }

  async getCheckResult(checkId: string): Promise<CheckResult> {
    try {
      const { data } = await axios.get(
        `${this.baseUrl}/checks/${checkId}`,
        { headers: this.headers }
      );
      
      return {
        id: data.id,
        status: data.status,
        details: data
      };
    } catch (error) {
      this.handleError(error, 'get verification status');
    }
  }
}