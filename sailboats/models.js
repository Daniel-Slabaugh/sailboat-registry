const mongoose = require('mongoose');

const sailboatSchema = mongoose.Schema({
  owner: {required: true, type: String},
  address: {
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  name: String,
  description: String, 
  year: Date, 
  condition: String,
  forSale: Boolean
});

sailboatSchema.virtual('addressString').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state}, ${this.address.zipcode}, ${this.address.country}`;
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
    forSale: this.forSale
  };
}

const Sailboat = mongoose.model('Sailboat', sailboatSchema);
//for test purposes

module.exports = {Sailboat};
