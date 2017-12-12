const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const faker = require('faker');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const {DATABASE_URL} = require('../config');
const {Sailboat} = require('../sailboats');
const {closeServer, runServer, app} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const {JWT_SECRET} = require('../config');
const {User} = require('../users');

chai.use(chaiHttp);

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err))
  });
}

function seedSailboatData() {
  console.info('seeding sailboat data');
  const seedData = [];
  for (let i=1; i<=10; i++) {
    seedData.push({
      owner: faker.name.firstName(),
      state: faker.address.state(),
      name: faker.name.firstName(),
      description: faker.lorem.sentence(),
      condition: faker.random.words(),
      year: faker.date.past(),
    });
  }
  // this will return a promise
  return Sailboat.insertMany(seedData);
}

describe('Sailboat server resource', function() {
  const username = 'exampleUser';
  const password = 'examplePass';
  const name = 'User';    
  const token = jwt.sign(
    {
      user: {
        username,
        name
      }
    },
    JWT_SECRET,
    {
      algorithm: 'HS256',
      subject: username,
      expiresIn: '7d'
    }
  );

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedSailboatData();
  });

  afterEach(function() {
    // tear down database so we ensure no state from this test
    // effects any coming after.
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe('GET endpoint', function() {
    it('should return all existing sailboats', function() {
      let res;
      return chai
        .request(app)
        .get('/sailboats')
        .set('authorization', `Bearer ${token}`)
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          // otherwise our db seeding didn't work
          res.body.should.have.length.of.at.least(1);

          return Sailboat.count();
        })
        .then(count => {
          // the number of returned posts should be same
          // as number of posts in DB
          res.body.should.have.length(count);
        });
    });
  });

  describe('POST endpoint', function() {

    it('should add a new sailboat', function() {

      const newSailboat =  {     
        owner: faker.name.firstName(),
        state: faker.address.state(),
        name: faker.random.words(),
        description: faker.lorem.sentence(),
        condition: faker.random.words(),
        year: faker.date.past(),
      }

      return chai.request(app)
        .post('/sailboats')
        .set('authorization', `Bearer ${token}`)
        .send(newSailboat)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys('id', 'owner', 'state', 'name', 'description', 'condition', 'year');
          res.body.owner.should.equal(newSailboat.owner)
          res.body.id.should.not.be.null;
          res.body.name.should.equal(newSailboat.name);
          res.body.description.should.equal(newSailboat.description);

          return Sailboat.findById(res.body.id);
        })
        .then(function(sailboat) {
          sailboat.owner.should.equal(newSailboat.owner);
          sailboat.state.should.equal(newSailboat.state);
          sailboat.name.should.equal(newSailboat.name);
          sailboat.description.should.equal(newSailboat.description);
          sailboat.condition.should.equal(newSailboat.condition);
        });
    });
  });

  describe('PUT endpoint', function() {

    it('should update fields you send over', function() {
      const updateData = {
        state: faker.address.state(),
        name: faker.name.firstName(),
        description: faker.lorem.sentence(),
        condition: faker.random.words(), 
      };

      return Sailboat
        .findOne()
        .exec()
        .then(function(sailboat) {
          updateData.id = sailboat.id;

          return chai
            .request(app)
            .put(`/sailboats/${sailboat.id}`)
            .set('authorization', `Bearer ${token}`)
            .send(updateData);
        })
        .then(function(res) {
          res.should.have.status(204);

          return Sailboat.findById(updateData.id).exec();
        })
        .then(function(sailboat) {
          sailboat.state.should.equal(updateData.state);
          sailboat.name.should.equal(updateData.name);
          sailboat.description.should.equal(updateData.description);
          sailboat.condition.should.equal(updateData.condition);
        });
    });
  });

  describe('DELETE endpoint', function() {
    // strategy:
    //  1. get a restaurant
    //  2. make a DELETE request for that restaurant's id
    //  3. assert that response has right status code
    //  4. prove that restaurant with the id doesn't exist in db anymore
    it('delete a sailboat by id', function() {

      let sailboat;

      return Sailboat
        .findOne()
        .exec()
        .then(function(_sailboat) {
          sailboat = _sailboat;
          return chai
            .request(app)
            .delete(`/sailboats/${sailboat.id}`)
            .set('authorization', `Bearer ${token}`);
        })
        .then(function(res) {
          res.should.have.status(204);
          return Sailboat
            .findById(sailboat.id)
            .exec();
        })
        .then(function(_sailboat) {
          // when a variable's value is null, chaining `should`
          // doesn't work. so `_restaurant.should.be.null` would raise
          // an error. `should.be.null(_restaurant)` is how we can
          // make assertions about a null value.
          should.not.exist(_sailboat);
        });
    });
  });
});

