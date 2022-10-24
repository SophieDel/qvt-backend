const mongoose = require("mongoose");

const articleSchema = mongoose.Schema({
  theme: String,
  titre: String,
  resume: String,
  illustration: String,
  lien: String
});

const Article = mongoose.model("articles", articleSchema);

module.exports = Article;
