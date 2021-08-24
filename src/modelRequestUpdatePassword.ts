import mongoose from 'mongoose';
import { createHash } from './crypotography/hashing';
import { ERROR_TOKEN_EXPIRED } from './ErrorCodes';

/**
 * Will update the reset token and send an email. If the user was found, will return the mail
 * @param {Object} parameters - function parameters
 * @param {mongoose.Model} parameters.Model mongodb model
 * @param {string} parameters.variables.email the email for which we want to resend the activation
 * @param {string} parameters.variables.password the new password
 * @param {string} parameters.variables.passwordResetToken the passwordResetToken
 * @param {function({string}):void} parameters.onCompleted callback on completed. Returns the e-mail.
 * @returns {Promise<string>} the found email for which we want to resend the activation
 */

const modelRequestUpdatePassword = async ({
  Model,
  variables: { email, password, passwordResetToken },
  onCompleted,
}: {
  Model: mongoose.Model<any>;
  variables: { email: string; password: string; passwordResetToken: string };
  onCompleted?: ({ email }: { email: string }) => void;
}): Promise<string> => {
  try {
    // find the document
    const dateNow = Date.now();

    const model = await Model.findOne({
      email: email.toLowerCase(),
      passwordResetToken,
      passwordResetExpires: {
        $gte: dateNow,
      },
    });

    if (!model) {
      throw new Error(ERROR_TOKEN_EXPIRED);
    }

    const hashedObject: any = createHash(password);
    await model.update({
      password: hashedObject.password,
      salt: hashedObject.salt,
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
      activated: true,
    });

    if (onCompleted) {
      onCompleted({ email: model.email });
    }
    return model.email as string;
  } catch (error: any) {
    throw new Error(error);
  }
};

export default modelRequestUpdatePassword;
