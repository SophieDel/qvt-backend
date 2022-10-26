const mongoose = require("mongoose");

const questionnairePersoSchema = mongoose.Schema({
  // Questions liées à la santé
  Q11: String,
  Q13: String,
  Q14: String,
  Q15: String,
  Q20: String,
  Q21: String,
  // Questions liées aux conditions de travail
  // horaires
  Q5: String,
  Q6: String,
  Q7: String,
  // Lieu
  Q35: String,
  Q38: String,
  Q39: String,
  // Questions liées à l'épanouissement au travail
  Q41: String,
  Q42: String,
  Q43: String,
  Q46: String,
  Q47: String,
  // Questions liées au stress
  Q24: String,
  Q25: String,
  Q26: String,
  Q29: String,
  Q31: String,
  Q34: String,
});

//Tableau de sous documents pour acceuillir les résultats des questionnaires hebdo
const QHebdoSchema = mongoose.Schema ({
  Q1 : Number,
  Q2 : Number,
  Q3 : Number,
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
 // questionnaire: { type: mongoose.Schema.Types.ObjectId, ref: 'questionnaires' },

  questionnairePerso: questionnairePersoSchema,
  QHebdo : [QHebdoSchema],
  });



const User = mongoose.model('users', userSchema);

module.exports = User;
