const mongoose = require('mongoose');

const sailboatSchema = mongoose.Schema({
  owner: {required: true, type: String},
  name: String,
  description: String, 
  year: String, 
  condition: String,
  state: String,
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
    state: this.state,
    picture: this.picture
  };
}

const Sailboat = mongoose.model('Sailboat', sailboatSchema);
//for test purposes

module.exports = {Sailboat};