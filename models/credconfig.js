const mongoose = require('mongoose');
const { Schema } = mongoose;

const credSchema = new Schema({
  rabbiturl: {
    type: String,
    required: true,
    trim: true
  },
  rabbitusername: {
    type: String,
    required: true,
    trim: true
  },
  rabbitpassword: {
    type: String,
    required: true,
    trim: true
  },
  googleapi: {
    type: String,
    required: true,
    trim: true
  },

}, {
  timestamps: true
});

const CredConfig = mongoose.model('CredConfig', credSchema);

module.exports = CredConfig;
