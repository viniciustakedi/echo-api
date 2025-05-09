/**
 * Generates a random alphanumeric code consisting of 6 characters.
 *
 * The generated code is composed of uppercase letters (A-Z) and digits (0-9),
 * ensuring a total of 36 possible characters for each position in the string.
 *
 * @returns {string} A randomly generated 6-character alphanumeric string.
 */
export const generateCode = (): string => {
  const character = '01234ABCDEFGHIJKLMNOPQRSTUVWXYZ56789';
  let generateString = '';

  for (let i = 0; i < 6; i++) {
    generateString += character.charAt(
      Math.floor(Math.random() * character.length),
    );
  }

  return generateString;
};

/**
 * Delays the execution of code for a specified amount of time.
 *
 * @param ms - The number of milliseconds to wait before resolving the promise.
 * @returns A promise that resolves after the specified delay.
 *
 * @example
 * ```typescript
 * await timeout(1000); // Waits for 1 second before proceeding
 * console.log('1 second has passed');
 * ```
 */
export const timeout = (ms: number): Promise<unknown> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
