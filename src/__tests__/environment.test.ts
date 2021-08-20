describe('environment', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = {};
  });

  it('should throw an error if not all environment variables JWT_SECRET, JWT_EXPIRES and PASSWORD_RESET_EXPIRES have been set', async () => {
    process.env = {
      JWT_SECRET: 'test',
      JWT_EXPIRES: 'test',
      // PASSWORD_RESET_EXPIRES:''
    };

    try {
      var initEnvironment = require('../environment').initEnvironment;
      initEnvironment();
    } catch (e) {
      expect(e.message).toEqual(
        'Please define all the environment variables JWT_SECRET, JWT_EXPIRES and PASSWORD_RESET_EXPIRES',
      );
    }
  });

  it('should not throw an error if any of the required environments have been set', async () => {
    process.env = {
      JWT_SECRET: 'test',
      JWT_EXPIRES: 'test',
      PASSWORD_RESET_EXPIRES: 'test',
    };

    var initEnvironment = require('../environment').initEnvironment;
    var { JWT_SECRET, JWT_EXPIRES, PASSWORD_RESET_EXPIRES } = require('../environment');
    initEnvironment();

    expect(JWT_SECRET).toEqual('test');
    expect(JWT_EXPIRES).toEqual('test');
    expect(PASSWORD_RESET_EXPIRES).toEqual('test');
  });
});
