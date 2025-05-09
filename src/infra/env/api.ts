import { config } from 'dotenv';
config();

interface IApiEnv {
  nodeEnvMessage: string;
  environment: string;
  port: string;
}

export const apiEnv: IApiEnv = {
  nodeEnvMessage: String(process.env.NODE_ENV_MESSAGE),
  environment: String(process.env.ENVIRONMENT),
  port: String(process.env.PORT),
};
