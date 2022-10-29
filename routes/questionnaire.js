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

const thunderClient = true;

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

  const parsedReponses = thunderClient
    ? JSON.parse(req.body.reponses)
    : req.body.reponses;

  const theme = defineProfile(
    (answersArray = parsedReponses),
    (intitulesArray = inituleQuestions)
  );

  console.log("profil", theme);

  // On donne un tableau d'objet en entrée, il est stringnifié lors du post, et pour retrouver à nouveau le tableau on le parse avec Thunder Client.
  // Si on passe par le front du site ce n'est pas la peine.

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
          console.log("data =>", Array.isArray(parsedReponses));
          res.json({ result: true, reponses: data });
        } else if (token != "test") {
          // L'utilisateur n'a pas été enreigistré
          res.json({ result: false, message: "Aucun utilisateur trouvé" });
        } else {
          // S'il n'y a pas de token test, on le créé
          const newUser = new User({
            token: "test",
            questionnairePerso: parsedReponses,
            profil: theme,
          });
          newUser.save().then((data) => res.json({ result: true, test: data }));
        }
      })
      .catch((error) => {
        res.json({ result: false, error: error });
      });
  }
});

module.exports = router;
