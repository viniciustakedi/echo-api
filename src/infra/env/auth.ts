import { config } from 'dotenv';
config();

interface IAuthEnv {
  jwt: {
    issuer: string;
    secretPublic: string;
    secretPrivate: string;
    expiresInSeconds: number;
  };
}

export const authEnv: IAuthEnv = {
  jwt: {
    issuer: String(process.env.JWT_ISSUER),
    secretPublic: String(process.env.JWT_SECRET_PUBLIC),
    secretPrivate: String(process.env.JWT_SECRET_PRIVATE),
    expiresInSeconds: Number(process.env.JWT_EXPIRES_IN_SECONDS),
  },
};
