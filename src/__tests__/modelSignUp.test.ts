import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

process.env = { PASSWORD_RESET_EXPIRES: '8640000', JWT_EXPIRES: '9999y', JWT_SECRET: '123123' };
import { modelSignUp } from '../index';
import MockModel from '../mocks/model';

import * as cryptography from '../crypotography/hashing';

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

  it('should sign up the model', async () => {
    const result = await modelSignUp({
      Model: MockModel,
      variables: { email: 'sajad.ghawami@codestra.io', password: '123123' },
    });

    const data = await MockModel.findOne();
    expect(data._id.toString()).toBe(result._id);
  });

  it('should throw an duplicate key error', async () => {
    await expect(async () => {
      await modelSignUp({
        Model: MockModel,
        variables: { email: 'sajad.ghawami@codestra.io', password: '123123' },
      });
    }).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw an error', async () => {
    jest.spyOn(cryptography, 'createHash').mockImplementationOnce(() => {
      throw new Error('MOCKED_ERROR');
    });

    await expect(async () => {
      await modelSignUp({
        Model: MockModel,
        variables: { email: 'sajad.ghawami2@codestra.io', password: '123123' },
      });
    }).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should call the onComplete callback', async () => {
    const onCompleted = jest.fn();

    await modelSignUp({
      Model: MockModel,
      variables: { email: 'sajad.ghawami1@codestra.io', password: '123123' },
      onCompleted,
    });

    expect(onCompleted).toBeCalled();
  });
});
