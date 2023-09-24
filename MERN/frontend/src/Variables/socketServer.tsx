const isServerEnvironment = process.env.NODE_ENV === 'production';

export const socketURL = isServerEnvironment ? 'https://johncagetribute.org' : 'http://localhost:5001';