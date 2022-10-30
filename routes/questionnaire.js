var express = require("express");
var app = express();
app.use(express.json());
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
// import inituleQuestions from "../collections/intituleQuestionsPerso.json";
const { checkBody } = require("../modules/checkBody");
const { defineProfile } = require("../modules/defineProfile");

inituleQuestions = require("../collections/intituleQuestionsPerso.json");

const thunderClient = false;

router.post("/reponses", (req, res) => {
  const token = req.body.token ? req.body.token : "test";
  // A l'origine on voulait que le post ne soit pas possible dans ce cas
  // (res.json({ result: false, message: "Il n'y a pas d'utilisateur connecté" }))
  // mais il est utile pour tester de pouvoir le faire sans utilisateur connecté

  // S'il n'y a pas de réponse
  if (!checkBody(req.body, ["reponses"])) {
    res.json({ result: false, error: "Aucune réponse n'a été saisie." });
    return;
  }

  console.log("req.body.reponses", req.body.reponses)

  const parsedReponses = thunderClient
    ? JSON.parse(req.body.reponses)
    : req.body.reponses;

    console.log("parsedReponses", parsedReponses)
  const theme = defineProfile(
    (answersArray = parsedReponses),
    (intitulesArray = inituleQuestions)
  );

  console.log("profil", theme);

  // On donne un tableau d'objet en entrée, il est stringnifié lors du post, et pour retrouver à nouveau le tableau on le parse avec Thunder Client.
  // Si on passe par le front du site ce n'est pas la peine.
  const test = true;

  if (token) {
    // Calcul du profil

    // Mise à jour du profil utilisateur
    User.updateOne(
      { token: token },
      { $set: { questionnairePerso: parsedReponses } },
      { profil: theme }
    )
      // On utilise set, car on écrase les réponses à chaque enregistrement
      .then((data) => {
        if (data.modifiedCount == 1) {
          // L'utilisateur a répondu
          console.log("update user =>", data);
          res.json({ result: true, reponses: data, profil: theme });
        } else {
          // L'utilisateur n'a pas été enreigistré
          res.json({
            result: false,
            message: "Aucun utilisateur trouvé",
            profil: theme,
          });
        }
      })
      .catch((error) => {
        res.json({ result: false, error: error });
      });
  } else if (test) {
    const newUser = new User({
      token: "test",
      questionnairePerso: parsedReponses,
      profil: theme,
    });
    newUser.save().then((data) => {
      console.log("user test created =>", data);
      res.json({ result: true, test: data, profil: theme });
    });
  }
});

module.exports = router;
