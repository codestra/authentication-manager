import mongoose from 'mongoose';
import { randomBytes } from 'crypto';
import { createHash } from './crypotography/hashing';

/**
 * Creates a new document based on the supplied model the email, password and other fields.
 * Will return the new _id and the activationtoken
 * @param {Object} parameters - function parameters
 * @param {mongoose.Model} parameters.Model mongodb model
 * @param {string} parameters.variables.email the email which will be used for registration made lowercase
 * @param {string} parameters.variables.password the password
 * @param {function({string, string}):void}  parameters.onCompleted callback on completed. Returns the _id
 * @returns {Promise<{ activationToken: string, _id: string }>} the activationtoken and _id  as a string
 */
const modelSignUp = async ({
  Model,
  variables: { password, email, ...rest },
  onCompleted,
}: {
  Model: mongoose.Model<any>;
  variables: { password: string; email: string };
  onCompleted?: ({ activationToken, _id }: { activationToken: string; _id: string }) => void;
}): Promise<{ activationToken: string; _id: string }> => {
  try {
    // hash the password
    const hashedObject: any = createHash(password);

    // create the activation token
    const activationToken = randomBytes(20).toString('hex');

    const modelData = {
      email: email.toLowerCase(),
      password: hashedObject.password,
      salt: hashedObject.salt,
      activated: false,
      activationToken,
      ...rest,
    };

    const model = await Model.create(modelData);

    if (onCompleted) {
      onCompleted({ activationToken, _id: model._id.toString() });
    }
    return { _id: model._id.toString(), activationToken };
  } catch (error: any) {
    throw new Error(error);
  }
};

export default modelSignUp;
