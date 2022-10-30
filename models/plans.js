const mongoose = require("mongoose");

//Tableau de sous documents pour acceuillir les Plans d'action
const PlanSchema = mongoose.Schema ({
    datePlan : Date,
    titre : String,    
    message : String,
    equipe : String,
    encours : Boolean,
  });

  
const Plan = mongoose.model('plans', PlanSchema);

module.exports = Plan;