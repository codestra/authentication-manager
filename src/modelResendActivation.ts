import mongoose from 'mongoose';
import { ERROR_NOT_SPECIFIED } from './ErrorCodes';

/**
 * Request the activation token.
 * @param {Object} parameters - function parameters
 * @param {mongoose.Model} parameters.Model mongodb model
 * @param {string} parameters.variables.email the email for which we want to resend the activation
 * @param {function({string}):void} parameters.onCompleted callback on completed. Returns the activationToken.
 * @returns {Promise<string | Error>} the found email for which we want to resend the activation
 */
const modelResendActivation = async ({
  Model,
  variables: { email },
  onCompleted,
}: {
  Model: mongoose.Model<any>;
  variables: { email: string };
  onCompleted?: ({ activationToken }: { activationToken: string }) => void;
}): Promise<string | Error> => {
  try {
    const model = await Model.findOne({ email });

    if (!model) {
      throw new Error(ERROR_NOT_SPECIFIED);
    }
    // TODO: create new activation token
    if (onCompleted) {
      onCompleted({ activationToken: model.activationToken });
    }
    return model.activationToken as string;
  } catch (error: any) {
    throw new Error(error);
  }
};

export default modelResendActivation;
