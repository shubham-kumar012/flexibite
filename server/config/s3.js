import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

// Map AWS environment variables from server/.env
const region = process.env.AWS_REGION_KEY || process.env.AWS_REGION || 'ap-south-1';
const accessKeyId = process.env.AWS_ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.AWS_SECRET_KEY || process.env.AWS_SECRET_ACCESS_KEY || '';

export const bucketName = process.env.AWS_S3_BUCKET || '';

// Initialize AWS S3 Client instance
export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const getS3Config = () => ({
  region,
  bucketName,
  isConfigured: Boolean(accessKeyId && secretAccessKey && bucketName),
});
