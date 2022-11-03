var express = require("express");
var router = express.Router();
require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcryptjs");

// ROUTE POST USER BY TOKEN
router.post("/user", (req, res) => {
  if (!checkBody(req.body, ["token"])) {
    res.json({ result: false, error: "no user" });
    return;
  } else {
    User.findOne({ token: req.body.token })
      .then((data) => {
        data
          ? res.json({ result: true, user: data })
          : res.json({ result: false, message: "no user found in database" });
      })
      .catch((error) => res.json({ result: false, error: error }));
  }
});

// ROUTE PUT USER BY TOKEN
router.post("/updateUser/", (req, res) => {
  if (!checkBody(req.body, ["token", "infoName", "info"])) {
    res.json({ result: false, error: "il manque des champs dans le body" });
    return;
  }

  User.updateOne(
    { token: req.body.token },
    { [req.body.infoName]: req.body.info }
  )
    .then((data) => {
      if (data.matchedCount === 0) {
        res.json({
          result: true,
          message: "Pas d'utilisateur trouvé",
          token: req.body.token,
          data: data,
        });
      } else if (data.modifiedCount === 0) {
        res.json({
          result: true,
          message: "Pas de mise à jour réalisé",
          token: req.body.token,
          data: data,
        });
      } else if (data.modifiedCount === 1) {
        res.json({
          result: true,
          message: "Un utilisateur mis à jour.",
          token: req.body.token,
          data: data,
        });
      } else {
        res.json({ result: true, message: data });
      }
    })
    .catch((error) => res.json({ result: false, error: error }));
});

//ROUTE SIGNUP
router.post("/signup", (req, res) => {
  console.log("req.body", req.body);
  if (
    !checkBody(req.body, [
      "nom",
      "prenom",
      "email",
      "mdp",
      "poste",
      "genre",
      "equipe",
      "service",
      "cgu",
      "manager",
      "RGPDParternaire",
      "RGPDqvt",
    ])
  ) {
    res.json({ result: false, error: "Merci de remplir tous les champs" });
    return;
  }

  // vérification que le user n'existe pas déja
  User.findOne({ email: req.body.email }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.mdp, 10);

      const newUser = new User({
        genre: req.body.genre,
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        mdp: hash,
        token: uid2(32),
        //datenaissance : req.body.datenaissance,
        manager: req.body.manager,
        poste: req.body.poste,
        service: req.body.service,
        equipe: req.body.equipe,
        RGPDqvt: req.body.RGPDqvt,
        RGPDParternaire: req.body.RGPDParternaire,
        cgu: req.body.cgu,
      });

      newUser.save().then((data) => {
        res.json({
          result: true,
          token: data.token,
          equipe: data.equipe,
          manager: data.manager,
          nom: data.nom,
          prenom: data.prenom,
        });
      });
    } else {
      // le User existe déja dans la DB
      res.json({
        result: false,
        error:
          "Utilisateur déja existant. Renseigner un autre Email ou connectez-vous",
      });
    }
  });
});

//ROUTE SIGNIN
router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["email", "mdp"])) {
    res.json({ result: false, error: "Merci de remplir tous les champs" });
    return;
  }

  User.findOne({ email: req.body.email }).then((data) => {
    if (data && bcrypt.compareSync(req.body.mdp, data.mdp)) {
      res.json({
        result: true,
        token: data.token,
        equipe: data.equipe,
        manager: data.manager,
        nom: data.nom,
        prenom: data.prenom,
        profil: data.profil,
        questionnairePerso: data.questionnairePerso,
      });
    } else {
      res.json({ result: false, error: "Email ou mot de passe non reconnu" });
    }
  });
});

//ROUTE MDP OUBLIE PRIO 24

//ROUTE saisie/envoi Questionnaire Hebdo
router.post("/Qhebdo/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    const reponse = {
      semaine: req.body.semaine,
      Q1: req.body.Q1,
      Q2: req.body.Q2,
      Q3: req.body.Q3,
    };
    data.QHebdo.push(reponse);
    data.save();
    console.log(data);
    res.json({ result: true });
  });
});

//ROUTE Envoi d'un message à son manager
router.post("/MessageMnger/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    //la date d'enoiv
    let currentdate = new Date();

    //message envoyé au manager stocké chez le collab
    const MessageManager = {
      DateEnvoi: currentdate,
      MessageEnvoi: req.body.MessageEnvoi,
    };

    //message recu par le manager stocké chez le manager
    const MessageEquipe = {
      DateRecep: currentdate,
      Destinataire: req.params.token,
      MessageRecu: req.body.MessageEnvoi,
      Reponse: false,
    };

    data.MessageMnger.push(MessageManager);
    data.save();
    res.json({ result: true });
  });
});

//Route récupération de la semaine de saisie du dernier quanstionnaire hebdo
router.get("/semaine/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data) {
      res.json({ data: data.QHebdo });
    } else {
      data = [];
    }
  });
});

//Route récupération du questionnaire de la semaine pour mood du moment
router.get("/Qsemaine/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data) {
      res.json({ data: data.QHebdo });
    } else {
      data = [];
    }
  });
});

//Route récupération des résultats de l'ensemble des quiz de la semaine pour une équipe
router.get("/:equipe/", (req, res) => {
  User.find({ equipe: req.params.equipe })
    .then((data) => {
      if (data) {
        console.log(data);
        res.json({ result: true, QHebdo: data.QHebdo, data: data });
      } else {
        res.json({ result: true, message: "aucune équipe trouvée" });
      }
    })
    .catch((error) => res.json({ result: false, error: error }));
});

module.exports = router;
