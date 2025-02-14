import { ComplyCube } from '@complycube/api';
import { CustomerInfo, DocumentInfo, CheckInfo, VerificationResult, DocumentUpload } from '../types';

export class ComplyCubeService {
  private client: ComplyCube;

  constructor(apiKey: string) {
    this.client = new ComplyCube({ apiKey });
  }

  async createClient(customerInfo: CustomerInfo) {
    try {
      const client = await this.client.client.create({
        type: customerInfo.type,
        email: customerInfo.email,
        mobile: customerInfo.mobile,
        personDetails: {
          firstName: customerInfo.personDetails.firstName,
          lastName: customerInfo.personDetails.lastName,
          dob: customerInfo.personDetails.dob,
          nationality: customerInfo.personDetails.nationality
        }
      });
      return client;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to create client: ${error.message}`);
      }
      throw new Error('Failed to create client: Unknown error');
    }
  }

  async createDocument(documentInfo: DocumentInfo) {
    try {
      const document = await this.client.document.create(documentInfo.clientId,{
        type: documentInfo.documentType,
      });
      return document;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to create document: ${error.message}`);
      }
      throw new Error('Failed to create document: Unknown error');
    }
  }

  async uploadDocument(documentUpload: DocumentUpload) {
    try {
      if (!documentUpload.documentId || !documentUpload.data) {
        throw new Error('Document ID and data are required for upload');
      }
  
      const document = await this.client.document.upload(documentUpload.documentId, {
        fileName: documentUpload.fileName,
        data: documentUpload.data
      }, 'front');
      return document;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to upload document: ${error.message}`);
      }
      throw new Error('Failed to upload document: Unknown error');
    }
  }

  async uploadLivePhoto(clientId: string, photoData: string) {
    try {
      const photo = await this.client.livePhoto.upload(clientId,{
        data: photoData
      });
      return photo;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to upload live photo: ${error.message}`);
      }
      throw new Error('Failed to upload live photo: Unknown error');
    }
  }

  async createCheck(checkInfo: CheckInfo) {
    try {
      const check = await this.client.check.create(checkInfo.clientId,{
        type: 'identity_check',
        documentId: checkInfo.documentId,
        livePhotoId: checkInfo.livePhotoId
      });
      return check;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to create check: ${error.message}`);
      }
      throw new Error('Failed to create check: Unknown error');
    }
  }

  async getCheckStatus(checkId: string): Promise<VerificationResult> {
    try {
      const check = await this.client.check.get(checkId);
      return {
        id: checkId,
        status: check.status,
        details: check
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to get verification status: ${error.message}`);
      }
      throw new Error('Failed to get verification status: Unknown error');
    }
  }

  async generateWebSDKToken(clientId: string) {
    try {
      const token = await this.client.token.generate(clientId, {
        referrer: process.env.ALLOWED_ORIGIN || '*://*/*'      });
      return token;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate SDK token: ${error.message}`);
      }
      throw new Error('Failed to generate SDK token: Unknown error');
    }
  }
}