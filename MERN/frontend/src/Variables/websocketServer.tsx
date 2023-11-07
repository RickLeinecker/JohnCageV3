const isServerEnvironment = process.env.NODE_ENV === 'production';

export const websocketURL = isServerEnvironment ? 'ws://johncagetribute.org:8080' : 'ws://localhost:8080';