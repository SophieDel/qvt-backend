var express = require('express');
var router = express.Router();
require('../models/connection');
const Message = require('../models/messages');
const Plan = require('../models/plans')
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
// const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');


//ROUTE Envoi d'un message d'un collab
router.post('/MessageCollab/:token', (req, res) => {
    User.findOne({ token: req.params.token }).then(data => {
  
     //la date d'enoiv
  let currentdate = new Date();

  const newMessage = new Message({
    dateRecep : currentdate,
    collab : req.params.token,
    message : req.body.message,
    equipe : data.equipe,
    repondu : false,
});
newMessage.save().then(data => {
    res.json({ result: true});
    console.log(data)
  });
    });
});


//ROute récupération des messages d'une équipe par le manager
router.get('/MessageEquipe/:equipe', (req, res) => {
    Message.find({ equipe: req.params.equipe , repondu : false}).then(data => {

         res.json({data});
      });
  });

  
//ROUTE Réponse du manager
router.post('/MessageReponse', (req, res) => {
      
           Message.updateOne(
                {message : req.body.message},
                { reponse : req.body.reponse, repondu : true},
            ).then(()=> {
              res.json({ result: true});
            })
          } )



//ROute récupération des messages du manager à un collab

router.get('/MessageCollab/:token', (req, res) => {
    Message.find({ collab: req.params.token}).then(data => {

         res.json({data});
      });
  });
  

  
//ROUTE Envoi d'un Plan d'action par le manager
router.post('/PlanManager/:token', (req, res) => {
  User.findOne({ token: req.params.token }).then(data => {

   //la date d'enoiv
let currentdate = new Date();


const newPlan = new Plan({
  datePlan : currentdate,
  message : req.body.message,
  equipe : data.equipe,
  encours : true,
});
newPlan.save().then(data => {
  res.json({ result: true});
  console.log(data)
});
  });
});

//ROute récupération des plans d'action par l"équipe
router.get('/PlanEquipe/:equipe', (req, res) => {
  Plan.find({ equipe: req.params.equipe, encours : true}).then(data => {

       res.json({data});
    });
});





module.exports = router;