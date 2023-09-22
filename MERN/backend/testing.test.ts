// File used for unit testing Express API

// Testing
const supertest = require('supertest');
const { expressServerInstance } = require('./backend.ts');
const api = supertest(expressServerInstance.expressApp);

// Tests
describe('helloWorld', () => {
    test('/api/', async () => {

        //API call and expectations
        var response = await api
            .get('/api/')
            .expect(200)

        var stringifiedJSON = JSON.stringify(response);
        var rawJSON = JSON.parse(stringifiedJSON);
        var stringifiedResponse = rawJSON.text;
        var JSONResponse = JSON.parse(stringifiedResponse);
        console.log(JSONResponse["message"]);
    })
})

describe('searchSongs', () => {
    test('/api/', async () => {

        //API call and expectations
        var response = await api
            .get('/api/concerts/searchSongs')
            .expect(200)

        var stringifiedJSON = JSON.stringify(response);
        var rawJSON = JSON.parse(stringifiedJSON);
        var stringifiedResponse = rawJSON.text;
        var JSONResponse = JSON.parse(stringifiedResponse);
        console.log(JSONResponse);
    })
})











/*
describe('Login with invalid credentials.', () => {
    test('Login', async () => {
        //To send
        const validLogin = {
            login: "Kyle",
            password: "11111111"
        }

        //API call and expectations
        var response = await api
            .post('/api/login')
            .send(validLogin)
            .expect(200)
            .expect('Content-Type', /application\/json/)


        //Convert response to readable JSON
        var stringifiedJSON = JSON.stringify(response);
        var rawJSON = JSON.parse(stringifiedJSON);
        var stringifiedResponse = rawJSON.text;
        var JSONResponse = JSON.parse(stringifiedResponse);
        console.log(JSONResponse["id"]);

        //JSON response expectations
        expect(response).toBeDefined();
        expect(JSONResponse["id"]).toBe(-1);

    })
})

describe('Login with valid credentials.', () => {
    test('Login', async () => {
        //To send
        const validLogin = {
            login: "zxc",
            password: "11111111"
        }

        //API call and expectations
        var response = await api
            .post('/api/login')
            .send(validLogin)
            .expect(200)
            .expect('Content-Type', /application\/json/)


        //Convert response to readable JSON
        var stringifiedJSON = JSON.stringify(response);
        var rawJSON = JSON.parse(stringifiedJSON);
        var stringifiedResponse = rawJSON.text;
        var JSONResponse = JSON.parse(stringifiedResponse);
        console.log(JSONResponse["id"]);

        //JSON response expectations
        expect(response).toBeDefined();
        expect(JSONResponse["id"]).not.toBe(-1);

    })
})

test('Search Exercises', async () => {
    await api
        .post('/api/register')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('Replace Exercises', async () => {
    await api
        .post('/api/login')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('Reset Password', async () => {
    await api
        .post('/api/register')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('Change Password', async () => {
    await api
        .post('/api/login')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('Populate Table', async () => {
    await api
        .post('/api/register')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('Autofill Routines', async () => {
    await api
        .post('/api/login')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

*/