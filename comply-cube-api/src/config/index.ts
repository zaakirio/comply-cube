import dotenv from 'dotenv';

dotenv.config();

export const config = {
  complyCubeApiKey: process.env.COMPLYCUBE_API_KEY ?? "",
  complyCubeWebhookSecret: process.env.COMPLYCUBE_WEBHOOK_SECRET,
  port: process.env.PORT || 3000,
};