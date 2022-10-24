var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');


//ROUTE SIGNUP
router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['genre', 'nom', 'prenom' , 'email', 'mdp', 'manager', 'poste', 'service', 'equipe' ,'RGPDqvt','RGPDParternaire','cgu'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

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
        res.json({ result: true, token: data.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});


//ROUTE SIGNIN
router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['email', 'mdp'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ email: req.body.email }).then(data => {
    if (data && bcrypt.compareSync(req.body.mdp, data.mdp)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
});


//ROUTE MDP OUBLIE PRIO 24

module.exports = router;
