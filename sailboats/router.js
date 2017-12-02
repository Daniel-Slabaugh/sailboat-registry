const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const passport = require('passport');

const {Sailboat} = require('./models');


router.get('/',
  passport.authenticate('jwt', {session: false}), 
  (req, res) => {
  Sailboat
    .find()
    .exec()
    .then(posts => {
      res.status(200).json(posts.map(post => post.simpleSailboat()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong'});
    });
});

router.post('/',
  passport.authenticate('jwt', {session: false}), 
  (req, res) => {
  const requiredFields = ['owner', 'name', 'description'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  Sailboat
    .create({
      owner: req.body.owner,
      address: req.body.address,
      name: req.body.name,
      description: req.body.description,
      year: req.body.year,
      condition: req.body.condition,
    })
    .then(Sailboat => res.status(201).json(Sailboat.simpleSailboat()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Something went wrong'});
  });
});

router.put('/:id',
  passport.authenticate('jwt', {session: false}), 
  (req, res) => {
  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    res.status(400).json({message: message});
  }

  const toUpdate = {};
  const updateableFields = ['address', 'name', 'description', 'year', 'condition'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Sailboat
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .exec()
    .then(sailboat => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.delete('/:id',
  passport.authenticate('jwt', {session: false}), 
  (req, res) => {
  Sailboat
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(sailboat => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {router};