const mongoose = require("mongoose");

const entrepriseSchema = mongoose.Schema({
nomentreprise : String

});

const Entreprise = mongoose.model("entreprises", entrepriseSchema);

module.exports = Entreprise;


// non utilisé pour le moment