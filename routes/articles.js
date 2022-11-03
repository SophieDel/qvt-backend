var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");

const Article = require("../models/articles");

// Liste des thèmes définis
const themes = ["santé", "stress", "épanouissement", "conditions de travail"];

router.post("/new", (req, res) => {
  // Par cette route on ajoute un nouvel article dans la base de données

  // On vérifie que tous les champs nécessaires à la création d'une nouvelle entrée dans la base articles soient tous rentrés
  // Le champ illustration est optionnel (parfois pas d'illustration pertintente disponible)
  if (!checkBody(req.body, ["titre", "theme", "resume", "lien"])) {
    res.json({ result: false, error: "Un champ de saisie manque." });
    return;
  }

  // On vérifie que le thème entré est bien un thème défini
  if (!themes.includes(req.body.theme)) {
    res.json({
      result: false,
      error: "Le thème entré n'est pas parmi la liste de thèmes définis",
    });
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

// On affiche tous les articles
router.get("/", (req, res) => {
  Article.find()
    .then((data) => res.json({ result: true, articles: data }))
    .catch((error) => req.json({ result: false, error: error }));
});
// On affiche les articles qui correspondent au thème qui ressort du questionnaire
router.get("/:theme", (req, res) => {
  const theme = req.params.theme;

  // On vérifie que le thème apaprtient à la liste de thèmes
  if (!themes.includes(theme)) {
    res.json({
      result: false,
      error: "Le theme n'appartient pas à la liste de thèmes.",
    });
    return;
  }

  Article.find({ theme: theme })
    .then((data) => res.json({ result: true, articles: data }))
    .catch((error) => req.json({ result: false, error: error }));
});

module.exports = router;
