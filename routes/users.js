var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
// const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');


//ROUTE SIGNUP
router.post('/signup', (req, res) => {
  console.log('req.body', req.body)
  if (!checkBody(req.body, ['nom', 'prenom', 'email', 'mdp', 'poste', 'genre', 'equipe', 'service', 'cgu', 'manager', 'RGPDParternaire', 'RGPDqvt'])){
    res.json({ result: false, error: 'Merci de remplir tous les champs' });
    return;
  }
  //['genre', 'nom', 'prenom' , 'email', 'mdp', 'manager', 'poste', 'service', 'equipe' ,'RGPDqvt','RGPDParternaire','cgu']

  // Check if the user has not already been registered
  User.findOne({ email: req.body.email }).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.mdp, 10);

      const newUser = new User({
        genre : req.body.genre,
        nom : req.body.nom,
        prenom : req.body.prenom,
        email : req.body.email,
        mdp : hash,
        token: uid2(32),
        //datenaissance : req.body.datenaissance,
        manager : req.body.manager,
        poste : req.body.poste,
        service : req.body.service,
        equipe : req.body.equipe,
        RGPDqvt : req.body.RGPDqvt,
        RGPDParternaire : req.body.RGPDParternaire,
        cgu : req.body.cgu,
      });

      newUser.save().then(data => {
        res.json({ result: true, token: data.token, equipe : data.equipe, manager: data.manager, nom : data.nom, prenom : data.prenom});
        console.log("commentaire guigui",data)
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'Utilisateur déja existant. Renseigner un autre Email ou connectez-vous' });
    }
  });
});


//ROUTE SIGNIN
router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['email', 'mdp'])) {
    res.json({ result: false, error: 'Merci de remplir tous les champs' });
    return;
  }

  User.findOne({ email: req.body.email }).then(data => {
    if (data && bcrypt.compareSync(req.body.mdp, data.mdp)) {
      res.json({ result: true, token: data.token, equipe : data.equipe, manager: data.manager, nom : data.nom, prenom : data.prenom});
    } else {
      res.json({ result: false, error: 'Email ou mot de passe non reconnu' });
    }
  });
});


//ROUTE MDP OUBLIE PRIO 24








//ROUTE Questionnaire Hebdo
router.post('/Qhebdo/:token', (req, res) => {
  // if (!checkBody(req.body, ['nom', 'prenom', 'email', 'mdp', 'poste', 'genre', 'equipe', 'service', 'cgu', 'manager', 'RGPDParternaire', 'RGPDqvt'])){
  //   res.json({ result: false, error: 'Merci de remplir tous les champs' });
  //   return;
  // }
 
  User.findOne({ token: req.params.token }).then(data => {
    // if (data === null) {
    //   const hash = bcrypt.hashSync(req.body.mdp, 10);

    //   const newUser = new User({
    //     genre : req.body.genre,
    //     nom : req.body.nom,
    //     prenom : req.body.prenom,
    //     email : req.body.email,
    //     mdp : hash,
    //     token: uid2(32),
    //     //datenaissance : req.body.datenaissance,
    //     manager : req.body.manager,
    //     poste : req.body.poste,
    //     service : req.body.service,
    //     equipe : req.body.equipe,
    //     RGPDqvt : req.body.RGPDqvt,
    //     RGPDParternaire : req.body.RGPDParternaire,
    //     cgu : req.body.cgu,
    //   });

    const reponse = ({
      semaine : req.body.semaine,
      Q1 : req.body.Q1,
      Q2 : req.body.Q2,
      Q3 : req.body.Q3,
    })

      data.QHebdo.push(reponse)
      data.save();
      console.log (data);
        res.json({ result: true});
      
    } )
  });




//ROUTE Envoi d'un message à son manager
router.post('/MessageMnger/:token', (req, res) => {
 
  User.findOne({ token: req.params.token }).then(data => {
  console.log (data.equipe)


//Data2 = le manager
// const dataMnger = User.findOne({ equipe: "equipe1" , manager : true })
console.log (User.findOne({ equipe: 'equipe1' , manager : true }))

//la date d'enoiv
let currentdate = new Date();
// console.log (currentdate);


    //message envoyé au manager stocké chez le collab
    const MessageManager = ({
      DateEnvoi : currentdate,
      // Destinataire : dataMnger.token,
      MessageEnvoi : req.body.MessageEnvoi,
    })

    //message recu par le manager stocké chez le manager
    const MessageEquipe = ({
      DateRecep : currentdate,
      Destinataire : req.params.token,
      MessageRecu : req.body.MessageEnvoi,
      Reponse : false,
    })

      data.MessageMnger.push(MessageManager)
      // dataMnger.MessageEquipe.push(MessageEquipe)
      data.save();
      // dataMnger.save()
      // console.log (data);
      // console.log (dataMnger);
        res.json({ result: true});
      
    } )
  });





module.exports = router;
