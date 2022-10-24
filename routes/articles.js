var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");

const Article = require("../models/articles");

const themes = ["santé", "stress", "épanouissement", "conditions de travail"];
router.post("/new", (req, res) => {
  // Par cette route on ajoute un nouvel article dans la base de données

  // On vérifie que tous les champs nécessaires à la création d'une nouvelle entrée dans la base articles soient tous rentrés
  if (
    !checkBody(req.body, ["titre", "theme", "resume", "illustration", "lien"])
  ) {
    res.json({ result: false, error: "Un champ de saisie manque." });
    return;
  }

  if (!themes.includes(req.body.theme)) {
    res.json({ result: false, error: "Le thème entré n'est pas parmi la liste de thèmes définis" });
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
    .then((data) => res.json({ result: true, article: data }))
    .catch((error) => req.json({ result: false, error: error }));
});

module.exports = router;
