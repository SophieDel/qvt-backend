const mongoose = require('mongoose');

// Réponses par thème
const questionnairePersoSchema = mongoose.Schema({
  sante: { type : Array , "default" : [] },
  conditions: { type : Array , "default" : [] },
  epanouissement: { type : Array , "default" : [] },
stress: { type : Array , "default" : [] },
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
 questionnairePerso: questionnairePersoSchema,
  });

const User = mongoose.model('users', userSchema);

module.exports = User;