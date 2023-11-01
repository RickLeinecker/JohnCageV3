const isServerEnvironment = process.env.NODE_ENV === 'production';

const expressURL = isServerEnvironment ? 'http://johncagetribute.org/api' : 'http://localhost:5000/api';

const buildPath = function buildPath(route: String) {
    return expressURL + route;
}

export { buildPath, expressURL };