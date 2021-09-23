import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

process.env = { PASSWORD_RESET_EXPIRES: '8640000', JWT_EXPIRES: '9999y', JWT_SECRET: '123123' };
import { modelSignUp, modelActivate, modelSignIn } from '../index';
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

  // Removed this, because we dont check if we are activated
  // it('should sign in the model but throw an error when not activated', async () => {
  //   await modelSignUp({
  //     Model: MockModel,
  //     variables: { email: 'sajad.ghawami@codestra.io', password: '123123' },
  //   });

  //   await expect(async () => {
  //     await modelSignIn({
  //       Model: MockModel,
  //       variables: { email: 'sajad.ghawami@codestra.io', password: '123123' },
  //     });
  //   }).rejects.toThrowErrorMatchingSnapshot();
  // });

  it('should sign in the model', async () => {
    const data = await modelSignUp({
      Model: MockModel,
      variables: { email: 'sajad.ghawami1@codestra.io', password: '123123' },
    });

    const token1 = await modelActivate({
      Model: MockModel,
      variables: { activationToken: data.activationToken },
    });

    const token2 = await modelSignIn({
      Model: MockModel,
      variables: { email: 'sajad.ghawami1@codestra.io', password: '123123' },
    });

    expect(token1).toEqual(token2);
  });

  it('should sign in the activated model and call the onCompleted', async () => {
    const onCompleted = jest.fn();
    await modelSignIn({
      Model: MockModel,
      variables: { email: 'sajad.ghawami1@codestra.io', password: '123123' },
      onCompleted,
    });

    expect(onCompleted).toHaveBeenCalled();
  });

  it('should throw an error on wrong credentials', async () => {
    await expect(async () => {
      await modelSignIn({
        Model: MockModel,
        variables: { email: 'sajad.ghawami1@codestra.io', password: '123' },
      });
    }).rejects.toThrowErrorMatchingSnapshot();

    await expect(async () => {
      await modelSignIn({
        Model: MockModel,
        variables: { email: 'sajad.ghawami2@codestra.io', password: '123123' },
      });
    }).rejects.toThrowErrorMatchingSnapshot();
  });
});
