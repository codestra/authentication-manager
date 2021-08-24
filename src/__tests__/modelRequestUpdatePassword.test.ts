import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

process.env = { PASSWORD_RESET_EXPIRES: '8640000', JWT_EXPIRES: '9999y', JWT_SECRET: '123123' };
import { modelSignUp, modelRequestResetPassword, modelRequestUpdatePassword } from '../index';
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

  it('signed up model and update the password after reset', async () => {
    await modelSignUp({
      Model: MockModel,
      variables: { email: 'sajad.ghawami@codestra.io', password: '123123' },
    });

    const passwordResetToken = await modelRequestResetPassword({
      Model: MockModel,
      variables: { email: 'sajad.ghawami@codestra.io' },
    });

    const result = await modelRequestUpdatePassword({
      Model: MockModel,
      variables: { email: 'sajad.ghawami@codestra.io', password: '123123', passwordResetToken },
    });

    expect(result).toMatchSnapshot();
  });

  it('signed up model and call the onComplete', async () => {
    await modelSignUp({
      Model: MockModel,
      variables: { email: 'sajad.ghawami1@codestra.io', password: '123123' },
    });

    const passwordResetToken = await modelRequestResetPassword({
      Model: MockModel,
      variables: { email: 'sajad.ghawami1@codestra.io' },
    });

    const onCompleted = jest.fn();
    const result = await modelRequestUpdatePassword({
      Model: MockModel,
      variables: { email: 'sajad.ghawami1@codestra.io', password: '123123', passwordResetToken },
      onCompleted,
    });

    expect(result).toMatchSnapshot();
    expect(onCompleted).toHaveBeenCalled();
  });

  it('signed up model and try to update the password with the wrong passwordResetToken', async () => {
    await expect(async () => {
      await modelRequestUpdatePassword({
        Model: MockModel,
        variables: { email: 'sajad.ghawami@codestra.io', password: '123123', passwordResetToken: '123123' },
      });
    }).rejects.toThrowErrorMatchingSnapshot();
  });
});
