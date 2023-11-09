import dotenv from 'dotenv';

dotenv.config();

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 1337;

const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 3600;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || 'coolIssuer';
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || 'superencryptedsecret';

// Send Email for verification of users email
const SMTP_HOST='smtp.postmarkapp.com'
const SMTP_PORT=2525
const SMTP_EMAIL='PM-T-outbound-r5dMd8U4nO3imiUiZqnAxV'
const SMTP_PASSWORD='kh7RXzJjMibm0H5T0EaiVt1GyIDoyDN0ZFhA'
const FROM_EMAIL='demetrik@knights.ucf.edu'
const FROM_NAME='JohnCageTribute'

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    token: {
        expireTime: SERVER_TOKEN_EXPIRETIME,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET
    }
};

export const SMTP = {
    host: SMTP_HOST,
    port: SMTP_PORT,
    email: SMTP_EMAIL,
    password: SMTP_PASSWORD,
    fromEmail: FROM_EMAIL,
    fromName: FROM_NAME,
}

const config = {
    server: SERVER
};

export default config;