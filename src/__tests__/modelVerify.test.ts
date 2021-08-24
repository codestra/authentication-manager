import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

process.env = { PASSWORD_RESET_EXPIRES: '8640000', JWT_EXPIRES: '9999y', JWT_SECRET: '123123' };
import { modelVerify, modelSignUp, modelActivate } from '../index';
import MockModel from '../mocks/model';
import jwt from 'jsonwebtoken';

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

  it('return null if no token has been set', async () => {
    const result = modelVerify({ token: undefined });
    expect(result).toBe(null);
  });

  it('throw an error when no activation token was found', async () => {
    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      throw new Error('MOCKED_ERROR');
    });

    // wrong token
    expect(async () => {
      modelVerify({ token: 'mocked-token' });
    }).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should verify the token', async () => {
    const data = await modelSignUp({
      Model: MockModel,
      variables: { email: 'sajad.ghawami1@codestra.io', password: '123123' },
    });

    const token = await modelActivate({
      Model: MockModel,
      variables: { activationToken: data.activationToken },
    });

    const result = modelVerify({ token });
    expect(result).toBeDefined();
  });
});
