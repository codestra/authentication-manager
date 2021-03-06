import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES } from './environment';
import { validateHash } from './crypotography/hashing';
import { ERROR_WRONG_CREDENTIALS, ERROR_ACCOUNT_NOT_ACTIVATED } from './ErrorCodes';

/**
 * Signs in the model and sends back the jwt if the account is activated.
 * Will also make the email lowercase before trying to find the document.
 * @param {Object} parameters - function parameters
 * @param {mongoose.Model} parameters.Model mongodb model
 * * @param {string} parameters.variables.email the email
 * @param {string} parameters.variables.filter other filters
 * @param {string} parameters.variables.password the password
 * @param {function({string}):void} parameters.onCompleted callback on completed. Returns the jwt
 * @returns {Promise<{ token: string, _id: string }>} the authentication token and the _id of the new document as a string
 */
const modelSignIn = async ({
  Model,
  variables: { filter, password },
  onCompleted,
}: {
  Model: mongoose.Model<any>;
  variables: { filter: { email: string; [key: string]: any }; password: string };
  onCompleted?: ({ token, _id }: { token: string; _id: string }) => void;
}): Promise<{ token: string; _id: string }> => {
  try {
    const model = await Model.findOne({
      ...filter,
      email: filter.email.toLowerCase(),
    }).lean();

    if (!model) {
      throw new Error(ERROR_WRONG_CREDENTIALS);
    }

    const validatePassword: any = validateHash(password, model.salt!).password;
    const verifyPassword: boolean = validatePassword === model.password;

    if (!verifyPassword) {
      throw new Error(ERROR_WRONG_CREDENTIALS);
    }

    const token = jwt.sign(
      {
        id: model._id,
        email: model.email,
      },
      JWT_SECRET!,
      {
        expiresIn: JWT_EXPIRES!, // token will expire in 30days
      },
    );
    if (onCompleted) {
      onCompleted({ token, _id: model._id.toString() });
    }
    return { token, _id: model._id.toString() };
  } catch (error: any) {
    throw new Error(error);
  }
};

export default modelSignIn;
