const isServerEnvironment = process.env.NODE_ENV !== 'production';

export const socketURL = isServerEnvironment ? 'http://localhost:5001' : 'https://johncagetribute.org';