import jwt, { JwtPayload } from 'jsonwebtoken';

/**
 * Verifies the token
 * @param {Object} parameters - function parameters
 * @param {string} parameters.token mongodb model
 * @returns {JwtPayload | null} the jwt for the authentication. If verified correctly, returns {id} so for mongoose, you need to make it _id
 */
const modelVerify = ({ token }: { token: string | undefined }): {} | JwtPayload | null | Error => {
  try {
    if (token) {
      const verify = jwt.verify(token, process.env.JWT_SECRET!);
      return verify;
    }
    return null;
  } catch (error: any) {
    throw new Error(error);
  }
};

export default modelVerify;
