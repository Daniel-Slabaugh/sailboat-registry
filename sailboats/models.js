const mongoose = require('mongoose');

const sailboatSchema = mongoose.Schema({
  owner: {required: true, type: String},
  state: String,
  name: String,
  description: String, 
  year: String, 
  condition: String,
  forSale: Boolean,
  picture: String
});


sailboatSchema.methods.simpleSailboat = function() {
  return {
    id: this._id,
    owner: this.owner,
    state: this.state,
    name: this.name,
    description: this.description, 
    year: this.year, 
    condition: this.condition,
    forSale: this.forSale,
    picture: this.picture
  };
}

const Sailboat = mongoose.model('Sailboat', sailboatSchema);
//for test purposes

module.exports = {Sailboat};