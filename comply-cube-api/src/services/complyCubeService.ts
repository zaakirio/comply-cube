import axios from 'axios';
import { CustomerInfo, VerificationResult } from '../types';

export class ComplyCubeService {
  private apiKey: string;
  private baseUrl = 'https://api.complycube.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async createClient(customerInfo: CustomerInfo) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/clients`,
        {
          type: 'person',
          email: customerInfo.email,
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          dateOfBirth: customerInfo.dateOfBirth,
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create client: ${error.message}`);
    }
  }

  async createCheck(clientId: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/checks`,
        {
          type: 'identity',
          clientId,
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create check: ${error.message}`);
    }
  }

  async getVerificationStatus(checkId: string): Promise<VerificationResult> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/checks/${checkId}`,
        { headers: this.getHeaders() }
      );
      return {
        id: checkId,
        status: response.data.status,
        details: response.data,
      };
    } catch (error) {
      throw new Error(`Failed to get verification status: ${error.message}`);
    }
  }
}