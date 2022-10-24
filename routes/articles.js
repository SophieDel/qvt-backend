var express = require("express");
var router = express.Router();
const { checkBody } = require('../modules/checkBody');

const Article = require("../models/articles");

router.post("/new", (req, res) => {
  // Par cette route on ajoute un nouvel article dans la base de données

  if (
    !checkBody(req.body, ["titre", "theme", "resume", "illustration", "lien"])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const newArticle = new Article({
    titre: req.body.titre,
    theme: req.body.theme,
    resume: req.body.resume,
    illustration: req.body.illustration,
    lien: req.body.lien,
  });

  newArticle
    .save()
    .then(data => res.json({ result: true, article: data }))
    .catch((error) => req.json({ result: false, error: error }));
});

module.exports = router;
