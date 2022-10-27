var express = require('express');
var router = express.Router();

require('../models/connection');
const Message = require('../models/messages');
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


             //la date d'enoiv
  let currentdate = new Date();


      
           Message.updateOne(
                // { dateReponse : currentdate},
                {message : req.body.message},
                { reponse : req.body.reponse, repondu : true},
                // {repondu : true},
            ).then(()=> {
            // console.log ("data updatée" ,data);
              res.json({ result: true});
            })
          } )



//ROute récupération des messages du manager à un collab

router.get('/MessageCollab/:token', (req, res) => {
    Message.find({ collab: req.params.token}).then(data => {

         res.json({data});
      });
  });
  



module.exports = router;