const mongoose = require('mongoose');

const sailboatSchema = mongoose.Schema({
  owner: {
    first: {type: String, required: true},
    last: {type: String, required: true},
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  name: String,
  discription: String, 
  year: Date, 
  condition: String,
  visible: Boolean, 
  forSale: Boolean
});

sailboatSchema.virtual('ownerName').get(function() {
  return `${this.owner.first} ${this.owner.last}`.trim();
});

sailboatSchema.virtual('addressString').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state}, ${this.address.zipcode}, ${this.address.country}`;
});

sailboatSchema.methods.simpleSailboat = function() {
  return {
    id: this._id,
    owner: this.ownerName,
    address: this.addressString,
    name: this.name,
    discription: this.discription, 
    year: this.year, 
    condition: this.condition,
    visible: this.visible, 
    forSale: this.forSale
  };
}

const Sailboat = mongoose.model('Sailboat', sailboatSchema);
//for test purposes

module.exports = {Sailboat};
