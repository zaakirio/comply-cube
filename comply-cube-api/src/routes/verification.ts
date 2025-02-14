import express, { Request, Response } from 'express';
import { ComplyCubeService } from '../services/complyCubeService';
import { validateCustomerInfo, validateSdkTokenRequest } from '../middleware/validation';
import { config } from '../config';
import { DocumentUpload } from '../types';

const router = express.Router();
const complyCubeService = new ComplyCubeService(config.complyCubeApiKey);


const handleError = (res: Response, error: unknown): void => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  res.status(500).json({ error: message });
};

router.post('/clients', validateCustomerInfo, async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await complyCubeService.createClient(req.body);
    res.json({ clientId: client.id });
  } catch (error) {
    handleError(res, error);
  }
});

router.post('/documents', async (req: Request, res: Response): Promise<void> => {
  try {
    const { clientId, documentType } = req.body;

    if (!clientId || !documentType) {
      res.status(400).json({ error: 'clientId and documentType are required' });
      return;
    }

    const document = await complyCubeService.createDocument({ clientId, documentType });
    res.json({ documentId: document.id });
  } catch (error) {
    handleError(res, error);
  }
});

router.post('/documents/:documentId/upload', async (req: Request, res: Response): Promise<void> => {
  try {
    const { documentId } = req.params;
    const { fileName, data } = req.body;

    if (!data) {
      res.status(400).json({ error: 'Document data is required' });
      return;
    }

    const documentUpload: DocumentUpload = {
      documentId,
      fileName,
      data
    };

    await complyCubeService.uploadDocument(documentUpload);
    res.json({ documentId, status: 'uploaded' });
  } catch (error) {
    handleError(res, error);
  }
});

router.post('/live-photos', async (req: Request, res: Response): Promise<void> => {
  try {
    const { clientId, data } = req.body;

    if (!clientId || !data) {
      res.status(400).json({ error: 'clientId and data are required' });
      return;
    }

    const photo = await complyCubeService.uploadLivePhoto(clientId, data);
    res.json({ photoId: photo.id });
  } catch (error) {
    handleError(res, error);
  }
});

router.post('/checks', async (req: Request, res: Response): Promise<void> => {
  try {
    const { clientId, documentId, livePhotoId } = req.body;

    if (!clientId || !documentId || !livePhotoId) {
      res.status(400).json({ error: 'clientId, documentId, and livePhotoId are required' });
      return;
    }

    const check = await complyCubeService.createCheck({ clientId, documentId, livePhotoId });
    res.json({ checkId: check.id });
  } catch (error) {
    handleError(res, error);
  }
});

router.get('/checks/:checkId', async (req: Request, res: Response): Promise<void> => {
  try {
    const status = await complyCubeService.getCheckStatus(req.params.checkId);
    res.json(status);
  } catch (error) {
    handleError(res, error);
  }
});

router.post('/web-sdk-token', validateSdkTokenRequest, async (req: Request, res: Response): Promise<void> => {
  try {
    const token = await complyCubeService.generateWebSDKToken(req.body.clientId);
    res.json({ token });
  } catch (error) {
    handleError(res, error);
  }
});

export default router;