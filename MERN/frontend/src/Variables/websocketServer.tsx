const isServerEnvironment = process.env.NODE_ENV !== 'production';

export const websocketURL = isServerEnvironment ? 'ws://localhost' : 'wss://johncagetribute.org';