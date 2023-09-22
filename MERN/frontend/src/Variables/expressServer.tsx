const isServerEnvironment = process.env.NODE_ENV !== 'production';

const expressURL = isServerEnvironment ? 'http://localhost:5000/api' : 'https://johncagetribute.org/api';

const buildPath = function buildPath(route: String) {
    return expressURL + route;
}

export { buildPath, expressURL };