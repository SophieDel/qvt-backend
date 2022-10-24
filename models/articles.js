const mongoose = require("mongoose");

const articleSchema = mongoose.Schema({
  theme: String,
  titre: String,
  contenu: String,
  illustration: String,
});

const Article = mongoose.model("articles", articleSchema);

module.exports = Article;
