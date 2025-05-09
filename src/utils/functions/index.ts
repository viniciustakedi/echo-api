import * as bcrypt from 'bcrypt';
import { ERole } from 'src/models/roles';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);

  return hash;
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateCode = () => {
  const character = '01234ABCDEFGHIJKLMNOPQRSTUVWXYZ56789';
  let generateString = '';

  for (let i = 0; i < 6; i++) {
    generateString += character.charAt(
      Math.floor(Math.random() * character.length),
    );
  }

  return generateString;
};

export const timeout = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const parseJwt = (token: string) => {
  const jwt = token.replace('Bearer ', '');
  return JSON.parse(String(Buffer.from(jwt.split('.')[1], 'base64')));
};

export const isSameUser = (id: string, auth: string) => {
  const { sub } = parseJwt(auth);
  if (id !== sub) return false;
  return true;
};

export const isUserAdmin = (auth: string) => {
    const { roles } = parseJwt(auth);
    const isAllowed = roles.includes(ERole.admin);
  
    return isAllowed;
  }