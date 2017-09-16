const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const faker = require('faker');
const mongoose = require('mongoose');



const {DATABASE_URL} = require('../config');
const {Sailboat} = require('../models');
const {closeServer, runServer, app} = require('../server');
const {TEST_DATABASE_URL} = require('../config');


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
      owner: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      },
      name: faker.name.firstName(),
      discription: faker.lorem.sentence(),
      content: faker.lorem.text()
    });
  }
  // this will return a promise
  return Sailboat.insertMany(seedData);
}


describe('Sailboat server resource', function() {

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

    it('simple get should work', function() {
      let res;
      return chai.request(app)
        .get('/')
        .then(_res => {
          res = _res;
          res.should.have.status(200);
        })
    });

    it('should return sailboats in database', function() {
      let res;
      return chai.request(app)
        .get('/')
        .then(_res => {
          res = _res;
          res.should.have.status(200);
        })
    });

    it('should return all existing sailboats', function() {
      let res;
      return chai.request(app)
        .get('/sailboats')
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
});

