import jwt, { JwtPayload } from "jsonwebtoken";

const { JWT_SECRET } = process.env;

/**
 * Verifies the token
 * @param {Object} parameters - function parameters
 * @param {string} parameters.token mongodb model
 * @returns {JwtPayload | null | Error} the jwt for the authentication. If verified correctly, returns {id} so for mongoose, you need to make it _id
 */
const modelVerify = ({
  token,
}: {
  token: string;
}): {} | JwtPayload | null | Error => {
  try {
    if (token) {
      const verify = jwt.verify(token, JWT_SECRET!);
      return verify;
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
};

export default modelVerify;
