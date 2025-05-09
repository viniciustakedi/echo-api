import * as bcrypt from 'bcrypt';
import { ERole } from 'src/models/roles';

/**
 * Parses a JSON Web Token (JWT) and extracts its payload.
 *
 * @param token - The JWT string, typically prefixed with "Bearer ".
 * @returns The decoded payload of the JWT as a JavaScript object.
 *
 * @remarks
 * This function assumes the JWT is in the format "Bearer <token>" and removes the "Bearer " prefix
 * before decoding. It decodes the payload (second part of the JWT) from Base64 and parses it as JSON.
 *
 * @throws {SyntaxError} If the payload is not a valid JSON string.
 * @throws {Error} If the token format is invalid or the payload cannot be decoded.
 *
 * @example
 * ```typescript
 * const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywiaWF0IjoxNjE2MjM5MDIyfQ.sflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
 * const payload = parseJwt(token);
 * console.log(payload); // { userId: 123, iat: 1616239022 }
 * ```
 */
export const parseJwt = (token: string): Record<string, any> => {
  const jwt = token.replace('Bearer ', '');
  return JSON.parse(String(Buffer.from(jwt.split('.')[1], 'base64')));
};

/**
 * Checks if the provided user ID matches the subject (sub) extracted from the JWT token.
 *
 * @param id - The user ID to compare.
 * @param auth - The JWT token from which the subject (sub) will be extracted.
 * @returns A boolean indicating whether the provided user ID matches the subject in the JWT token.
 *
 * @remarks
 * This function relies on the `parseJwt` utility to decode the JWT token and extract its payload.
 * Ensure that the `auth` parameter is a valid JWT token string.
 */
export const isSameUser = (id: string, auth: string): boolean => {
  const { sub } = parseJwt(auth);
  if (id !== sub) return false;
  return true;
};

/**
 * Determines if a user has an admin role based on their authentication token.
 *
 * @param auth - The authentication token in JWT format.
 * @returns A boolean indicating whether the user has the admin role.
 *
 * @remarks
 * This function parses the provided JWT token to extract the user's roles
 * and checks if the `admin` role is included. It assumes the token contains
 * a `roles` property and that `ERole.admin` is a valid identifier for the admin role.
 *
 * @throws Will throw an error if the JWT token is invalid or cannot be parsed.
 */
export const isUserAdmin = (auth: string): boolean => {
  const { roles } = parseJwt(auth);
  const isAllowed = roles.includes(ERole.admin);

  return isAllowed;
};

/**
 * Asynchronously generates a hashed version of the provided password using bcrypt.
 *
 * @param password - The plain text password to be hashed.
 * @returns A promise that resolves to the hashed password as a string.
 *
 * @remarks
 * This function uses bcrypt to generate a salt and hash the password.
 * It is commonly used to securely store passwords in a database.
 *
 * @example
 * ```typescript
 * const hashedPassword = await hashPassword('mySecurePassword');
 * console.log(hashedPassword); // Outputs a hashed string
 * ```
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);

  return hash;
};

/**
 * Asynchronously compares a plain text password with a hashed password to check if they match.
 *
 * @param password - The plain text password to be compared.
 * @param hash - The hashed password to compare against.
 * @returns A promise that resolves to a boolean indicating whether the passwords match.
 *
 * @remarks
 * This function uses bcrypt to perform the comparison. It is commonly used to verify
 * user credentials during authentication.
 *
 * @example
 * ```typescript
 * const isMatch = await comparePassword('mySecurePassword', hashedPassword);
 * console.log(isMatch); // Outputs true if the passwords match, otherwise false
 * ```
 */
export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
