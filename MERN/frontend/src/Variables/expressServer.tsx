const isServerEnvironment = process.env.NODE_ENV !== 'production';

export const expressURL = isServerEnvironment ? 'http://localhost:5000/api' : 'https://johncagetribute.org/api';