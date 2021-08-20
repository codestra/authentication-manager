// import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
process.env = { PASSWORD_RESET_EXPIRES: '8640000', JWT_EXPIRES: '9999y', JWT_SECRET: '123123' };
import { modelSignUp } from '../index';
import UserModel from '../mocks/model';

describe('modelSignUp', () => {
  // let con: MongoClient;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    // if (con) {
    //   await con.close();
    // }
    if (mongoServer) {
      await mongoServer.stop();
      await mongoose.disconnect();
    }
  });

  it('should sign up the model', async () => {
    await modelSignUp({
      Model: UserModel,
      variables: { email: 'sajad.ghawami@codestra.io', password: '123123' },
      onCompleted: ({ _id }) => {
        expect(_id).toBe(_id);
      },
    });
  });
});
