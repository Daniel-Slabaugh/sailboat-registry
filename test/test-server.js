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
        first: faker.name.firstName(),
        last: faker.name.lastName()
      },
      address: {
        street: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
        zipcode: faker.address.zipCode(),
        country: faker.address.country()
      },
      name: faker.name.firstName(),
      discription: faker.lorem.sentence(),
      condition: faker.random.words(),
      year: faker.date.past(),
      visible: faker.random.boolean(),
      forSale: faker.random.boolean()
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

    // it('simple get should work', function() {
    //   let res;
    //   return chai.request(app)
    //     .get('/')
    //     .then(_res => {
    //       res = _res;
    //       res.should.have.status(200);
    //     })
    // });



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

  describe('POST endpoint', function() {

    it('should add a new sailboat', function() {

      const newSailboat =  {     
        owner: {
          first: faker.name.firstName(),
          last: faker.name.lastName()
        },
        address: {
          street: faker.address.streetAddress(),
          city: faker.address.city(),
          state: faker.address.state(),
          zipcode: faker.address.zipCode(),
          country: faker.address.country()
        },
        name: faker.random.words(),
        discription: faker.lorem.sentence(),
        condition: faker.random.words(),
        year: faker.date.past(),
        visible: faker.random.boolean(),
        forSale: faker.random.boolean()
      }

      return chai.request(app)
        .post('/sailboats')
        .send(newSailboat)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys('id', 'owner', 'address', 'name', 'discription', 'condition', 'year', 'visible', 'forSale');
          res.body.owner.should.equal(
            `${newSailboat.owner.first} ${newSailboat.owner.last}`);
          res.body.id.should.not.be.null;
          res.body.name.should.equal(newSailboat.name);
          res.body.discription.should.equal(newSailboat.discription);

          return Sailboat.findById(res.body.id);
        })
        .then(function(sailboat) {
          sailboat.owner.first.should.equal(newSailboat.owner.first);
          sailboat.owner.last.should.equal(newSailboat.owner.last);
          // sailboat.address.should.equal(newSailboat.address);
          sailboat.name.should.equal(newSailboat.name);
          sailboat.discription.should.equal(newSailboat.discription);
          sailboat.condition.should.equal(newSailboat.condition);
          sailboat.visible.should.equal(newSailboat.visible);
          sailboat.forSale.should.equal(newSailboat.forSale);
        });
    });
  });


  });
});

