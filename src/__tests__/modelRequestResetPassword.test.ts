import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

process.env = { PASSWORD_RESET_EXPIRES: '8640000', JWT_EXPIRES: '9999y', JWT_SECRET: '123123' };
import { modelSignUp, modelRequestResetPassword } from '../index';
import MockModel from '../mocks/model';

describe('modelSignUp', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    if (mongoServer) {
      await mongoServer.stop();
      await mongoose.disconnect();
    }
  });

  it('throw an error when no email has been found', async () => {
    // wrong token
    await expect(async () => {
      await modelRequestResetPassword({ Model: MockModel, variables: { email: 'sajad.ghawami@codestra.io' } });
    }).rejects.toThrowErrorMatchingSnapshot();
  });

  it('signed up model and reset the password twice to see if they differ', async () => {
    await modelSignUp({
      Model: MockModel,
      variables: { email: 'sajad.ghawami@codestra.io', password: '123123' },
    });

    const onCompleted = jest.fn();
    const passwordResetToken1 = await modelRequestResetPassword({
      Model: MockModel,
      variables: { email: 'sajad.ghawami@codestra.io' },
      onCompleted,
    });
    const passwordResetToken2 = await modelRequestResetPassword({
      Model: MockModel,
      variables: { email: 'sajad.ghawami@codestra.io' },
    });

    expect(passwordResetToken1).not.toBe(passwordResetToken2);
    expect(onCompleted).toHaveBeenCalled();
  });
});
