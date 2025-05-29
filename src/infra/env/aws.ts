import { config } from 'dotenv';
config();

interface IAWSEnv {
  publicBucketName: string;
  secretAccessKey: string;
  accessKeyId: string;
  region: string;
}

export const awsEnv: IAWSEnv = {
  publicBucketName: String(process.env.AWS_PUBLIC_BUCKET_NAME),
  secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
  accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
  region: String(process.env.AWS_REGION),
};
