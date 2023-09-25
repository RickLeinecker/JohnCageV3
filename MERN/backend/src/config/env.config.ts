const isServerEnvironment = process.env.NODE_ENV !== 'production';

const socketCORS = isServerEnvironment ? 'http://localhost:3000' : 'https://johncagetribute.org';

export { socketCORS, isServerEnvironment };