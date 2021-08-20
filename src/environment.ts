/**
 * Get the environment
 */

const { JWT_SECRET, JWT_EXPIRES, PASSWORD_RESET_EXPIRES, NODE_ENV } = process.env;

export const initEnvironment = () => {
  if (!JWT_SECRET || !JWT_EXPIRES || !PASSWORD_RESET_EXPIRES) {
    throw new Error('Please define all the environment variables JWT_SECRET, JWT_EXPIRES and PASSWORD_RESET_EXPIRES');
  }
};
initEnvironment();

export { JWT_SECRET, JWT_EXPIRES, PASSWORD_RESET_EXPIRES, NODE_ENV };
