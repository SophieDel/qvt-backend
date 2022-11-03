var express = require("express");
var router = express.Router();
require("../models/connection");
const Message = require("../models/messages");
const Plan = require("../models/plans");
const User = require("../models/users");

//ROUTE Envoi d'un message d'un collaborateur à son manager
router.post("/MessageCollab/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    //la date d'enoiv
    let currentdate = new Date();

    const newMessage = new Message({
      dateRecep: currentdate,
      collab: req.params.token,
      message: req.body.message,
      equipe: data.equipe,
      repondu: false,
    });
    newMessage.save().then((data) => {
      res.json({ result: true });
      console.log(data);
    });
  });
});

//Route récupération des messages d'une équipe par le manager
router.get("/MessageEquipe/:equipe", (req, res) => {
  Message.find({ equipe: req.params.equipe, repondu: false }).then((data) => {
    res.json({ data });
  });
});

//ROUTE Réponse du manager à un message
router.post("/MessageReponse", (req, res) => {
  Message.updateOne(
    { message: req.body.message },
    { reponse: req.body.reponse, repondu: true }
  ).then(() => {
    res.json({ result: true });
  });
});

//Route récupération par un collaborateur des réponses de son manager à ses messages envoyés
router.get("/MessageCollab/:token", (req, res) => {
  Message.find({ collab: req.params.token }).then((data) => {
    res.json({ data });
  });
});

//ROUTE Envoi d'un Plan d'action par le manager à l'équipe
router.post("/PlanManager/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    //la date d'enoiv
    let currentdate = new Date();

    const newPlan = new Plan({
      datePlan: currentdate,
      message: req.body.message,
      titre: req.body.titre,
      equipe: data.equipe,
      encours: true,
    });
    newPlan.save().then((data) => {
      res.json({ result: true });
      console.log(data);
    });
  });
});

//Route récupération des plans d'action par l"équipe
router.get("/PlanEquipe/:equipe", (req, res) => {
  Plan.find({ equipe: req.params.equipe, encours: true }).then((data) => {
    res.json({ data });
  });
});

//ROUTE Mise à jour du statut du plan d'equipe par le manager à false pour qu'il ne s'affiche plus
router.post("/PlanFalse", (req, res) => {
  Plan.updateOne({ message: req.body.message }, { encours: false }).then(() => {
    res.json({ result: true });
  });
});

//ROUTE Mise à jour des messages recus par le collab pour pouvoir en supprimer un
router.post("/messagesup", (req, res) => {
  Message.deleteOne({ message: req.body.message }).then(() => {
    res.json({ result: true });
  });
});

module.exports = router;
