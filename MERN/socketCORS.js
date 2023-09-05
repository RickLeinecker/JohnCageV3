const isServerEnvironment = process.env.NODE_ENV !== 'production';

module.exports = {
    const: socketCORS = isServerEnvironment ? 'http://localhost:3000' : 'https://johncagetribute.org'
};
