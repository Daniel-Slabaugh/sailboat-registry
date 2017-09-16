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




module.exports = router;