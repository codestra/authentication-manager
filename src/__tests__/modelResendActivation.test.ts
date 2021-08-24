import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

process.env = { PASSWORD_RESET_EXPIRES: '8640000', JWT_EXPIRES: '9999y', JWT_SECRET: '123123' };
import { modelSignUp, modelResendActivation } from '../index';
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

  it('signed up model and resend the same activation token', async () => {
    const { activationToken } = await modelSignUp({
      Model: MockModel,
      variables: { email: 'sajad.ghawami@codestra.io', password: '123123' },
    });

    const activationToken2 = await modelResendActivation({
      Model: MockModel,
      variables: { email: 'sajad.ghawami@codestra.io' },
    });

    expect(activationToken).toBe(activationToken2);
  });

  it('resend activation and call the onComplete', async () => {
    const onCompleted = jest.fn();
    await modelResendActivation({
      Model: MockModel,
      variables: { email: 'sajad.ghawami@codestra.io' },
      onCompleted,
    });

    expect(onCompleted).toHaveBeenCalled();
  });

  it('should throw a error on wrong email', async () => {
    await expect(async () => {
      await modelResendActivation({
        Model: MockModel,
        variables: { email: 'sajad.ghawami1@codestra.io' },
      });
    }).rejects.toThrowErrorMatchingSnapshot();
  });
});
