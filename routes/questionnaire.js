var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");

router.post("/:numeroQuestion", (req, res) => {
  const token = req.body.token;

  if (token) {
    const numeroQuestion = req.params.numeroQuestion;

    // S'il n'y a pas de réponse
    if (!checkBody(req.body, ["reponse"])) {
        res.json({ result: false, error: "Aucune réponse n'a été saisie." });
        return;
      }
    User.updateOne(
      { token: token },
      {$set: {[`questionnairePerso.${numeroQuestion}`]: req.body.reponse }},
    )
      .then((data) => {
        if (data.modifiedCount == 1){
            // L'utilisateur a répondu
        res.json({ result: true, reponse: data })
        } else if (data.matchedCount == 0){
            // L'utilisateur n'a pas été enreigistré
            res.json({ result: false, message: "Aucun utilisateur trouvé" })
        } else {
            // La question n'existe pas
            res.json({ result: false, message: "Pas de question associée"})
        }
    })
      .catch((error) => res.json({ result: false, error: error }));
  } else {
    res.json({ result: false, message: "Il n'y a pas d'utilisateur connecté" });
  }
});

module.exports = router;
