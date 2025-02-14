import { ComplyCubeService } from '../src/services/complyCubeService';
import { ComplyCube } from '@complycube/api';
import { CustomerInfo, DocumentInfo, CheckInfo, DocumentUpload, VerificationResult } from '../src/types';

jest.mock('@complycube/api');

const mockClient = {
  client: {
    create: jest.fn(),
  },
  document: {
    create: jest.fn(),
    upload: jest.fn(),
  },
  livePhoto: {
    upload: jest.fn(),
  },
  check: {
    create: jest.fn(),
    get: jest.fn(),
  },
  token: {
    generate: jest.fn(),
  },
};

describe('ComplyCubeService', () => {
  let service: ComplyCubeService;

  beforeEach(() => {
    (ComplyCube as jest.Mock).mockImplementation(() => mockClient);
    service = new ComplyCubeService('dummyApiKey');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createClient', () => {
    it('should create a client successfully', async () => {
      const customerInfo: CustomerInfo = {
        type: 'person',
        email: 'test@example.com',
        mobile: '+441111111111',
        personDetails: {
          firstName: 'John',
          lastName: 'Doe',
          dob: '1990-01-01'
        },
      };

      mockClient.client.create.mockResolvedValueOnce({ id: '12345' });

      const client = await service.createClient(customerInfo);

      expect(client).toEqual({ id: '12345' });
      expect(mockClient.client.create).toHaveBeenCalledWith({
        type: customerInfo.type,
        email: customerInfo.email,
        mobile: customerInfo.mobile,
        personDetails: customerInfo.personDetails,
      });
    });

    it('should throw an error if client creation fails', async () => {
      const customerInfo: CustomerInfo = {
        type: 'person',
        email: 'test@example.com',
        mobile: '+441111111111',
        personDetails: {
          firstName: 'John',
          lastName: 'Doe',
          dob: '1990-01-01',
        },
      };

      mockClient.client.create.mockRejectedValueOnce(new Error('API error'));

      await expect(service.createClient(customerInfo)).rejects.toThrow('Failed to create client: API error');
    });
  });

  describe('createDocument', () => {
    it('should create a document successfully', async () => {
      const documentInfo: DocumentInfo = {
        clientId: '12345',
        documentType: 'passport',
      };

      mockClient.document.create.mockResolvedValueOnce({ id: '67890' });

      const document = await service.createDocument(documentInfo);

      expect(document).toEqual({ id: '67890' });
      expect(mockClient.document.create).toHaveBeenCalledWith(documentInfo.clientId, {
        type: documentInfo.documentType,
      });
    });

    it('should throw an error if document creation fails', async () => {
      const documentInfo: DocumentInfo = {
        clientId: '12345',
        documentType: 'passport',
      };

      mockClient.document.create.mockRejectedValueOnce(new Error('API error'));

      await expect(service.createDocument(documentInfo)).rejects.toThrow('Failed to create document: API error');
    });
  });

  describe('uploadDocument', () => {
    it('should upload a document successfully', async () => {
      const documentUpload: DocumentUpload = {
        documentId: '67890',
        data: 'base64encodedstring',
        fileName: 'document.pdf',
      };

      mockClient.document.upload.mockResolvedValueOnce({ status: 'uploaded' });

      const result = await service.uploadDocument(documentUpload);

      expect(result).toEqual({ status: 'uploaded' });
      expect(mockClient.document.upload).toHaveBeenCalledWith(documentUpload.documentId, {
        fileName: documentUpload.fileName,
        data: documentUpload.data,
      }, 'front');
    });

    it('should throw an error if document upload fails', async () => {
      const documentUpload: DocumentUpload = {
        documentId: '67890',
        data: 'base64encodedstring',
        fileName: 'document.pdf',
      };

      mockClient.document.upload.mockRejectedValueOnce(new Error('API error'));

      await expect(service.uploadDocument(documentUpload)).rejects.toThrow('Failed to upload document: API error');
    });

    it('should throw an error if document ID or data is missing', async () => {
      const documentUpload: DocumentUpload = {
        documentId: '',
        data: '',
        fileName: 'document.pdf',
      };

      await expect(service.uploadDocument(documentUpload)).rejects.toThrow('Document ID and data are required for upload');
    });
  });

  describe('uploadLivePhoto', () => {
    it('should upload a live photo successfully', async () => {
      const clientId = '12345';
      const photoData = 'base64photo';

      mockClient.livePhoto.upload.mockResolvedValueOnce({ status: 'uploaded' });

      const result = await service.uploadLivePhoto(clientId, photoData);

      expect(result).toEqual({ status: 'uploaded' });
      expect(mockClient.livePhoto.upload).toHaveBeenCalledWith(clientId, {
        data: photoData,
      });
    });

    it('should throw an error if live photo upload fails', async () => {
      const clientId = '12345';
      const photoData = 'base64photo';

      mockClient.livePhoto.upload.mockRejectedValueOnce(new Error('API error'));

      await expect(service.uploadLivePhoto(clientId, photoData)).rejects.toThrow('Failed to upload live photo: API error');
    });
  });

  describe('createCheck', () => {
    it('should create a check successfully', async () => {
      const checkInfo: CheckInfo = {
        clientId: '12345',
        documentId: '67890',
        livePhotoId: 'abc123',
      };

      mockClient.check.create.mockResolvedValueOnce({ id: 'check123' });

      const check = await service.createCheck(checkInfo);

      expect(check).toEqual({ id: 'check123' });
      expect(mockClient.check.create).toHaveBeenCalledWith(checkInfo.clientId, {
        type: 'identity_check',
        documentId: checkInfo.documentId,
        livePhotoId: checkInfo.livePhotoId,
      });
    });

    it('should throw an error if check creation fails', async () => {
      const checkInfo: CheckInfo = {
        clientId: '12345',
        documentId: '67890',
        livePhotoId: 'abc123',
      };

      mockClient.check.create.mockRejectedValueOnce(new Error('API error'));

      await expect(service.createCheck(checkInfo)).rejects.toThrow('Failed to create check: API error');
    });
  });

  describe('getCheckStatus', () => {
    it('should get check status successfully', async () => {
      const checkId = 'check123';
      const mockCheck = { status: 'completed', details: {} };

      mockClient.check.get.mockResolvedValueOnce(mockCheck);

      const status = await service.getCheckStatus(checkId);

      expect(status).toEqual({
        id: checkId,
        status: "completed", 
        details: {
          details: {},
          status: "completed"
        }
      });
      expect(mockClient.check.get).toHaveBeenCalledWith(checkId);
    });

    it('should throw an error if getting check status fails', async () => {
      const checkId = 'check123';

      mockClient.check.get.mockRejectedValueOnce(new Error('API error'));

      await expect(service.getCheckStatus(checkId)).rejects.toThrow('Failed to get verification status: API error');
    });
  });

  describe('generateWebSDKToken', () => {
    it('should generate SDK token successfully', async () => {
      const clientId = '12345';
      const mockToken = { token: 'dummy-token' };

      mockClient.token.generate.mockResolvedValueOnce(mockToken);

      const token = await service.generateWebSDKToken(clientId);

      expect(token).toEqual(mockToken);
      expect(mockClient.token.generate).toHaveBeenCalledWith(clientId, {
        referrer: process.env.ALLOWED_ORIGIN || '*://*/*',
      });
    });

    it('should throw an error if generating SDK token fails', async () => {
      const clientId = '12345';

      mockClient.token.generate.mockRejectedValueOnce(new Error('API error'));

      await expect(service.generateWebSDKToken(clientId)).rejects.toThrow('Failed to generate SDK token: API error');
    });
  });
});
