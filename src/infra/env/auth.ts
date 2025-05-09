interface IAuthEnv {
  jwt: {
    issuer: string,
    secretPublic: string,
    secretPrivate: string,
    expiresIn:string,
  };
}

export const authEnv: IAuthEnv = {
  jwt: {
    issuer: String(process.env.JWT_ISSUER),
    secretPublic: String(process.env.JWT_SECRET_PUBLIC),
    secretPrivate: String(process.env.JWT_SECRET_PRIVATE),
    expiresIn: String(process.env.JWT_EXPIRES_IN),
  },
};
