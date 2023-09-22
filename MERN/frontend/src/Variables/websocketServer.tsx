const isServerEnvironment = process.env.NODE_ENV !== 'production';

export const websocketURL = isServerEnvironment ? 'ws://localhost' : 'ws://johncagetribute.org';