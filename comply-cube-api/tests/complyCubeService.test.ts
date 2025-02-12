import { ComplyCubeService } from '../src/services/complyCubeService';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ComplyCubeService', () => {
  const service = new ComplyCubeService('test-api-key');
  const mockCustomerInfo = {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    email: 'john@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createClient', () => {
    it('should successfully create a client', async () => {
      const mockResponse = { data: { id: 'client-123' } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await service.createClient(mockCustomerInfo);
      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/clients'),
        expect.objectContaining({
          email: mockCustomerInfo.email,
        }),
        expect.any(Object)
      );
    });
  });

  describe('createCheck', () => {
    it('should successfully create a check', async () => {
      const mockResponse = { data: { id: 'check-123' } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await service.createCheck('client-123');
      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/checks'),
        expect.objectContaining({
          clientId: 'client-123',
        }),
        expect.any(Object)
      );
    });
  });
});