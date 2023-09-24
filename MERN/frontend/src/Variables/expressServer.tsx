const isServerEnvironment = process.env.NODE_ENV === 'production';

const expressURL = isServerEnvironment ? 'https://johncagetribute.org/api' : 'http://localhost:5000/api';

const buildPath = function buildPath(route: String) {
    return expressURL + route;
}

export { buildPath, expressURL };