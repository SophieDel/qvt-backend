const mongoose = require("mongoose");

const questionnairePersoSchema = mongoose.Schema({ type: Array, default: [] });

//Tableau de sous documents pour acceuillir les résultats des questionnaires hebdo
const QHebdoSchema = mongoose.Schema({
  semaine: Number,
  Q1: Number,
  Q2: Number,
  Q3: Number,
});

const userSchema = mongoose.Schema({
  genre: String,
  nom: String,
  prenom: String,
  email: String,
  mdp: String,
  token: String,
  //datenaissance : Date,
  manager: Boolean,
  poste: String,
  service: String,
  equipe: String,
  RGPDqvt: Boolean,
  RGPDParternaire: Boolean,
  cgu: Boolean,
  QHebdo: [QHebdoSchema],
  // questionnairePerso: questionnairePersoSchema,
  // dans le MVP on fait sans sous-document, car il n'y a qu'un seul questionnaire perso rempli par utilisateur
  questionnairePerso: { type: Array, default: [] },
  profil: String,
});

const User = mongoose.model("users", userSchema);

module.exports = User;
