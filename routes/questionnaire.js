var express = require("express");
var app = express();
app.use(express.json());
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");

const thunderClient = false; 

router.post("/reponses", (req, res) => {
  const token = req.body.token;

  // S'il n'y a pas de réponse
  if (!checkBody(req.body, ["reponses"])) {
    res.json({ result: false, error: "Aucune réponse n'a été saisie." });
    return;
  }

  let parsedReponses = thunderClient ? JSON.parse(req.body.reponses) : req.body.reponses
  console.log("req.body.reponses", parsedReponses)
  // On donne un tableau d'objet en entrée, il est stringnifié lors du post, et pour retrouver à nouveau le tableau on le parse avec Thunder Client.
  // Si on passe par le front du site ce n'est pas la peine.

  if (token) {

    User.updateOne({ token: token }, { $set: { questionnairePerso: parsedReponses } })
    // On utilise set, car on écrase les réponses à chaque enregistrement
      .then((data) => {
        if (data.modifiedCount == 1) {
          // L'utilisateur a répondu
          console.log("data =>", Array.isArray(parsedReponses))
          res.json({ result: true, reponses: data });
        } else {
          // L'utilisateur n'a pas été enreigistré
          res.json({ result: false, message: "Aucun utilisateur trouvé" });
        }
      })
      .catch((error) => {
        res.json({ result: false, error: error });
      });
  } else {
    // res.json({ result: false, message: "Il n'y a pas d'utilisateur connecté" });
    const newUser = new User({
      token: "test",
      questionnairePerso: parsedReponses
    })
    newUser.save().then(data => res.json({ result: true, test: data }))
    ;
  }
});

module.exports = router;
