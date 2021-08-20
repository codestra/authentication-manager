import mongoose from 'mongoose';
import { randomBytes } from 'crypto';
import { ERROR_USER_NOT_FOUND } from './ErrorCodes';
import { PASSWORD_RESET_EXPIRES } from './environment';

/**
 * Will update the reset token and send an email. If the user was found, will return passwordResetToken
 * @param {Object} parameters - function parameters
 * @param {mongoose.Model} parameters.Model mongodb model
 * @param {string} parameters.variables.email the email for which we want to reset the password
 * @param {function({string}):void} parameters.onCompleted callback on completed. Returns the passwordResetToken
 * @returns {Promise<string | Error>} returns the reset token
 */
const modelRequestResetPassword = async ({
  Model,
  variables: { email },
  onCompleted,
}: {
  Model: mongoose.Model<any>;
  variables: { email: string };
  onCompleted?: ({ passwordResetToken }: { passwordResetToken: string }) => void;
}): Promise<string | Error> => {
  try {
    const model = await Model.findOne({
      email: email.toLowerCase(),
    });

    if (!model) {
      throw new Error(ERROR_USER_NOT_FOUND);
    }

    const passwordResetToken = randomBytes(20).toString('hex');
    const passwordResetExpires = Date.now() + parseInt(PASSWORD_RESET_EXPIRES!, 10); // Today plus 24 hours

    await model.update({ passwordResetToken, passwordResetExpires });
    if (onCompleted) {
      onCompleted({ passwordResetToken });
    }
    return passwordResetToken;
  } catch (error: any) {
    throw new Error(error);
  }
};

export default modelRequestResetPassword;
