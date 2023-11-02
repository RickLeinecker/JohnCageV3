// File used for unit testing Express API

// Testing
const supertest = require('supertest');
const { expressServerInstance } = require('./express.ts');
const api = supertest(expressServerInstance.expressApp);

// Tests
describe('helloWorld', () => {
    test('/api/', async () => {

        //API call and expectations
        var response = await api
            .get('/api/')
            .expect(200)
        // .then(() => {
        //     var stringifiedJSON = JSON.stringify(response);
        //     var rawJSON = JSON.parse(stringifiedJSON);
        //     var stringifiedResponse = rawJSON.text;
        //     var JSONResponse = JSON.parse(stringifiedResponse);
        //     console.log(JSONResponse["message"]);
        // }
        //  );




    });
});

describe('searchSongs', () => {
    test('/api/', async () => {

        //API call and expectations
        var response = await api
            .get('/api/concerts/searchSongs?search=&page=0')
            .expect(200)
        // .then(() => {
        //     var stringifiedJSON = JSON.stringify(response);
        //     var rawJSON = JSON.parse(stringifiedJSON);
        //     var stringifiedResponse = rawJSON.text;
        //     var JSONResponse = JSON.parse(stringifiedResponse);
        //     console.log(JSONResponse);
        // }
        // );


    });
});

describe('Login with invalid credentials.', () => {
    test('Login', async () => {
        //To send
        const validLogin = {
            identifier: "tester",
            password: "greg2"
        }

        //API call and expectations
        var response = await api
            .post('/api/users/login')
            .send(validLogin)
            .expect(401)
            .expect('Content-Type', /application\/json/)


        //Convert response to readable JSON
        var stringifiedJSON = JSON.stringify(response);
        var rawJSON = JSON.parse(stringifiedJSON);
        var stringifiedResponse = rawJSON.text;
        var JSONResponse = JSON.parse(stringifiedResponse);

        //JSON response expectations
        expect(response).toBeDefined();
        expect(JSONResponse).toEqual({message: "Invalid Password."});

    })
})

describe('Login with valid credentials.', () => {
    test('Login', async () => {
        //To send
        const validLogin = {
            identifier: "tester",
            password: "greg"
        }

        //API call and expectations
        var response = await api
            .post('/api/users/login')
            .send(validLogin)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
})

describe('Returns all users.', () => {
    test('Search Exercises', async () => {
        await api
            .get('/api/users/findAll')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
})

describe('Create a new user.', () => {
    test('Create User', async () => {
        //To send
        const validUser = {
            UserName: "tester2",
            Email: "tester2@gmail.com",
            Password: "greg2"
        }

        //API call and expectations
        var response = await api
            .post('/api/users/register')
            .send(validUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    })
})

/*

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