const mongoose = require('mongoose');

const sailboatSchema = mongoose.Schema({
  owner: {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  description: String, 
  year: Number, 
  condition: String,
  visible: Boolean, 
  forSale: Boolean, 
});


blogPostSchema.virtual('ownerName').get(function() {
  return `${this.owner.firstName} ${this.owner.lastName}`.trim();
});

blogPostSchema.virtual('addressString').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state}, ${this.address.zipcode}, ${this.address.country}`;
});

blogPostSchema.methods.simpleSailboat = function() {
  return {
    id: this._id,
    owner: this.ownerName,
    address: this.addressString,
    description: this.description, 
    year: this.year, 
    condition: this.condition,
    visible: this.visible, 
    forSale: this.forSale
  };
}

const Sailboat = mongoose.model('Sailboat', blogPostSchema);
//for test purposes

module.exports = {Sailboat};
