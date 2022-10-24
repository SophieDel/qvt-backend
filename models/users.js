const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  genre : String,
  nom : String,
  prenom : String,
  email : String,
  mdp : String,
  token: String,
  //datenaissance : Date,
  manager : Boolean,
  poste : String,
  service : String,
  equipe : String,
  RGPDqvt : Boolean,
  RGPDParternaire : Boolean,
  cgu: Boolean,
 // questionnaire: { type: mongoose.Schema.Types.ObjectId, ref: 'questionnaires' },
  });

const User = mongoose.model('users', userSchema);

module.exports = User;