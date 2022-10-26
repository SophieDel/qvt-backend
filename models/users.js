const mongoose = require('mongoose');

//Tableau de sous documents pour acceuillir les résultats des questionnaires hebdo
const QHebdoSchema = mongoose.Schema ({
  Q1 : Number,
  Q2 : Number,
  Q3 : Number,
});


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
  QHebdo : [QHebdoSchema],
  });








const User = mongoose.model('users', userSchema);

module.exports = User;