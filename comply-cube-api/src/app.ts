import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import verificationRoutes from './routes/verification';
import { config } from './config';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/verification', verificationRoutes);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
