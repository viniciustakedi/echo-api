import { config } from 'dotenv';
config();

interface IMongoEnv {
  uri: string;
  database: string;
}

export const mongoEnv: IMongoEnv = {
  uri: String(process.env.MONGODB_URI),
  database: String(process.env.MONGODB_DATABASE),
};
