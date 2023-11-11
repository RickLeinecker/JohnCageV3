import extractJWT from './middleware.extractJWT';
import checkDuplicateUsernameOrEmail from './middleware.verifyRegister';

// Export ALL middleware functions to make them importable, then callable in any file.
export const Middleware = {
  extractJWT,
  checkDuplicateUsernameOrEmail,
};
