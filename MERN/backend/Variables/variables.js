const isServerEnvironment = process.env.NODE_ENV !== 'production';

module.exports = {
    socketCORS: string = isServerEnvironment ? 'http://localhost:3000' : 'https://johncagetribute.org'
};
