global.DATABASE_URL = 'mongodb://localhost/jwt-auth-demo-test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const {app, runServer, closeServer} = require('../server');
const {User} = require('../users');
const {JWT_SECRET} = require('../config');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('/user', function() {
    const username = 'exampleUser';
    const password = 'examplePass';
    const name = 'Example';
    const usernameB = 'exampleUserB';
    const passwordB = 'examplePassB';
    const nameB = 'ExampleB';

    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    beforeEach(function() {});

    afterEach(function() {
        return User.remove({});
    });

    describe('/users', function() {
        describe('POST', function() {
            it('Should reject users with missing username', function() {
                return chai
                    .request(app)
                    .post('/users')
                    .send({
                        password,
                        name
                    })
                    .then(() =>
                        expect.fail(null, null, 'Request should not succeed')
                    )
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }

                        const res = err.response;
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('Missing field');
                        expect(res.body.location).to.equal('username');
                    });
            });
            it('Should reject users with missing password', function() {
                return chai
                    .request(app)
                    .post('/users')
                    .send({
                        username,
                        name
                    })
                    .then(() =>
                        expect.fail(null, null, 'Request should not succeed')
                    )
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }

                        const res = err.response;
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('Missing field');
                        expect(res.body.location).to.equal('password');
                    });
            });
            it('Should reject users with non-string username', function() {
                return chai
                    .request(app)
                    .post('/users')
                    .send({
                        username: 1234,
                        password,
                        name
                    })
                    .then(() =>
                        expect.fail(null, null, 'Request should not succeed')
                    )
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }

                        const res = err.response;
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal(
                            'Incorrect field type: expected string'
                        );
                        expect(res.body.location).to.equal('username');
                    });
            });
            it('Should reject users with non-string password', function() {
                return chai
                    .request(app)
                    .post('/users')
                    .send({
                        username,
                        password: 1234,
                        name
                    })
                    .then(() =>
                        expect.fail(null, null, 'Request should not succeed')
                    )
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }

                        const res = err.response;
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal(
                            'Incorrect field type: expected string'
                        );
                        expect(res.body.location).to.equal('password');
                    });
            });
            it('Should reject users with non-string name', function() {
                return chai
                    .request(app)
                    .post('/users')
                    .send({
                        username,
                        password,
                        name: 1234,
                    })
                    .then(() =>
                        expect.fail(null, null, 'Request should not succeed')
                    )
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }

                        const res = err.response;
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal(
                            'Incorrect field type: expected string'
                        );
                        expect(res.body.location).to.equal('name');
                    });
            });
            it('Should reject users with non-trimmed username', function() {
                return chai
                    .request(app)
                    .post('/users')
                    .send({
                        username: ` ${username} `,
                        password,
                        name
                    })
                    .then(() =>
                        expect.fail(null, null, 'Request should not succeed')
                    )
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }

                        const res = err.response;
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal(
                            'Cannot start or end with whitespace'
                        );
                        expect(res.body.location).to.equal('username');
                    });
            });
            it('Should reject users with non-trimmed password', function() {
                return chai
                    .request(app)
                    .post('/users')
                    .send({
                        username,
                        password: ` ${password} `,
                        name
                    })
                    .then(() =>
                        expect.fail(null, null, 'Request should not succeed')
                    )
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }

                        const res = err.response;
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal(
                            'Cannot start or end with whitespace'
                        );
                        expect(res.body.location).to.equal('password');
                    });
            });
            it('Should reject users with empty username', function() {
                return chai
                    .request(app)
                    .post('/users')
                    .send({
                        username: '',
                        password,
                        name
                    })
                    .then(() =>
                        expect.fail(null, null, 'Request should not succeed')
                    )
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }

                        const res = err.response;
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal(
                            'Must be at least 1 characters long'
                        );
                        expect(res.body.location).to.equal('username');
                    });
            });
            it('Should reject users with password less than four characters', function() {
                return chai
                    .request(app)
                    .post('/users')
                    .send({
                        username,
                        password: '123',
                        name
                    })
                    .then(() =>
                        expect.fail(null, null, 'Request should not succeed')
                    )
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }

                        const res = err.response;
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal(
                            'Must be at least 4 characters long'
                        );
                        expect(res.body.location).to.equal('password');
                    });
            });
            it('Should reject users with password greater than 72 characters', function() {
                return chai
                    .request(app)
                    .post('/users')
                    .send({
                        username,
                        password: new Array(73).fill('a').join(''),
                        name
                    })
                    .then(() =>
                        expect.fail(null, null, 'Request should not succeed')
                    )
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }

                        const res = err.response;
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal(
                            'Must be at most 72 characters long'
                        );
                        expect(res.body.location).to.equal('password');
                    });
            });
            it('Should reject users with duplicate username', function() {
                // Create an initial user
                return User.create({
                    username,
                    password,
                    name
                })
                    .then(() =>
                        // Try to create a second user with the same username
                        chai.request(app).post('/users').send({
                            username,
                            password,
                            name
                        })
                    )
                    .then(() =>
                        expect.fail(null, null, 'Request should not succeed')
                    )
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }

                        const res = err.response;
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal(
                            'Username already taken'
                        );
                        expect(res.body.location).to.equal('username');
                    });
            });
            it('Should create a new user', function() {
                return chai
                    .request(app)
                    .post('/users')
                    .send({
                        username,
                        password,
                        name
                    })
                    .then(res => {
                        expect(res).to.have.status(201);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.keys(
                            'username',
                            'name'
                        );
                        expect(res.body.username).to.equal(username);
                        expect(res.body.name).to.equal(name);
                        return User.findOne({
                            username
                        });
                    })
                    .then(user => {
                        expect(user).to.not.be.null;
                        expect(user.name).to.equal(name);
                        return user.validatePassword(password);
                    })
                    .then(passwordIsCorrect => {
                        expect(passwordIsCorrect).to.be.true;
                    });
            });
            it('Should trim name', function() {
                return chai
                    .request(app)
                    .post('/users')
                    .send({
                        username,
                        password,
                        name: ` ${name} `
                    })
                    .then(res => {
                        expect(res).to.have.status(201);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.keys(
                            'username',
                            'name'
                        );
                        expect(res.body.username).to.equal(username);
                        expect(res.body.name).to.equal(name);
                        return User.findOne({
                            username
                        });
                    })
                    .then(user => {
                        expect(user).to.not.be.null;
                        expect(user.name).to.equal(name);
                    });
            });
        });

        describe('GET', function() {
            it('Should return an empty array initially', function() {
                return chai.request(app).get('/users').then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.length(0);
                });
            });
            it('Should return an array of users', function() {
                return User.create(
                    {
                        username,
                        password,
                        name
                    },
                    {
                        username: usernameB,
                        password: passwordB,
                        name: nameB
                    }
                )
                    .then(() => chai.request(app).get('/users'))
                    .then(res => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('array');
                        expect(res.body).to.have.length(2);
                        expect(res.body[0]).to.deep.equal({
                            username,
                            name
                        });
                        expect(res.body[1]).to.deep.equal({
                            username: usernameB,
                            name: nameB
                        });
                    });
            });
        });
    });
});
