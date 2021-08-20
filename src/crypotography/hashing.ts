import { createHmac, Hmac, randomBytes } from 'crypto';

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
function genRandomString(length: number): string {
  return randomBytes(Math.ceil(length / 2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0, length); /** return required number of characters */
}

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
export function createHash(data: any): { salt: string; password: string } {
  const salt: string = genRandomString(16); /** Gives us salt of length 16 */
  const hash: Hmac = createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(data);
  const value: string = hash.digest('hex');
  return {
    salt,
    password: value,
  };
}

export function validateHash(data: any, salt: string): { password: string } {
  const hash: Hmac = createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(data);
  const value: string = hash.digest('hex');
  return {
    password: value,
  };
}
