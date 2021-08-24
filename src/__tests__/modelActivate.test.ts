import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

process.env = { PASSWORD_RESET_EXPIRES: '8640000', JWT_EXPIRES: '9999y', JWT_SECRET: '123123' };
import { modelSignUp, modelActivate } from '../index';
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

  it('activate a signed up model', async () => {
    const onCompleted = jest.fn(async ({ activationToken }) => {
      const token = await modelActivate({
        Model: MockModel,
        variables: { activationToken },
      });

      const model = await MockModel.findOne({ email: 'sajad.ghawami@codestra.io' }).lean();
      expect(token).toBeDefined();
      await expect(model.activated).toBe(true);
    });
    await modelSignUp({
      Model: MockModel,
      variables: { email: 'sajad.ghawami@codestra.io', password: '123123' },
      onCompleted,
    });
    expect(onCompleted).toHaveBeenCalled();
  });

  it('activate a signed up model and call the onComplete callback', async () => {
    const onCompleted = jest.fn(async ({ activationToken }) => {
      const onCompleteActivate = jest.fn();
      const token = await modelActivate({
        Model: MockModel,
        variables: { activationToken },
        onCompleted: onCompleteActivate,
      });
      expect(token).toBeDefined();
      expect(onCompleteActivate).toHaveBeenCalled();
    });

    await modelSignUp({
      Model: MockModel,
      variables: { email: 'sajad.ghawami1@codestra.io', password: '123123' },
      onCompleted,
    });

    expect(onCompleted).toHaveBeenCalled();
  });

  it('throw an error when no activation token was found', async () => {
    // wrong token
    await expect(async () => {
      await modelActivate({ Model: MockModel, variables: { activationToken: 'wrong-token' } });
    }).rejects.toThrowErrorMatchingSnapshot();
  });
});
