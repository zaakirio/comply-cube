import express, { Request, Response, NextFunction } from 'express';
import { ComplyCubeService } from '../services/complyCubeService';
import { validateCustomerInfo } from '../middleware/validation';
import { config } from '../config';
import {
  CustomerInfo,
  DocumentInfo,
  BaseDocument,
  CheckInfo,
} from '../types';

const router = express.Router();
const complyCubeService = new ComplyCubeService(config.complyCubeApiKey);



const handleError = (res: Response, error: unknown, operation: string): void => {
  console.error(`Error during ${operation}:`, error);
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  res.status(500).json({
    error: `Failed to ${operation}`,
    details: errorMessage,
  });
};

router.post('/clients', 
  validateCustomerInfo,
  async (req: Request<{}, any, CustomerInfo>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const client = await complyCubeService.createClient(req.body);
      res.json({
        clientId: client.id,
        status: 'created'
      });
    } catch (error) {
      handleError(res, error, 'create client');
    }
  }
);

router.post('/documents', 
  async (req: Request<{}, any, BaseDocument>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { clientId, documentType } = req.body;
      
      if (!clientId || !documentType ) {
        res.status(400).json({
          error: 'Missing required fields',
          details: 'clientId, documentType are required'
        });
        return;
      }

      const document = await complyCubeService.createDocument({
        clientId,
        documentType
      });

      res.json({
        documentId: document.id,
        status: 'created'
      });
    } catch (error) {
      handleError(res, error, 'create document');
    }
  }
);

router.post('/documents/:documentId/upload',
  async (req: Request<any, DocumentInfo>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { documentId } = req.params;
      const { fileName, data } = req.body;

      if (!data) {
        res.status(400).json({
          error: 'Missing required fields',
          details: 'document data is required'
        });
        return;
      }

      await complyCubeService.uploadDocument({
        documentId,
        fileName,
        data
      });

      res.json({
        documentId,
        status: 'uploaded'
      });
    } catch (error) {
      handleError(res, error, 'upload document');
    }
  }
);

router.post('/live-photos',
  async (req: Request<{}, any, { clientId: string; data: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { clientId, data } = req.body;

      if (!clientId || !data) {
        res.status(400).json({
          error: 'Missing required fields',
          details: 'clientId and data are required'
        });
        return;
      }

      const photo = await complyCubeService.uploadLivePhoto(clientId, data);

      res.json({
        photoId: photo.id,
        status: 'uploaded'
      });
    } catch (error) {
      handleError(res, error, 'upload live photo');
    }
  }
);

router.post('/checks',
  async (req: Request<{}, any, CheckInfo>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { clientId, documentId, livePhotoId } = req.body;

      if (!clientId || !documentId || !livePhotoId) {
        res.status(400).json({
          error: 'Missing required fields',
          details: 'clientId, documentId, and livePhotoId are required'
        });
        return;
      }

      const check = await complyCubeService.createCheck({
        clientId,
        documentId,
        livePhotoId
      });

      res.json({
        checkId: check.id,
        status: 'check_started'
      });
    } catch (error) {
      handleError(res, error, 'create check');
    }
  }
);

router.get('/checks/:checkId',
  async (req: Request<any, CheckInfo>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { checkId } = req.params;
      const status = await complyCubeService.getCheckResult(checkId);
      res.json(status);
    } catch (error) {
      handleError(res, error, 'get check status');
    }
  }
);

export default router;