const mongoose = require('mongoose');

const sailboatSchema = mongoose.Schema({
  owner: {required: true, type: String},
  address: {
    street: String,
    city: String,
    state: String,
    zipcode: String,
  },
  name: String,
  description: String, 
  year: String, 
  condition: String,
  forSale: Boolean,
  picture: String
});

sailboatSchema.virtual('addressString').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state}, ${this.address.zipcode}`;
});

sailboatSchema.methods.simpleSailboat = function() {
  return {
    id: this._id,
    owner: this.owner,
    address: this.addressString,
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