import express from 'express';
import { ComplyCubeService } from '../services/complyCubeService';
import { validateCustomerInfo } from '../middleware/validation';
import { config } from '../config';

const router = express.Router();
const complyCubeService = new ComplyCubeService(config.complyCubeApiKey);

router.post('/onboard', validateCustomerInfo, async (req, res) => {
  try {
    const client = await complyCubeService.createClient(req.body);
    const check = await complyCubeService.createCheck(client.id);
    
    res.json({
      clientId: client.id,
      checkId: check.id,
      status: 'pending',
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to start verification process',
      details: error.message,
    });
  }
});

router.get('/status/:checkId', async (req, res) => {
  try {
    const status = await complyCubeService.getVerificationStatus(req.params.checkId);
    res.json(status);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get verification status',
      details: error.message,
    });
  }
});

export default router;