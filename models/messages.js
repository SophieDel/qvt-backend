const mongoose = require("mongoose");

//Tableau de sous documents pour acceuillir les messages envoyés
const MessageSchema = mongoose.Schema({
  dateRecep: Date,
  message: String,
  collab: String,
  dateReponse: Date,
  reponse: String,
  equipe: String,
  repondu: Boolean,
});

const Message = mongoose.model("messages", MessageSchema);

module.exports = Message;
