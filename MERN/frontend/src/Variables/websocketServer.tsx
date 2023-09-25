const isServerEnvironment = process.env.NODE_ENV === 'production';

export const websocketURL = isServerEnvironment ? 'wss://johncagetribute.org' : 'ws://localhost';