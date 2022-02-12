import mongoose from 'mongoose';
import { ERROR_NOT_SPECIFIED } from './ErrorCodes';
import { JWT_SECRET, JWT_EXPIRES } from './environment';
import jwt from 'jsonwebtoken';

/**
 * Activates the model with the activationToken and returns the jwt.
 * @param {Object} parameters - function parameters
 * @param {mongoose.Model} parameters.Model mongodb model
 * @param {string} parameters.variables.activationToken the activation token for which model we want to activate the account
 * @param {function({token: string}):void} parameters.onCompleted callback on completed. Returns the token.
 * @returns {Promise<string>} the jwt for the authentication
 */
const modelActivate = async ({
  Model,
  variables: { activationToken },
  onCompleted,
}: {
  Model: mongoose.Model<any>;
  variables: { activationToken: string };
  onCompleted?: ({ token }: { token: string }) => void;
}): Promise<string> => {
  const model = await Model.findOne({
    activationToken,
  });

  if (!model) {
    // TODO: Token expired error
    throw new Error(ERROR_NOT_SPECIFIED);
  }

  await model.update({
    activated: true,
  });

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
    onCompleted({ token });
  }
  return token;
};

export default modelActivate;
