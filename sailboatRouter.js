const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const {Sailboat} = require('./models');


router.get('/', (req, res) => {
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

router.post('/', (req, res) => {
  const requiredFields = ['first', 'last'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body.owner)) {
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
      discription: req.body.discription,
      year: req.body.year,
      condition: req.body.condition,
      visible: req.body.visible,
      forSale: req.body.forSale
    })
    .then(Sailboat => res.status(201).json(Sailboat.simpleSailboat()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Something went wrong'});
  });
});




module.exports = router;