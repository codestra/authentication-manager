// Augmentations for the global scope can only be directly nested
// in external modules or ambient module declarations.
export {};

export interface IEnvironment {
  JWT_SECRET?: string;
  JWT_EXPIRES?: string;
  PASSWORD_RESET_EXPIRES?: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends IEnvironment {}
  }
}
