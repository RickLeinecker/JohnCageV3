import crypto from 'crypto';
import { users } from '../models/users';

const getVerifyEmailToken = function(user: users): string {
    // Create a long random string (128 characters) with a crypto library.
    const verifyEmailToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to VerificationCode attribute in the database.
    // user.VerificationCode = crypto
    //     .createHash('sha256')
    //     .update(verifyEmailToken)
    //     .digest('hex');

    // Todo: Set token to expire after 6 hours

    return verifyEmailToken;
};

export default getVerifyEmailToken;